"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminClient, billingCustomer, hasPlus, stripeConfig } from "@/lib/plus";

async function signedInUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/membership");
  return user;
}

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value && process.env.VERCEL_ENV === "production") throw new Error("Missing site URL.");
  return new URL(value ?? "http://localhost:3000").origin;
}

export async function createCheckoutSession() {
  const user = await signedInUser();
  const { stripe, price } = stripeConfig();
  let customer = await billingCustomer(user.id);

  if (customer && await hasPlus(user.id)) redirect("/account");

  if (!customer) {
    const created = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    }, { idempotencyKey: `storytrail-customer-${user.id}` });
    const { error } = await adminClient().from("billing_customers").upsert({
      user_id: user.id,
      stripe_customer_id: created.id,
    }, { onConflict: "user_id", ignoreDuplicates: true });
    if (error) throw error;
    customer = await billingCustomer(user.id);
    if (!customer) throw new Error("Unable to link Stripe customer.");
  }

  const open = await stripe.checkout.sessions.list({ customer, status: "open", limit: 10 });
  const existing = open.data.find(session => session.mode === "subscription" && session.metadata?.price_id === price);
  if (existing?.url) redirect(existing.url);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { user_id: user.id, price_id: price },
    subscription_data: { metadata: { user_id: user.id } },
    success_url: `${siteUrl()}/account?checkout=success`,
    cancel_url: `${siteUrl()}/membership?checkout=cancelled`,
  }, { idempotencyKey: `storytrail-checkout-${customer}-${price}-${Math.floor(Date.now() / 60000)}` });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}

export async function openBillingPortal() {
  const user = await signedInUser();
  const customer = await billingCustomer(user.id);
  if (!customer) redirect("/membership");
  const { stripe } = stripeConfig();
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${siteUrl()}/account`,
  });
  redirect(session.url);
}
