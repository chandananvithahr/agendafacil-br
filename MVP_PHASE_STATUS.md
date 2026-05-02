# AgendaFacil MVP Phase Status

Date: 2026-05-02
Workspace: `C:\Users\chand\million-dollar-business-30days\_work\saas-clone-br-calendly-build`

## Scope Source

This build follows `PLAN.md`: a Brazil-first Calendly-style scheduling product with pt-BR positioning, Pix payment support, WhatsApp reminders, CPF/timezone localization, SEO pages, and a launch-ready onboarding/booking funnel.

The original product repo at `C:\Users\chand\projects\saas-clone-br-calendly` is outside the writable sandbox for this Codex session, so the completed implementation lives in this writable build copy.

## Completed Product Phases

### Week 1: Setup, Localization, Payments, Notifications

- Implemented Brazilian-first app metadata, legal routes, robots, sitemap, and Open Graph support.
- Added NextAuth typing cleanup so authenticated APIs can use `session.user.id` without unsafe casts.
- Added CPF/CNPJ, WhatsApp phone, Sao Paulo timezone, BRL price, plan, Stripe customer, and subscription fields in Prisma.
- Added guarded profile and availability APIs:
  - `src/app/api/profile/route.ts`
  - `src/app/api/availability/route.ts`
- Added guarded Stripe checkout API with Pix payment mode and safe 501 fallback when `STRIPE_SECRET_KEY` is missing:
  - `src/app/api/payments/checkout/route.ts`
- Added booking notification hooks for Resend email and WhatsApp provider integration:
  - `src/lib/notifications.ts`
  - `src/app/api/booking/route.ts`

### Week 2: Landing Page, SEO, Localized Product Surface

- Rebuilt the homepage as a full landing page for Brazilian professionals:
  - `src/app/page.tsx`
- Added static demo booking flow that does not require a database:
  - `src/app/demo/page.tsx`
  - `src/app/demo/DemoBooking.tsx`
- Rebuilt sign-in/onboarding page:
  - `src/app/auth/signin/page.tsx`
- Rebuilt dashboard first-run experience:
  - `src/app/dashboard/page.tsx`
- Added dashboard settings surfaces:
  - `src/app/dashboard/profile/page.tsx`
  - `src/app/dashboard/availability/page.tsx`
  - `src/app/dashboard/integrations/page.tsx`
  - `src/app/dashboard/payments/page.tsx`
  - `src/app/dashboard/upgrade/page.tsx`
- Rebuilt event creation flow:
  - `src/app/dashboard/events/new/page.tsx`
- Rebuilt public booking route:
  - `src/app/[username]/[eventSlug]/page.tsx`
  - `src/app/[username]/[eventSlug]/BookingForm.tsx`
- Added reusable SEO article system:
  - `src/lib/seo-content.tsx`
- Added SEO pages from the plan:
  - `/agendamento-online-gratis`
  - `/alternativa-calendly-portugues`
  - `/como-criar-link-agendamento`
  - `/agendamento-online-para-coaches`
  - `/agendamento-online-para-psicologos`
  - `/agendamento-online-para-nutricionistas`
  - `/aplicativo-agendamento-para-freelancers`
  - `/pagamento-pix-no-agendamento`
  - `/agendamento-online-com-whatsapp`

## Launch Phase Artifacts

The app now has the product surfaces needed for the Week 3 launch tasks:

- Public landing page with demo CTA.
- Ungated demo route for outreach and social posts.
- Pricing/upgrade path for Pro and Agency plans.
- SEO pages available in sitemap.
- Sign-in and dashboard onboarding for beta users.
- Booking flow ready for real professionals once database/auth/env vars are configured.

## Post-Review Fixes Applied

Claude review flagged that the first-pass MVP looked complete but still had blocking holes in signup, booking, and payment. Those blockers have been addressed in this copy:

- Moved first-user slug provisioning out of the risky `signIn` callback and into `events.createUser`.
- Added `slug @default(cuid())` so NextAuth adapter inserts satisfy the required unique slug field before the friendly slug is assigned.
- Created default Monday-Friday availability for new users during onboarding.
- Replaced hardcoded public booking slots with availability-backed slots from `Availability` rows.
- Booking API now rejects times outside saved availability and checks conflicts across the professional's whole calendar, not only the same event type.
- Added a booking honeypot and simple IP rate limit on `/api/booking`.
- Paid bookings now create a Stripe Checkout session with Pix and stay pending until Stripe confirms payment.
- Added Stripe webhook route at `/api/webhooks/stripe` to activate plans and confirm paid bookings.
- Changed plan checkout to `mode: subscription` with monthly recurring pricing and webhook plan activation.
- Profile and availability dashboard pages now load existing user data before saving, preventing demo defaults from overwriting real accounts.
- Wrapped dashboard payments search params in `Suspense`.
- Removed hardcoded `/og-image.png` metadata reference and moved app URLs toward env-driven config.
- Regenerated Prisma Client after the schema change.

External Week 3 and Week 4 tasks still require accounts and real-world execution outside this sandbox:

- Register domain and point DNS.
- Deploy to Railway, Render, or Vercel with production env vars.
- Configure real PostgreSQL, Google OAuth, Stripe Pix, Resend, and WhatsApp provider keys.
- Invite beta users and post launch content.
- Submit listings to Capterra/GetApp.
- Iterate based on user feedback.

## Verification

Passed:

```powershell
npm.cmd run lint
npx.cmd --no-install tsc --noEmit
$env:DATABASE_URL='postgresql://user:pass@localhost:5432/agendafacil'; $env:DIRECT_URL='postgresql://user:pass@localhost:5432/agendafacil'; npx.cmd --no-install prisma validate
$env:DATABASE_URL='postgresql://user:pass@localhost:5432/agendafacil'; $env:DIRECT_URL='postgresql://user:pass@localhost:5432/agendafacil'; npx.cmd --no-install prisma generate
```

Production build status:

```powershell
npm.cmd run build
```

Result: Next.js compiled successfully, then failed at the host worker step with:

```text
Error: spawn EPERM
```

This is an environment-level process spawning restriction in the current Windows/Codex shell. The independent gates above passed, and the build output reached `Compiled successfully` before the internal spawn failure.

## Production Env Vars Needed

```text
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_APP_URL
MAIL_FROM
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
WHATSAPP_API_TOKEN
```

## Recommended Next Runtime Step

Move or copy this build into a writable git repo, add the production environment variables, then run the same verification commands on a normal PowerShell session or CI host without the `spawn EPERM` restriction.
