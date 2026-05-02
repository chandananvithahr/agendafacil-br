## AgendaFácil — agendamento online com Pix e WhatsApp para profissionais brasileiros

Brazil-first scheduling product. Public booking page in pt-BR, Pix payment via Stripe, WhatsApp reminders, CPF/timezone localization, SEO pages targeting Calendly's gap in Brazilian search.

### Stack

- Next.js 16 App Router (React 19)
- PostgreSQL via Prisma 6
- NextAuth (Google + email magic-link via Resend SMTP)
- Stripe (Pix payment_method)
- Resend (transactional email)
- Tailwind CSS v4
- Vercel Analytics + Speed Insights

### Local development

```powershell
npm install
npx prisma generate
npm run dev
```

`.env.local` template — every key in this list is required for the corresponding feature, but the app degrades gracefully (returns 501 on the relevant route) when one is missing:

```
DATABASE_URL=postgresql://...                # Supabase pooler (aws-1 prefix, see below)
DIRECT_URL=postgresql://...                  # Supabase direct connection for migrations
NEXTAUTH_SECRET=...                          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000    # used for redirect URLs in webhooks
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...                           # email magic links + booking confirmations
MAIL_FROM=AgendaFacil <noreply@yourdomain>   # must be a Resend-verified sender
STRIPE_SECRET_KEY=sk_test_...                # Pix checkout for paid bookings + plans
STRIPE_WEBHOOK_SECRET=whsec_...              # required for /api/webhooks/stripe
WHATSAPP_API_TOKEN=...                       # optional, queues no-op without it
```

Supabase pooler trap: use the `aws-1` (or `aws-0`) prefix that matches the project's region — wrong prefix surfaces as `Tenant or user not found`, not as a credentials error.

### Deploying to Vercel

```powershell
npx vercel link
npx vercel env add DATABASE_URL production   # repeat per key — do NOT pipe with `echo`, use `printf`
npx vercel --prod --yes
```

Stripe webhook setup after first deploy:

1. Stripe dashboard → Developers → Webhooks → Add endpoint = `https://<your-domain>/api/webhooks/stripe`
2. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.

### Architecture map

| Path | What it is |
|------|-----------|
| `src/app/page.tsx` | pt-BR landing page with personas, pricing, FAQ |
| `src/app/demo/` | Static booking demo (no database, for outreach links) |
| `src/app/auth/signin/page.tsx` | Google OAuth + email magic-link sign-in |
| `src/app/dashboard/` | First-run onboarding, profile, availability, integrations, payments, upgrade |
| `src/app/[username]/[eventSlug]/` | Public booking page — server-renders real availability + bookings, falls back to "Agenda indisponível" if DB is unreachable |
| `src/app/booking/confirmado/` | Post-Pix-payment thank-you |
| `src/app/api/booking/route.ts` | Public POST — IP rate-limited, honeypot field, validates against availability, creates Pix checkout if `requiresPayment` |
| `src/app/api/webhooks/stripe/route.ts` | Verifies signature; activates plan OR confirms paid booking based on `metadata.type` |
| `src/app/api/{events,profile,availability,payments/checkout}/route.ts` | Authed dashboard APIs |
| `src/lib/scheduling.ts` | `buildPublicSlots` and `isInsideAvailability` — timezone-correct slot generation via `date-fns-tz` |
| `src/lib/auth.ts` | NextAuth config — slug + default availability assigned in `events.createUser` (after adapter insert) |
| `src/lib/rate-limit.ts` | In-memory IP bucket (single-instance only — swap for Upstash before high traffic) |
| `src/lib/notifications.ts` | Resend email + WhatsApp queue stub |
| `src/lib/seo-content.tsx` | One render component for all 9 SEO pages |
| `src/app/sitemap.ts` + `src/app/robots.ts` | SEO metadata |
| `prisma/schema.prisma` | User, EventType, Booking (with `@@unique([eventTypeId, startTime])` for race safety), Availability |

### What's still missing before scale

See `MVP_PHASE_STATUS.md` for the verified status of each MVP phase, and `REVIEW-FINDINGS.md` for the open product/UX gaps that should be closed before the launch posts in PLAN.md week 3.

### Verification

```powershell
npm run lint
npx tsc --noEmit
$env:DATABASE_URL='postgresql://user:pass@localhost:5432/agendafacil'
$env:DIRECT_URL=$env:DATABASE_URL
npx prisma validate
npm run build
```

`next build` failed under Codex's Windows sandbox with `spawn EPERM` after "Compiled successfully" — runs cleanly on Vercel and on a normal PowerShell session.
