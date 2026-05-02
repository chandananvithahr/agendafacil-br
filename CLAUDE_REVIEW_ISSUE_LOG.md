# Claude Review Issue Log

Date: 2026-05-02
Base commit: `ff86709`
Review target: pushed GitHub commit `c14139e` on `master`
Primary handoff log: `CLAUDE_ISSUE_LOG.md`

## Review Request

Review the handoff commit for correctness, regressions, and launch readiness. Do not re-audit the whole product from scratch. Focus on the 8 requested tasks and whether the implementation is safe to land into:

```text
C:\Users\chand\projects\saas-clone-br-calendly
```

## Changes To Review

1. Customer-side timezone labels on the public booking page.
2. Vercel KV sliding-window rate limiter with in-memory fallback.
3. `Booking.amount` schema field, migration SQL, create-time snapshot, and dashboard revenue sum.
4. Tailwind Typography install and Tailwind v4 CSS plugin registration.
5. Stripe Billing Portal API and dashboard button.
6. Dashboard bookings list, soft cancellation API, cancellation email, and refund attempt.
7. Multiple availability windows per weekday.
8. Playwright smoke tests for landing, demo, and the 9 SEO routes.

## Acceptance Criteria

- Existing public booking API contract remains unchanged: `startTime` is still UTC ISO.
- Rate limiting must not break local dev when KV env vars are missing.
- Booking amount must be stored in cents and free bookings must store `0`.
- Paid bookings must snapshot `event.price` at create time.
- Legal pages must keep `prose` styles and Tailwind v4 must load Typography through `@plugin`.
- Billing Portal route must require auth and must not create a session without `stripeCustomerId`.
- Bookings DELETE route must confirm ownership through `eventType.userId`.
- Cancellation must soft-update `status = CANCELLED`; it must not delete booking rows.
- Refund failures must be logged but must not fail cancellation.
- Availability PUT payload must remain `{ slots: Array<{ dayOfWeek, startTime, endTime }> }`.
- E2E tests must avoid live database, Stripe, OAuth, or authenticated dashboard dependencies.

## Known Blockers, Do Not Count As Code Defects

- Push from Codex fails with `SEC_E_NO_CREDENTIALS`.
- The target repo path was outside the Codex writable sandbox.
- `next build` compiles and then fails with sandbox `spawn EPERM`.
- `npm run test:e2e` fails in this sandbox with `spawn EPERM` when Playwright tries to spawn the web server.
- `prisma migrate dev --name add_booking_amount` was not run against a live database; the SQL migration file was written manually.

## Commands For Claude To Run

Run these in a normal PowerShell session after landing the files in the real repo:

```powershell
npm.cmd install
npm.cmd run lint
npx.cmd --no-install tsc --noEmit
$env:DATABASE_URL='<real dev database>'
$env:DIRECT_URL='<real direct database>'
npx.cmd --no-install prisma validate
npx.cmd --no-install prisma migrate dev --name add_booking_amount
npm.cmd run build
npm.cmd run test:e2e
```

## Specific Risk Areas

- `src/lib/rate-limit.ts`: check that KV fallback cannot throw at request time when env vars are absent.
- `src/app/api/bookings/[id]/route.ts`: check Stripe Checkout Session versus PaymentIntent refund handling.
- `src/app/dashboard/bookings/page.tsx`: check date grouping around user timezone boundaries.
- `src/app/dashboard/availability/AvailabilityForm.tsx`: check no invalid zero-slot or over-14-slot payload can be submitted.
- `tests/e2e/seo.spec.ts`: check importing `src/lib/seo-content.tsx` into Playwright tests is acceptable in the project toolchain.

## Claude Verification Result (2026-05-03)

**Verdict: PASS WITH FIXES** (one trivial environmental fix).

All 8 tasks verified end-to-end against the real repo at `C:\Users\chand\projects\saas-clone-br-calendly` from a normal shell, not Codex sandbox.

Acceptance-criteria checks:

- ✅ Public booking API `startTime` contract unchanged (UTC ISO).
- ✅ Rate limiter falls back to in-memory when KV env vars are absent (`getKvClient` returns null and logs once); also wraps KV calls in try/catch with the same fallback.
- ✅ `Booking.amount` stored in cents; free bookings store `0`; paid bookings snapshot `event.price` at create time (`src/app/api/booking/route.ts:98`).
- ✅ Tailwind v4 wired with `@plugin "@tailwindcss/typography";` in `src/app/globals.css`; `prose` classes preserved in `privacidade` and `termos`.
- ✅ Billing Portal route requires `getServerSession`, returns 404 when `stripeCustomerId` is null, never creates a session without one.
- ✅ Bookings DELETE route confirms ownership through `eventType.userId`, soft-cancels via `status: 'CANCELLED'` (no row delete), refund failure caught and logged with no cancel-flow failure.
- ✅ Refund handler correctly resolves `cs_*` Checkout Session ids to `pi_*` PaymentIntents via `stripe.checkout.sessions.retrieve`.
- ✅ Availability PUT payload still `{ slots: Array<{ dayOfWeek, startTime, endTime }> }`; form clamps to `slots.length > 0 && <= 14`.
- ✅ Bookings page date grouping is timezone-correct (`fromZonedTime` for week boundaries, `formatInTimeZone` for day-keys).
- ✅ E2E tests cover landing + demo + 9 SEO routes; no live database / Stripe / OAuth dependency.

Verification commands and results:

```text
npm install                       → ok
npm run lint                      → clean
npx prisma generate               → ok (was needed; client was stale in projects repo)
npx tsc --noEmit                  → 0 errors after generate
npx prisma validate               → valid
npm run build                     → Compiled successfully, 35 routes
npx playwright install chromium   → ok
npm run test:e2e                  → 10/10 passed in 41s
```

Findings:

- LOW. `src/lib/notifications.ts` Resend SDK throws on send failure but `sendBookingConfirmation` is awaited inside `Promise.all` in the booking route — an unhandled throw would 500 the booking. Not new in this commit; pre-existing. Not blocking.
- LOW. Subscription checkout uses `customer_email` rather than creating a Customer up front, so two checkouts by the same user can produce two Stripe Customers. The webhook overwrites `stripeCustomerId` on each `customer.subscription.created`, so the user record stays correct, but Stripe-side history is split. Acceptable for soft launch.

Known sandbox blockers (not code defects, all confirmed):

- Migration was not run against a real database in this verification run because `.env` points at a Prisma local dev server (localhost:51213) and there is no `DIRECT_URL`. SQL is correct; will apply via `prisma migrate deploy` against Supabase on first deploy.
- `next build` worked here (no Codex spawn EPERM outside sandbox).
- Playwright e2e ran here after `playwright install chromium` (no Codex spawn EPERM outside sandbox).

Landing recommendation:

- Ship to Vercel preview. Run `prisma migrate deploy` against Supabase as part of the deploy. Then add Stripe Price IDs, KV creds, OAuth keys per `README.md`, and run one real free booking + one real paid Pix booking E2E.

## Expected Review Output

Return:

```text
Verdict: PASS / PASS WITH FIXES / BLOCKED

Findings:
- Severity, file path, exact line, issue, impact, fix.

Known blockers confirmed:
- Push credential state
- Build/test sandbox state
- Migration real DB state

Landing recommendation:
- Exact command sequence to merge/push.
```

Do not include broad product strategy, unrelated UI redesign requests, or issues already listed as known sandbox blockers unless the implementation itself is wrong.
