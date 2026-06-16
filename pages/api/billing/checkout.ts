import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { stripe } from "@/lib/stripe";
import { getUserSubscription, upsertSubscription } from "@/lib/supabase/billing-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies
            ? Object.entries(req.cookies).map(([name, value]) => ({ name, value: value ?? "" }))
            : [];
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { priceId } = req.body as { priceId: string };
  if (!priceId) return res.status(400).json({ error: "priceId required" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.host}`;

  // Get or create Stripe customer
  let stripeCustomerId: string | undefined;
  const existing = await getUserSubscription(user.id);
  if (existing?.stripe_customer_id) {
    stripeCustomerId = existing.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = customer.id;
    await upsertSubscription({
      user_id: user.id,
      stripe_customer_id: stripeCustomerId,
      plan: "free",
      period: "monthly",
      status: "active",
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard/billing?success=1`,
    cancel_url: `${baseUrl}/pricing`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  res.json({ url: session.url });
}
