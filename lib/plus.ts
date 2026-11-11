import "server-only";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase server credentials are missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function stripeConfig() {
  const key = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  if (!key || !price) throw new Error("Stripe credentials are missing.");
  return { stripe: new Stripe(key), price };
}

export async function billingCustomer(userId: string) {
  const { data, error } = await adminClient().from("billing_customers")
    .select("stripe_customer_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data?.stripe_customer_id as string | undefined;
}

export async function hasPlus(userId: string) {
  const customer = await billingCustomer(userId);
  if (!customer) return false;
  const { stripe, price } = stripeConfig();
  for await (const subscription of stripe.subscriptions.list({ customer, status: "all" })) {
    if (subscription.status !== "active" && subscription.status !== "trialing") continue;
    const items = subscription.items;
    if (items.data.some(item => item.price.id === price)) return true;
    if (items.has_more) {
      for await (const item of stripe.subscriptionItems.list({ subscription: subscription.id })) {
        if (item.price.id === price) return true;
      }
    }
  }
  return false;
}
