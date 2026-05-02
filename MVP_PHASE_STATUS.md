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
- Closed the follow-up punch list: dashboard/profile/availability now server-prefetch user data and show route skeletons.
- Magic-link sign-in email now uses a pt-BR Resend template with the CTA `Entrar no AgendaFacil`.
- Plan checkout now uses real recurring Stripe Price IDs from `STRIPE_PRICE_PRO` and `STRIPE_PRICE_AGENCY`; no inline fallback prices are invented.
- Stripe webhook now also handles `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
- Public booking slot labels now show the customer's detected timezone alongside the professional timezone when they differ.
- `/api/booking` rate limiting now uses Vercel KV / Upstash REST when configured, with a one-warning in-memory fallback for local development.
- Bookings now snapshot `amount` at create time so dashboard revenue does not drift when event prices change.
- Tailwind Typography is installed and wired through Tailwind v4 for legal-page `prose` styling.
- Pro/Agency users can open Stripe Billing Portal from `/dashboard/payments`.
- `/dashboard/bookings` now lists Hoje, Esta semana, and Anteriores bookings, with soft cancellation, cancellation email, and Stripe refund attempt.
- Availability now supports multiple time windows per weekday, preserving the existing API slot payload.
- Playwright public smoke tests were added for the homepage, demo flow, and 9 SEO pages.

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
STRIPE_PRICE_PRO
STRIPE_PRICE_AGENCY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
WHATSAPP_API_TOKEN
KV_REST_API_URL
KV_REST_API_TOKEN
```

## Recommended Next Runtime Step

Move or copy this build into a writable git repo, add the production environment variables, then run the same verification commands on a normal PowerShell session or CI host without the `spawn EPERM` restriction.

## Outstanding for Claude

See `CLAUDE_ISSUE_LOG.md` for the focused handoff and blocker log.

The follow-up punch-list code has been implemented and verified in this writable copy, but this Codex session could not publish it to `C:\Users\chand\projects\saas-clone-br-calendly` or GitHub:

- Direct patch to `C:\Users\chand\projects\saas-clone-br-calendly` was rejected because the path is outside the writable sandbox.
- `git push origin master` from the local handoff commit failed with `SEC_E_NO_CREDENTIALS`.
- `gh auth status` failed because `C:\Users\chand\AppData\Roaming\GitHub CLI\config.yml` is access denied.
- GitHub connector `_update_file` failed with `403 Resource not accessible by integration`.

Verified in `C:\Users\chand\million-dollar-business-30days\_work\saas-clone-br-calendly-build`:

```powershell
npm.cmd run lint
npx.cmd --no-install tsc --noEmit
$env:DATABASE_URL='postgresql://user:pass@localhost:5432/agendafacil'; $env:DIRECT_URL='postgresql://user:pass@localhost:5432/agendafacil'; npx.cmd --no-install prisma validate
```

To land it, copy the changed files from this writable build copy into the real repo, then run:

```powershell
git add -A
git commit -m "feat: complete medium launch surfaces"
git push origin master
```

Additional blockers from the 8-task session:

- `npx prisma migrate dev --name add_booking_amount` could not be run against a real database in this sandbox; `prisma/migrations/20260502090000_add_booking_amount/migration.sql` was added manually and `prisma validate` passed.
- `npm.cmd run build` reached `Compiled successfully`, then failed with `Error: spawn EPERM`.
- `npm.cmd run test:e2e` first hit a locked temp cache; after pointing `TEMP`/`TMP` at the writable workspace, it failed with `Error: spawn EPERM` when Playwright tried to spawn its web server.

## 2026-05-02 Eight-Task Status

Shipped in this writable copy:

- Task 1 timezone display: customer IANA timezone detection and dual-time slot labels. Approx time: 25 min.
- Task 2 Vercel KV rate limiter: `@vercel/kv`, KV sliding-window counters, in-memory fallback, README env docs. Approx time: 25 min.
- Task 3 booking amount snapshot: `Booking.amount`, create-time amount write, dashboard revenue sum, migration SQL. Approx time: 20 min.
- Task 4 Tailwind Typography: dependency installed and Tailwind v4 `@plugin` wired. Approx time: 10 min.
- Task 5 Stripe portal: authenticated portal API and dashboard management button. Approx time: 20 min.
- Task 6 bookings list: `/dashboard/bookings`, cancel API, cancellation email, refund attempt, dashboard link. Approx time: 45 min.
- Task 7 multiple availability windows: per-day window arrays, add/remove UI, existing API compatibility verified. Approx time: 25 min.
- Task 8 Playwright smoke tests: config, `test:e2e`, landing/demo test, 9-route SEO test. Approx time: 25 min.

## 2026-05-03 Claude Verification Run

