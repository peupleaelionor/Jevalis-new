/**
 * Environment variable access with lazy runtime validation.
 * Variables are read at call time (not build time) to allow Vercel builds
 * without all env vars pre-configured.
 */

export const env = {
  // Database
  get DATABASE_URL() {
    return process.env.DATABASE_URL ?? "";
  },
  get DIRECT_URL() {
    return process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
  },

  // Auth
  get NEXTAUTH_SECRET() {
    return process.env.NEXTAUTH_SECRET ?? "";
  },
  get NEXTAUTH_URL() {
    return process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },

  // Stripe
  get STRIPE_SECRET_KEY() {
    return process.env.STRIPE_SECRET_KEY ?? "";
  },
  get STRIPE_WEBHOOK_SECRET() {
    return process.env.STRIPE_WEBHOOK_SECRET ?? "";
  },
  get STRIPE_PRICE_ID_REPORT() {
    return process.env.STRIPE_PRICE_ID_REPORT ?? "";
  },
  get STRIPE_PRICE_ID_GUIDE() {
    return process.env.STRIPE_PRICE_ID_GUIDE ?? "";
  },

  // Public
  get NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY() {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  },
  get NEXT_PUBLIC_APP_URL() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },

  // Storage
  get BLOB_READ_WRITE_TOKEN() {
    return process.env.BLOB_READ_WRITE_TOKEN;
  },

  // Email
  get RESEND_API_KEY() {
    return process.env.RESEND_API_KEY ?? "";
  },
  get RESEND_FROM_EMAIL() {
    return process.env.RESEND_FROM_EMAIL ?? "reports@jevalis.com";
  },

  // Admin
  get ADMIN_EMAIL() {
    return process.env.ADMIN_EMAIL ?? "";
  },

  // Google OAuth
  get GOOGLE_CLIENT_ID() {
    return process.env.GOOGLE_CLIENT_ID ?? "";
  },
  get GOOGLE_CLIENT_SECRET() {
    return process.env.GOOGLE_CLIENT_SECRET ?? "";
  },
} as const;

/**
 * Called at server startup / in critical API handlers.
 * Throws with a clear message if required variables are missing.
 */
export function validateEnv(): void {
  const required: Array<keyof typeof env> = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ JEVALIS: Missing required environment variables:\n  ${missing.join("\n  ")}\n\nCheck .env.example for reference.`
    );
  }
}
