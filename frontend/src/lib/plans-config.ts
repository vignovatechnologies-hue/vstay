import { useLocalState } from "./local-store";

export type Plan = {
  id: "monthly" | "yearly";
  name: string;
  price: number;
  currency: string;
  period: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

export type PlansConfig = { plans: Plan[] };

const KEY = "hostly.plans.config";

export const DEFAULT_PLANS: PlansConfig = {
  plans: [
    {
      id: "monthly",
      name: "Monthly",
      price: 999,
      currency: "₹",
      period: "/month",
      tagline: "Flexible month-to-month billing",
      features: [
        "Up to 60 beds",
        "Unlimited staff accounts",
        "Rent, complaints & laundry modules",
        "Email support",
      ],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 9999,
      currency: "₹",
      period: "/year",
      tagline: "Save 2 months with annual billing",
      features: [
        "Everything in Monthly",
        "Priority support",
        "Advanced reports & exports",
        "Free onboarding session",
      ],
      highlighted: true,
    },
  ],
};

export function usePlansConfig() {
  return useLocalState<PlansConfig>(KEY, DEFAULT_PLANS);
}
