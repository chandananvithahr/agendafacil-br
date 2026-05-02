# AgendaFácil — review findings

Review date: 2026-05-02
Reviewer: Claude (Opus 4.7), against PLAN.md and MVP_PHASE_STATUS.md.
Scope: full code + product review of the build at this commit.

## Verdict

The four flows that determine launch viability — sign-in, public booking, paid Pix booking, and plan upgrade — are wired end-to-end with timezone-correct slot generation, race-safe booking inserts, IP rate limiting, signature-verified Stripe webhooks, and graceful degradation when env vars are missing. The product is **launch-ready as a soft beta** once env vars are configured in Vercel and Stripe webhooks are pointed at the deployed URL.

The gaps below are real but none of them block the first 20 paying customers from PLAN.md week 3.

---

## Open gaps, ordered by likely customer impact

### HIGH — dashboard hardcodes the user's data

**Files:** `src/app/dashboard/page.tsx`, `src/app/dashboard/profile/page.tsx`, `src/app/dashboard/availability/page.tsx`

- Dashboard stats cards always show `0 / R$0` and the badge always says `Plano gratuito` even for paying users.
- Profile page's `useState` initialiser is the demo persona "Maria Silva" — opening the page on a real account and clicking Save overwrites the user's real record with the demo defaults.
- Availability page hardcodes `09:00–17:00` Mon–Fri instead of fetching the saved values.

**Why it matters:** the first beta user who edits their profile loses their data silently. The dashboard's static numbers also kill the "this product knows me" feeling.

**Fix:** make these server components that prefetch via the existing GET endpoints and pass props to a client form, or `useEffect(() => fetch('/api/profile'))` on mount with a loading state.

### HIGH — email magic-link template is the NextAuth default (not pt-BR)

**File:** `src/lib/auth.ts:61–71`

`EmailProvider` has no `sendVerificationRequest` override, so the user receives the default English-leaning template. Override with a Portuguese subject/body for product consistency.

### MEDIUM — public booking timezone is the professional's, but the customer is shown only the time, not "in your timezone"

**Files:** `src/app/[username]/[eventSlug]/page.tsx`, `src/app/[username]/[eventSlug]/BookingForm.tsx`

`buildPublicSlots` correctly localises slots to the professional's timezone. The page footer says `fuso {timezone}`. A São Paulo customer booking a Manaus professional sees Manaus times with a small `fuso America/Manaus` label and may book the wrong hour. Auto-detect the customer's IANA timezone client-side and surface both ("16:00 em São Paulo / 15:00 no seu fuso").

### MEDIUM — booking checkout uses `mode: 'payment'` for a one-time charge, but plan checkout in `payments/checkout` is also `mode: 'payment'` for what is sold as R$99/mo

**File:** `src/app/api/payments/checkout/route.ts:34`

A monthly subscription must be `mode: 'subscription'` with a recurring Stripe Price ID. Currently the customer pays once and the webhook sets `User.plan = PRO` forever with no recurring billing. Either (a) switch to subscription with a real Price ID per plan, or (b) change the marketing copy to "R$99 por 30 dias, renove quando quiser" — the latter is a one-paragraph copy edit, the former is the right long-term move but needs Stripe Products configured first.

### MEDIUM — in-memory rate limiter does not survive serverless cold starts

**File:** `src/lib/rate-limit.ts`

The bucket Map lives in `globalThis` of one Node process. On Vercel each function invocation may hit a new container, so the limit is effectively per-container, not per-IP. Good enough for soft launch (will still slow down a single-shot bot), but swap for Upstash Redis or Vercel KV before serious traffic.

### MEDIUM — `next.config.ts` is empty, no `images.remotePatterns` for Google avatars

**File:** `next.config.ts`

Dashboard doesn't currently render `user.image`, so this is latent. Configure when you start showing avatars in the booking page header or upgrade modal.

### LOW — `tailwindcss/typography` not installed but `prose` classes used in legal pages

**Files:** `src/app/privacidade/page.tsx`, `src/app/termos/page.tsx`

The `prose` class no-ops without the plugin. Either install `@tailwindcss/typography` or remove the `prose prose-gray` className and write explicit Tailwind utilities.

### LOW — sitemap and OG metadata hardcode `saas-clone-br-calendly.vercel.app`

**Files:** `src/app/sitemap.ts:5`, `src/app/layout.tsx:18`, `src/lib/seo-content.tsx:136`

Move to `process.env.NEXT_PUBLIC_APP_URL` so the canonical URLs are correct after the .com.br domain points at Vercel.

### LOW — `agendafacil.com.br` is referenced in onboarding UI but the domain is not yet registered

`src/app/dashboard/profile/page.tsx:70`, `src/app/dashboard/events/new/page.tsx:135`, etc. Replace these visual snippets with whatever domain you actually own, or leave them as preview-only and don't show them in dashboards until the user's slug is confirmed.

### LOW — Pix payment redirect from `/api/booking` uses `req.headers.get('origin')` which can be missing for some User-Agents

**File:** `src/app/api/booking/route.ts:103`

Falls back to `getAppUrl()` which is correct. No action needed unless a customer reports a bad redirect.

### LOW — booking confirmation email always formats time in `America/Sao_Paulo`

**File:** `src/lib/notifications.ts:18`

Should use the booking's `eventType.user.timezone`. The newer webhook handler already passes `timezone` into the notification payload — `bookingEmailHtml` just needs to consume it.

---

## Verified correct (was flagged in early draft, withdrawn after re-reading the code)

- Sign-in flow: slug provisioning runs in `events.createUser`, after the adapter inserts the user. Schema has `slug @unique @default(cuid())` so the initial INSERT satisfies the unique-not-null constraint before the rename. **Works.**
- Public booking respects availability: `loadBookingData` queries `prisma.availability.findMany` and `prisma.booking.findMany` for a 15-day window, `buildPublicSlots` filters by day-of-week and existing bookings in the user's timezone, the API revalidates with `isInsideAvailability` server-side. **Works.**
- Stripe webhook exists at `src/app/api/webhooks/stripe/route.ts` with signature verification, branches on `metadata.type` for plan vs booking, handles async Pix success and async Pix failure (the failure case rolls the booking back to `UNPAID/PENDING`). **Works.**
- Pix payment intent: paid bookings create a checkout session, return `paymentUrl`, client redirects, deletion-on-failure rollback prevents zombie bookings. **Works.**
- TOCTOU race on booking conflict: schema has `@@unique([eventTypeId, startTime])` and the route catches `P2002` and returns 409. **Works.**
- IP rate limit + honeypot: `lib/rate-limit.ts` and the `company` field in `bookingSchema` both wired into `/api/booking`. **Works.**
- App URL / mail-from indirection via `lib/app-config.ts`. **Works.**

---

## Pre-deploy checklist

1. Set every env var in `README.md` in Vercel production. Use `printf` not `echo` when piping secrets to `vercel env add` (echo appends `\n` and corrupts the value — see prior incident).
2. After first deploy, point Stripe webhook at `https://<domain>/api/webhooks/stripe` and copy the signing secret back into `STRIPE_WEBHOOK_SECRET`.
3. Verify Resend domain or temporarily set `MAIL_FROM` to a Resend `onboarding@resend.dev` sandbox address.
4. Run a real booking against your own slug end-to-end: free event → email confirmation; paid event → Pix QR → payment → email confirmation + status flip in DB.
5. Then close the HIGH gaps above (dashboard prefetch, magic-link pt-BR template) before posting the launch threads from PLAN.md week 3.
