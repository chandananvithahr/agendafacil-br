## AgendaFacil - agendamento online com Pix e WhatsApp para profissionais brasileiros

Brazil-first scheduling product. Public booking page in pt-BR, Pix payment via Stripe, WhatsApp reminders, CPF/timezone localization, SEO pages targeting Calendly's gap in Brazilian search.

### Stack

- Next.js 16 App Router (React 19)
- PostgreSQL via Prisma 6
- NextAuth (Google + email magic-link via Resend)
- Stripe (Pix checkout and monthly subscriptions)
- Resend (transactional email)
- Tailwind CSS v4
- Vercel Analytics + Speed Insights

### Local development

```powershell
npm install
npx prisma generate
npm run dev
```

`.env.local` template. Every key in this list is required for the corresponding feature, but the app degrades gracefully where possible:

```text
DATABASE_URL=postgresql://...                # Supabase pooler
DIRECT_URL=postgresql://...                  # Supabase direct connection for migrations
NEXTAUTH_SECRET=...                          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000    # redirects, sitemap, canonical URLs
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...                           # magic links + booking confirmations
MAIL_FROM=AgendaFacil <noreply@yourdomain>   # must be a Resend-verified sender
STRIPE_SECRET_KEY=sk_test_...                # Pix checkout for paid bookings + plans
STRIPE_PRICE_PRO=price_...                   # recurring monthly Stripe Price for Pro
STRIPE_PRICE_AGENCY=price_...                # recurring monthly Stripe Price for Agencies
STRIPE_WEBHOOK_SECRET=whsec_...              # required for /api/webhooks/stripe
KV_REST_API_URL=https://...                  # Vercel KV / Upstash REST URL for rate limits
KV_REST_API_TOKEN=...                        # Vercel KV / Upstash REST token
# KV_URL=...                                 # accepted as a URL fallback when KV_REST_API_URL is absent
WHATSAPP_API_TOKEN=...                       # optional, queues no-op without it
```

If KV is not configured, booking rate limits fall back to a per-process in-memory bucket so local development keeps working.

Supabase pooler trap: use the regional pooler prefix that matches the project. A wrong prefix can surface as `Tenant or user not found`, not as a credentials error.

### Zero-spend launch

If you want to ship without paying for anything yet, see [`ZERO-SPEND-LAUNCH.md`](./ZERO-SPEND-LAUNCH.md). Short version:

- **Resend free tier (3,000 emails/mo) works today**, but without a verified sender domain it only delivers to your own signup address. Enough to self-test sign-in; not enough to onboard real beta users.
- **There is no fully-free path to email arbitrary customers.** Cheapest unlock is a $1 `.xyz` first-year promo, or $8 `.com.br`. The Vercel subdomain `saas-clone-br-calendly.vercel.app` cannot be verified as a Resend sender.
- **WhatsApp is not free at scale.** Twilio gives a $15 trial; recommendation is to leave `WHATSAPP_API_TOKEN` unset (the code no-ops cleanly) and soften the landing-page copy until a customer asks for it.
- **Stripe account creation is free.** Defer until your first paying user.

### Deploying to Vercel

```powershell
npx vercel link
npx vercel env add DATABASE_URL production
npx vercel --prod --yes
```

Use `printf` rather than `echo` when piping secrets to `vercel env add`; `echo` can append a newline and corrupt the value.

Stripe setup after first deploy:

1. Create two recurring monthly Prices in Stripe: Pro and Agency.
2. Put their IDs into `STRIPE_PRICE_PRO` and `STRIPE_PRICE_AGENCY`.
3. Add webhook endpoint `https://<your-domain>/api/webhooks/stripe`.
4. Subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
5. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
6. Create a Vercel KV store or Upstash Redis REST database and set `KV_REST_API_URL` plus `KV_REST_API_TOKEN` for durable booking rate limits.
7. Enable Stripe Billing Portal in the Stripe dashboard so `/dashboard/payments` can open subscription management.

### Architecture map

| Path | What it is |
|------|-----------|
| `src/app/page.tsx` | pt-BR landing page with personas, pricing, FAQ |
| `src/app/demo/` | Static booking demo, no database |
| `src/app/auth/signin/page.tsx` | Google OAuth + email magic-link sign-in |
| `src/app/dashboard/` | Server-prefetched dashboard, profile, availability, payments |
| `src/app/dashboard/bookings/` | Authenticated bookings list with customer cancellation actions |
| `src/app/[username]/[eventSlug]/` | Public booking page with real availability + bookings |
| `src/app/api/booking/route.ts` | Public booking POST with rate limit, honeypot, availability validation, Pix checkout |
| `src/app/api/bookings/[id]/route.ts` | Authenticated booking cancellation API with cancellation email + Stripe refund attempt |
| `src/app/api/webhooks/stripe/route.ts` | Signature-verified Stripe webhook for bookings and subscriptions |
| `src/lib/auth.ts` | NextAuth config, pt-BR magic-link email, slug + default availability in `events.createUser` |
| `src/lib/scheduling.ts` | Timezone-correct slot generation via `date-fns-tz` |
| `prisma/schema.prisma` | User, EventType, Booking, Availability |

### Verification

```powershell
npm run lint
npx tsc --noEmit
$env:DATABASE_URL='postgresql://user:pass@localhost:5432/agendafacil'
$env:DIRECT_URL=$env:DATABASE_URL
npx prisma validate
npm run test:e2e
npm run build
```

`next build` can fail under Codex's Windows sandbox with `spawn EPERM` after "Compiled successfully"; verify production build on Vercel or a normal PowerShell session.
