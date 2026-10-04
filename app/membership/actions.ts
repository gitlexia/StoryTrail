"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCheckoutSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/membership");
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!stripeSecretKey || !stripePriceId) {
    throw new Error("Stripe environment variables are missing.");
  }

  const stripe = new Stripe(stripeSecretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
      },
    },
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/membership?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}