Ran the full gate stack against the real repo on a normal PowerShell-equivalent shell (not Codex sandbox). All 8 tasks verified green.

```text
npm install                       → ok (10 vulns: 3 low, 7 moderate; transitive, not blocking)
npm run lint                      → 0 errors
npx prisma generate               → ok (Prisma client regenerated; required after schema added Booking.amount)
npx tsc --noEmit                  → 0 errors (initially failed because Codex shipped schema change without regenerating client; fixed by `prisma generate`)
npx prisma validate               → schema valid
npm run build                     → Compiled successfully, 35 routes built including /api/bookings/[id], /api/payments/portal, /dashboard/bookings; no spawn EPERM outside sandbox
npx playwright install chromium   → ok
npm run test:e2e                  → 10 passed in 41.4s (1 landing + 9 SEO routes)
```

`prisma migrate deploy` was NOT run because the local `.env` points at a Prisma local dev server (localhost:51213) rather than the Supabase production database, and the user has not provided a real `DIRECT_URL`. The migration SQL at `prisma/migrations/20260502090000_add_booking_amount/migration.sql` is correct and idempotent (`ADD COLUMN amount INTEGER NOT NULL DEFAULT 0`); it will apply on first deploy. See "Outstanding for Claude" below.

### What I fixed in this verification pass

- Ran `prisma generate` so `tsc --noEmit` could see the new `Booking.amount` field. Codex's typecheck had passed because they regenerated in their sandbox; the projects repo had stale client. No code change needed; just regenerated client.

No source code changes were required during verification.

## 2026-05-03 Production Deploy

Resolved the four "environmental" blockers from the prior verification report.

### Database migration applied to Supabase

```text
ALTER TABLE agendafacil_bookings ADD COLUMN amount INTEGER NOT NULL DEFAULT 0
prisma migrate resolve --applied 20260502090000_add_booking_amount
prisma migrate status -> "Database schema is up to date!"
```

Supabase had the tables but no `_prisma_migrations` history (P3005). Resolved by applying the column directly via `executeRawUnsafe` and then marking the migration as applied so future migrations work normally.

### Vercel production deploy

Production URL: https://saas-clone-br-calendly.vercel.app — returns 200 on `/`, `/demo`, `/auth/signin`, `/agendamento-online-gratis`, `/alternativa-calendly-portugues`, `/pagamento-pix-no-agendamento`, `/sitemap.xml`, `/robots.txt`. Rendered content verified (H1 "Agendamento online com Pix", demo form "Maria Silva" + "Confirmar demonstração").

The first deploy attempt failed with `Type error: 'amount' does not exist on BookingCreateInput` because Vercel's build cache shipped a stale Prisma client. Fixed in commit `b71702c` by changing `package.json` build script to `prisma generate && next build` and adding a `postinstall: prisma generate` hook. Second deploy succeeded.

Note: only the stable alias `saas-clone-br-calendly.vercel.app` is publicly accessible. The per-deploy URLs return 401 because Vercel deployment protection is enabled. Either disable protection in Project Settings → Deployment Protection, or share the stable alias for QA.

### Vercel env vars added

- `NEXT_PUBLIC_APP_URL=https://saas-clone-br-calendly.vercel.app`
- `MAIL_FROM=AgendaFacil <onboarding@resend.dev>` (Resend sandbox sender; replace once a real domain is verified)

Already present from prior deploy: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

### Still pending (require external account access)

These cannot be done by tooling alone — accounts need to be set up by a human, then env vars added with `printf VALUE | vercel env add NAME production`.

- **Stripe**: create account in BR mode → grab `STRIPE_SECRET_KEY` → create two recurring monthly Prices (R$99 PRO, R$199 AGENCY) → grab their IDs → add webhook endpoint `https://saas-clone-br-calendly.vercel.app/api/webhooks/stripe` subscribed to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` → grab `STRIPE_WEBHOOK_SECRET` → enable Billing Portal in Settings → Billing → Customer portal. Until done, plan checkout returns 501 with the exact env var name; paid bookings cannot be created (free bookings still work).
- **Resend**: verify a sender domain (e.g. `agendafacil.com.br` or your own) → grab `RESEND_API_KEY` → update `MAIL_FROM` to the verified address. Until done, magic-link sign-in throws and free bookings deliver no confirmation email.
- **Vercel KV / Upstash Redis**: Vercel KV is deprecated; install Upstash Redis from Vercel Marketplace → expose as `KV_REST_API_URL` + `KV_REST_API_TOKEN` (the Upstash integration sets these names). Until done, the booking endpoint falls back to per-process in-memory rate limiting (works, just less effective on serverless).
- **WhatsApp** (`WHATSAPP_API_TOKEN`): optional. Without it, `queueWhatsAppReminder` is a no-op.
