const isProduction = process.env.NODE_ENV === "production";

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "VITE_STRIPE_PUBLISHABLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "APP_URL",
] as const;

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  const message = `Missing required environment variables:\n  - ${missing.join("\n  - ")}`;
  if (isProduction) {
    throw new Error(message);
  }
  console.warn(`⚠️  ${message}`);
}

export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction,
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@jevalis.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  appUrl: process.env.APP_URL ?? "https://jevalis.com",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM_EMAIL ?? "rapports@jevalis.com",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseBucket: process.env.SUPABASE_BUCKET ?? "jevalis-reports",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
};
