# JEVALIS — European Real-Estate Financial Decision Platform

> SaaS tool for real-estate financial simulation and fiscal analysis across six European countries: **France**, **Suisse**, **Belgique**, **Luxembourg**, **Pays-Bas**, and **Allemagne**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Vercel Deployment](#vercel-deployment)
- [Pricing](#pricing)
- [Stripe Integration](#stripe-integration)
- [Remaining Risks](#remaining-risks)
- [Legal](#legal)

---

## Project Overview

JEVALIS is a European real-estate financial decision SaaS tool covering **France, Suisse, Belgique, Luxembourg, Pays-Bas, and Allemagne**. It enables users to simulate notary fees, rental yields, and complete fiscal impact analyses — then generate professional bank-ready PDF dossiers for each country.

Key capabilities:

- **Multi-country fiscal simulation** — notary fees, taxes, and rental yield calculations
- **Country-vs-country comparison** — side-by-side fiscal comparison tool
- **Bank-ready PDF reports** — professional dossiers generated via PDFKit
- **Premium content** — European real-estate investment guide (ebook)
- **Stripe-powered monetisation** — checkout sessions with webhook processing
- **SEO-optimised pages** — dedicated landing pages per country

---

## Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite 7 + Tailwind CSS 4 | SPA located at `/client` with shadcn/ui components |
| **Backend** | Express + tRPC | API server at `/server`, serverless entry at `/api` |
| **Database** | MySQL via Drizzle ORM | Schema and migrations at `/drizzle` |
| **Payments** | Stripe | Checkout sessions + webhook handling |
| **PDF Generation** | PDFKit | Serverless-compatible PDF creation |
| **Email** | Resend API | Transactional emails (reports, confirmations) |
| **Storage** | Supabase Storage (S3 fallback) | PDF report storage and retrieval |
| **Deployment** | Vercel | Serverless functions, region `cdg1` (Paris) |

---

## Project Structure

```
/api                → Vercel serverless function entry point
/client             → React SPA (Vite)
  /src/pages        → All page components
  /src/components   → UI components (shadcn/ui)
  /public           → Static assets (images, PDF)
/server             → Backend logic (tRPC routers, services)
  /_core            → Server setup, context, env validation
/shared             → Shared types and constants
/drizzle            → Database schema and migrations
/content            → Premium content (guides)
/patches            → Package patches
```

---

## Pages & Features

| Route | Description |
|---|---|
| `/` | Landing page with simulation preview |
| `/guide` | Premium European real-estate guide |
| `/blog` | Blog and content hub |
| `/comparateur` | Country fiscal comparison tool |
| `/comparateur/:pair` | Pairwise comparison (e.g., `/comparateur/france-vs-suisse`) |
| `/:country` | SEO country page (`france`, `suisse`, `belgique`, `luxembourg`, `pays-bas`, `allemagne`) |
| `/:country/frais-notaire` | Country-specific notary fees calculator |
| `/simulateur-rendement` | Rental yield calculator |
| `/dossier-bancaire` | Bank-ready PDF dossier generator |
| `/account` | User dashboard (simulations, reports, guide access) |
| `/login` | Client authentication |
| `/admin` | Admin dashboard |
| `/success` | Payment success page |
| `/apercu-ebook` | Ebook preview |
| `/cgv` | Terms of sale |
| `/mentions-legales` | Legal notices |
| `/confidentialite` | Privacy policy |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 10+
- **MySQL** database (Supabase recommended)
- **Stripe** account (test keys for development)
- **Resend** account (for transactional emails)

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example file and fill in all values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section below for the full list of required variables.

### Database Setup

Generate and run migrations:

```bash
pnpm run db:push
```

### Development

Start the development server (defaults to `localhost:3000`):

```bash
pnpm dev
```

### Build

Build for production (Vite frontend + esbuild API bundle):

```bash
pnpm build
```

### Preview

Preview the production build locally:

```bash
pnpm preview
```

### Type Checking

```bash
pnpm check
```

### Tests

```bash
pnpm test
```

---

## Environment Variables

All 13 required variables are validated at startup. In production, missing variables throw an error; in development, warnings are logged.

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MySQL connection string (Supabase transaction pooler) | `mysql://user:password@host:3306/database` |
| `JWT_SECRET` | Random secret for auth tokens (64+ characters) | *(random string)* |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (exposed to client) | `pk_test_...` or `pk_live_...` |
| `RESEND_API_KEY` | Resend email service API key | `re_...` |
| `RESEND_FROM_EMAIL` | Verified sender email address | `rapports@jevalis.com` |
| `SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |
| `SUPABASE_BUCKET` | Supabase storage bucket name | `jevalis-reports` |
| `ADMIN_EMAIL` | Admin backoffice email | `admin@jevalis.com` |
| `ADMIN_PASSWORD` | Admin backoffice password | *(secure password)* |
| `APP_URL` | Public application URL | `https://jevalis.com` |

> **Note:** `RESEND_FROM_NAME` is optional and defaults to `Jevalis`. `NODE_ENV` is set automatically by the runtime.

---

## Vercel Deployment

### Steps

1. **Connect** your repository to [Vercel](https://vercel.com)
2. **Set all environment variables** in the Vercel dashboard under Settings → Environment Variables
3. **Deploy** — Vercel will use the `vercel.json` configuration automatically
4. **Configure Stripe webhook** endpoint: `https://your-domain.com/api/stripe/webhook`

### Vercel Configuration

The `vercel.json` is pre-configured with the following settings:

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": "dist/public",
  "framework": null,
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3",
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index" },
    { "source": "/((?!api).*)", "destination": "/index.html" }
  ],
  "regions": ["cdg1"]
}
```

| Setting | Value | Purpose |
|---|---|---|
| Build command | `pnpm run build` | Vite frontend + esbuild API bundle |
| Output directory | `dist/public` | Serves the SPA static files |
| API routes | `/api/*` → `api/index.ts` | All API traffic routed to serverless function |
| SPA fallback | All non-API routes → `index.html` | Client-side routing support |
| Region | `cdg1` (Paris) | Low-latency for European users |
| Max duration | 30 seconds | Serverless function timeout |

---

## Pricing

| Tier | Price | Includes |
|---|---|---|
| **Free Preview** | Free | Instant simulation results (limited detail) |
| **Pack Complet** | 9,99 € | Ebook + basic PDF report |
| **Premium** | 39,99 € | Full professional bank-ready report |

---

## Stripe Integration

### Checkout Flow

- **Checkout sessions** are created for Pack Complet (9,99 €) and Premium (39,99 €) tiers
- Users are redirected to Stripe-hosted checkout, then back to `/success` on completion

### Webhook Events

The webhook endpoint (`/api/stripe/webhook`) handles the following events:

| Event | Action |
|---|---|
| `checkout.session.completed` | Activates user purchase, triggers email delivery |
| `payment_intent.succeeded` | Confirms successful payment |
| `payment_intent.payment_failed` | Logs failure, notifies user |

### Security

- **Idempotent** webhook processing — duplicate events are safely ignored
- **Signature verification** — all webhook payloads are verified using `STRIPE_WEBHOOK_SECRET`
- Raw body parsing is used for webhook signature validation

---

## Remaining Risks

| Risk | Mitigation |
|---|---|
| Database must be configured for production | Use Supabase MySQL or equivalent managed service; run `pnpm run db:push` after provisioning |
| Stripe keys must be switched from test to live | Replace `sk_test_` / `pk_test_` with `sk_live_` / `pk_live_` keys in production environment variables |
| DNS / domain must be configured on Vercel | Add custom domain in Vercel dashboard and configure DNS records |
| Email domain verification needed on Resend | Verify sender domain in Resend dashboard before going live |
| Supabase storage bucket permissions | Ensure the bucket exists and service role key has write access |

---

## Legal

JEVALIS provides indicative simulations only. Results do not constitute fiscal or legal advice. Users should consult qualified professionals for binding decisions.

© 2026 JEVALIS. All rights reserved.
