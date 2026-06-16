import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { upsertSubscription } from "@/lib/supabase/billing-helpers";
import { PLANS } from "@/lib/plans";
import type { PlanId, BillingPeriod } from "@/lib/plans";

export const config = { api: { bodyParser: false } };

async function buffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function planFromPriceId(priceId: string): { plan: PlanId; period: BillingPeriod } {
  for (const [planId, def] of Object.entries(PLANS)) {
    if (def.stripePriceMonthly === priceId) return { plan: planId as PlanId, period: "monthly" };
    if (def.stripePriceAnnual === priceId) return { plan: planId as PlanId, period: "annual" };
  }
  return { plan: "starter", period: "monthly" };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).json({ error: "Missing signature" });

  let event: Stripe.Event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${String(err)}` });
  }

  const sub = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const customerId = sub.customer as string;
      const userId = sub.metadata?.supabase_user_id;
      if (!userId) break;

      const priceId = sub.items.data[0]?.price?.id ?? "";
      const { plan, period } = planFromPriceId(priceId);

      await upsertSubscription({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        plan,
        period,
        status: sub.status,
        current_period_end: new Date((sub as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
        cancel_at_period_end: (sub as Stripe.Subscription & { cancel_at_period_end: boolean }).cancel_at_period_end,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const userId = sub.metadata?.supabase_user_id;
      if (!userId) break;
      await upsertSubscription({
        user_id: userId,
        stripe_subscription_id: sub.id,
        plan: "free",
        period: "monthly",
        status: "canceled",
      });
      break;
    }
  }

  res.json({ received: true });
}
