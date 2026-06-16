import type { PlanId, BillingPeriod } from "@/lib/plans";
import { createAdminClient } from "./server";

export type SubscriptionRow = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanId;
  period: BillingPeriod;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

export async function getUserSubscription(userId: string): Promise<SubscriptionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data ?? null;
}

export async function upsertSubscription(
  data: Partial<SubscriptionRow> & { user_id: string }
): Promise<void> {
  const admin = createAdminClient();
  await admin.from("subscriptions").upsert(data, { onConflict: "user_id" });
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (data?.stripe_customer_id) return data.stripe_customer_id;
  return null; // caller creates customer via Stripe and stores it
}

export async function getSubscriptionByStripeCustomer(
  stripeCustomerId: string
): Promise<SubscriptionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();
  return data ?? null;
}
