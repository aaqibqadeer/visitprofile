import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS, PLAN_ORDER, formatPrice } from "@/lib/plans";
import type { BillingPeriod } from "@/lib/plans";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <>
      <Head>
        <title>Pricing · VisitProfile</title>
        <meta name="description" content="Simple, transparent pricing for your digital business card." />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Nav */}
        <header className="border-b border-zinc-800 px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100">
              VisitProfile
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-16">
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold tracking-tight">Simple pricing</h1>
            <p className="text-zinc-400">
              Start free. Upgrade when you need more.
            </p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-xl bg-zinc-900 p-1">
              <button
                onClick={() => setPeriod("monthly")}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                  period === "monthly"
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod("annual")}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                  period === "annual"
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                Annual
                <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  Save ~17%
                </span>
              </button>
            </div>
          </div>

          {/* Plan grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN_ORDER.map((planId) => {
              const plan = PLANS[planId];
              return (
                <div
                  key={planId}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-6",
                    plan.highlight
                      ? "border-zinc-400 bg-zinc-800"
                      : "border-zinc-800 bg-zinc-900"
                  )}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-900">
                        Most popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="mb-2 text-sm font-medium text-zinc-400">{plan.name}</p>
                    <p className="text-3xl font-bold tracking-tight">
                      {formatPrice(period === "annual" ? plan.annualPrice : plan.monthlyPrice, period)}
                    </p>
                    {period === "annual" && plan.annualPrice > 0 && (
                      <p className="mt-1 text-xs text-zinc-500">
                        ${(plan.annualPrice / 100).toFixed(0)} billed annually
                      </p>
                    )}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <PlanCta planId={planId} period={period} highlight={plan.highlight} />
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-zinc-500">
            All plans include SSL, uptime monitoring, and no VisitProfile branding on your card.
          </p>
        </main>
      </div>
    </>
  );
}

function PlanCta({
  planId,
  period,
  highlight,
}: {
  planId: string;
  period: BillingPeriod;
  highlight?: boolean;
}) {
  const plan = PLANS[planId as keyof typeof PLANS];

  const handleUpgrade = async () => {
    const priceId = period === "annual" ? plan.stripePriceAnnual : plan.stripePriceMonthly;
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    if (res.status === 401) {
      window.location.href = `/login?next=/pricing`;
      return;
    }

    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
  };

  if (planId === "free") {
    return (
      <Link
        href="/signup"
        className="block rounded-xl bg-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-100 hover:bg-zinc-600 transition-colors"
      >
        Get started free
      </Link>
    );
  }

  return (
    <button
      onClick={() => void handleUpgrade()}
      className={cn(
        "w-full rounded-xl py-2.5 text-sm font-medium transition-colors",
        highlight
          ? "bg-zinc-100 text-zinc-900 hover:bg-white"
          : "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
      )}
    >
      Upgrade to {plan.name}
    </button>
  );
}
