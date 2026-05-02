# AgendaFacil review findings

Review date: 2026-05-02
Latest punch-list update: 2026-05-02

## Resolution path for subscriptions

Path taken: **Stripe subscription mode with recurring Price IDs**.

`src/app/api/payments/checkout/route.ts` now uses `mode: 'subscription'` and requires:

- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_AGENCY`

Those values must be real recurring monthly Stripe Price IDs. The route returns `501` if the selected plan's Price ID is missing. The webhook now handles subscription lifecycle events in addition to checkout events.

## Verdict

The core launch flows are wired for a soft beta: sign-in, server-prefetched dashboard, public booking, Pix checkout, Stripe webhook confirmation, and SEO pages. The remaining gaps are UX/scale items rather than blockers for the first beta users.

## Resolved

### HIGH - dashboard hardcoded user data

Closed in this pass.

- `src/app/dashboard/page.tsx` is now a server component.
- Dashboard prefetches the current user, plan, event count, upcoming bookings, and stats from Prisma.
- Stats now query bookings today, bookings since start of week, distinct guest emails, and current-month paid booking revenue from event prices.
- Plan badge reads the authenticated user's plan instead of hardcoded "Plano gratuito".
- `src/app/dashboard/loading.tsx` provides the first-render skeleton.

### HIGH - profile and availability could overwrite real data

Closed in this pass.

- `src/app/dashboard/profile/page.tsx` now server-prefetches the current profile.
- `src/app/dashboard/profile/ProfileForm.tsx` receives initial values as props and no longer starts from demo defaults.
- `src/app/dashboard/profile/loading.tsx` provides the route skeleton.
- `src/app/dashboard/availability/page.tsx` now server-prefetches saved slots.
- `src/app/dashboard/availability/AvailabilityForm.tsx` receives initial slots as props and no longer starts from an arbitrary Mon-Fri default.
- `src/app/dashboard/availability/loading.tsx` provides the route skeleton.

### HIGH - magic-link email was default NextAuth copy

Closed in this pass.

- `src/lib/auth.ts` now overrides `sendVerificationRequest`.
- Subject: `Seu link de acesso ao AgendaFacil`.
- HTML body uses AgendaFacil-style card layout and a single CTA: `Entrar no AgendaFacil`.
- From address uses `getMailFrom()`.

### MEDIUM - plan checkout did not use recurring Stripe Price IDs

Closed in this pass.

- `src/app/api/payments/checkout/route.ts` now uses recurring Stripe Price IDs from env vars.
- `src/app/api/webhooks/stripe/route.ts` now handles `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
- `README.md` documents `STRIPE_PRICE_PRO` and `STRIPE_PRICE_AGENCY`.

### MEDIUM - public booking timezone display only showed the professional timezone

Closed in this pass.

- `src/app/[username]/[eventSlug]/BookingForm.tsx` detects the viewer's IANA timezone client-side.
- Slot labels and selected summaries now show both professional time and viewer-local time when the zones differ.
- The API contract is unchanged: `startTime` stays UTC ISO.

### MEDIUM - in-memory rate limiter did not survive serverless cold starts

Closed in this pass.

- `src/lib/rate-limit.ts` now uses `@vercel/kv` sliding-window counters when `KV_REST_API_URL` or `KV_URL` plus `KV_REST_API_TOKEN` are configured.
- Local development falls back to the previous in-memory limiter and logs the fallback once per process.
- `README.md` documents the new KV env vars.

### LOW - dashboard `Receita do mes` recomputed against live event prices

Closed in this pass.

- `Booking.amount` snapshots the charged amount at create time.
- Paid bookings store the event price in cents, while free bookings store `0`.
- The dashboard monthly revenue stat now sums `booking.amount`.

### LOW - `tailwindcss/typography` was not installed for legal pages

Closed in this pass.

- `@tailwindcss/typography` is installed as a dev dependency.
- `src/app/globals.css` wires it through Tailwind v4 with `@plugin "@tailwindcss/typography";`.
- Legal pages keep their existing `prose` classes and now render with typography spacing.

### MEDIUM - Pro/Agency users had no subscription management surface

Closed in this pass.

- `src/app/api/payments/portal/route.ts` creates Stripe Billing Portal sessions for authenticated users with `stripeCustomerId`.
- `src/app/dashboard/payments/page.tsx` now shows a `Gerenciar assinatura` button and friendly 404 copy when no Stripe customer exists.
- `README.md` documents the required one-click Stripe Billing Portal dashboard configuration.

### MEDIUM - dashboard lacked a real bookings management surface

Closed in this pass.

- `src/app/dashboard/bookings/page.tsx` lists the authenticated user's bookings across event types in Hoje, Esta semana, and Anteriores sections.
- Future pending/confirmed bookings can be cancelled via `src/app/api/bookings/[id]/route.ts`, which soft-cancels, sends a cancellation email, and attempts a Stripe refund when possible.
- The dashboard upcoming-bookings card now links to the full bookings list.

### MEDIUM - availability form only supported one window per selected day

Closed in this pass.

- `src/app/dashboard/availability/AvailabilityForm.tsx` now stores `{ [dayOfWeek]: Array<{ startTime, endTime }> }`.
- Each day supports stacked start/end windows with `+ adicionar janela` and `remover` controls.
- The existing PUT schema already allows up to 14 slots, and `buildPublicSlots` already iterates every window for the selected weekday.

## Open gaps, ordered by likely customer impact

### MEDIUM - `next.config.ts` is empty, no `images.remotePatterns` for Google avatars

File: `next.config.ts`

Dashboard does not currently render `user.image`, so this is latent. Configure when avatars are shown.

### LOW - domain still needs production confirmation

Some UI copy references AgendaFacil branding and public links. Set `NEXT_PUBLIC_APP_URL` to the real production domain before launch and make sure `MAIL_FROM` is a verified Resend sender on that domain.

## Verified correct

- Sign-in slug provisioning runs in `events.createUser`, after the adapter inserts the user.
- Schema has `slug @unique @default(cuid())`.
- Public booking respects availability and server-side revalidates slots.
- Stripe webhook exists with signature verification.
- Paid booking checkout redirects to Stripe Pix and confirms booking only after webhook success.
- Booking race handling uses `@@unique([eventTypeId, startTime])` and catches `P2002`.
- IP rate limit + honeypot are wired into `/api/booking`.
- App URL / mail-from indirection via `src/lib/app-config.ts`.
- E2E smoke tests exist for landing, demo, and all 9 SEO routes without requiring live database or Stripe access.

## Pre-deploy checklist

1. Set every env var in `README.md` in Vercel production.
2. Create monthly recurring Stripe Prices and set `STRIPE_PRICE_PRO` / `STRIPE_PRICE_AGENCY`.
3. Point Stripe webhook at `https://<domain>/api/webhooks/stripe`.
4. Subscribe to checkout and subscription events listed in `README.md`.
5. Verify Resend domain or temporarily set `MAIL_FROM` to a Resend sandbox sender.
6. Run one real free booking and one real paid Pix booking end-to-end.
