import Stripe from "stripe";
import { env } from "./env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }
  return _stripe;
}

export const PRICES = {
  REPORT: 2999,   // 29.99 EUR in cents
  GUIDE: 1999,    // 19.99 EUR in cents
  BUNDLE: 3999,   // 39.99 EUR in cents
} as const;

export const PRICE_LABELS = {
  REPORT: "29,99 €",
  GUIDE: "19,99 €",
  BUNDLE: "39,99 €",
} as const;
