import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { withAuth } from "@/lib/with-auth";
import { getUserSubscription } from "@/lib/supabase/billing-helpers";
import { PLANS } from "@/lib/plans";
import type { SubscriptionRow } from "@/lib/supabase/billing-helpers";
import type { PlanId } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface Props {
  user: { id: string; email: string; role: "user" | "admin" };
  subscription: SubscriptionRow | null;
}

export default function BillingPage({ user, subscription }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [success, setSuccess] = useState(router.query.success === "1");

  useEffect(() => {
    if (router.query.success === "1") {
      setSuccess(true);
      void router.replace("/dashboard/billing", undefined, { shallow: true });
    }
  }, [router]);

  const planId = (subscription?.plan ?? "free") as PlanId;
  const plan = PLANS[planId];
  const status = subscription?.status ?? "active";

  const handleUpgrade = async () => {
    setLoading("checkout");
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId:
          subscription?.period === "annual"
            ? plan.stripePriceAnnual
            : plan.stripePriceMonthly,
      }),
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
    setLoading(null);
  };

  const handlePortal = async () => {
    setLoading("portal");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "Could not open billing portal");
    setLoading(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Billing · VisitProfile</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Nav */}
        <nav className="border-b border-zinc-800 px-6 py-3">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/analytics" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="mb-8 text-2xl font-bold">Billing</h1>

          {success && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              You&apos;re now on the {plan.name} plan. Enjoy!
            </div>
          )}

          {/* Current plan */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Current plan</p>
                <p className="mt-1 text-2xl font-bold">{plan.name}</p>
                {subscription?.current_period_end && (
                  <p className="mt-1 text-sm text-zinc-500">
                    {subscription.cancel_at_period_end ? "Cancels" : "Renews"} on{" "}
                    {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === "active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : status === "canceled"
                    ? "bg-zinc-700 text-zinc-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {status}
              </span>
            </div>

            {subscription?.cancel_at_period_end && (
              <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-400">
                Your subscription is set to cancel at the end of the billing period.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {planId === "free" && (
                <Link
                  href="/pricing"
                  className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
                >
                  View plans
                </Link>
              )}
              {planId !== "free" && (
                <>
                  <button
                    onClick={() => void handlePortal()}
                    disabled={loading === "portal"}
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-100 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  >
                    Manage subscription
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    href="/pricing"
                    className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
                  >
                    Change plan
                  </Link>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Questions about billing?{" "}
            <a href={`mailto:support@visitprofile.com`} className="text-zinc-300 hover:text-zinc-100 transition-colors">
              Contact support
            </a>
          </p>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth("user", async (_ctx, user) => {
  const subscription = await getUserSubscription(user.id);
  return { props: { subscription } };
});
