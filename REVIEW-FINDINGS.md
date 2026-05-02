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

## Open gaps, ordered by likely customer impact

### MEDIUM - public booking timezone is the professional's, but the customer is shown only that timezone

Files: `src/app/[username]/[eventSlug]/page.tsx`, `src/app/[username]/[eventSlug]/BookingForm.tsx`

`buildPublicSlots` localises slots to the professional's timezone. The page shows `fuso {timezone}`, but a customer in another timezone may still misread the booking time. Add client-side timezone detection and show both professional and viewer time.

### MEDIUM - in-memory rate limiter does not survive serverless cold starts

File: `src/lib/rate-limit.ts`

The bucket map lives in one Node process. Good enough for soft launch, but replace with Upstash Redis or Vercel KV before serious traffic.

### MEDIUM - `next.config.ts` is empty, no `images.remotePatterns` for Google avatars

File: `next.config.ts`

Dashboard does not currently render `user.image`, so this is latent. Configure when avatars are shown.

### LOW - dashboard `Receita do mes` recomputes against the live event price

File: `src/app/dashboard/page.tsx`

The current-month revenue stat sums `eventType.price` joined at query time. If a user raises a service price mid-month, all paid bookings in that month re-price retroactively in the dashboard. Fix later by snapshotting the amount on the `Booking` row at create time (add `Booking.amount Int`) and summing that column.

### LOW - `tailwindcss/typography` not installed but `prose` classes used in legal pages

Files: `src/app/privacidade/page.tsx`, `src/app/termos/page.tsx`

Either install `@tailwindcss/typography` or replace `prose` classes with explicit utilities.

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

## Pre-deploy checklist

1. Set every env var in `README.md` in Vercel production.
2. Create monthly recurring Stripe Prices and set `STRIPE_PRICE_PRO` / `STRIPE_PRICE_AGENCY`.
3. Point Stripe webhook at `https://<domain>/api/webhooks/stripe`.
4. Subscribe to checkout and subscription events listed in `README.md`.
5. Verify Resend domain or temporarily set `MAIL_FROM` to a Resend sandbox sender.
6. Run one real free booking and one real paid Pix booking end-to-end.
