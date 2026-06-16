export type PlanId = "free" | "starter" | "pro" | "business";
export type BillingPeriod = "monthly" | "annual";

export type PlanDefinition = {
  name: string;
  monthlyPrice: number; // USD cents
  annualPrice: number; // USD cents per year
  stripePriceMonthly: string;
  stripePriceAnnual: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    stripePriceMonthly: "",
    stripePriceAnnual: "",
    features: [
      "1 profile",
      "All themes",
      "Contact links",
      "vCard download",
      "QR code",
    ],
  },
  starter: {
    name: "Starter",
    monthlyPrice: 900,
    annualPrice: 9000,
    stripePriceMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    stripePriceAnnual: process.env.STRIPE_PRICE_STARTER_ANNUAL ?? "",
    features: [
      "1 profile",
      "All themes",
      "Contact links",
      "vCard download",
      "QR code",
      "Analytics dashboard",
      "Custom shortcuts",
    ],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 1900,
    annualPrice: 19000,
    stripePriceMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    stripePriceAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
    features: [
      "3 profiles",
      "All themes",
      "Contact links",
      "vCard download",
      "QR code",
      "Analytics dashboard",
      "Custom shortcuts",
      "Featured card",
      "Gallery & story sections",
      "Priority support",
    ],
    highlight: true,
  },
  business: {
    name: "Business",
    monthlyPrice: 4900,
    annualPrice: 49000,
    stripePriceMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? "",
    stripePriceAnnual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL ?? "",
    features: [
      "Unlimited profiles",
      "All themes",
      "Contact links",
      "vCard download",
      "QR code",
      "Analytics dashboard",
      "Custom shortcuts",
      "Featured card",
      "Gallery & story sections",
      "Priority support",
      "Team management",
      "Custom domain",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "starter", "pro", "business"];

export function formatPrice(cents: number, period: BillingPeriod): string {
  if (cents === 0) return "Free";
  const monthly = period === "annual" ? Math.round(cents / 12) : cents;
  return `$${(monthly / 100).toFixed(0)}/mo`;
}
