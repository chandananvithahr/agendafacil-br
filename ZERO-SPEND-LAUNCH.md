# Zero-spend launch path

Goal: take AgendaFacil from "deployed but partial" to "able to onboard a real beta user" without spending money. Last updated 2026-05-03.

Production URL: https://saas-clone-br-calendly.vercel.app

## What works at $0 today

- Public landing page, demo, 9 SEO pages, sitemap, robots — all live and indexable.
- Sign-in with Google OAuth (already configured).
- Free booking flow (no payment required) — guest can pick a slot, the booking is recorded, and the dashboard shows it.
- Dashboard, profile, availability, integrations stubs, bookings list with cancel.
- Booking race safety, rate limit (in-memory fallback), TZ-correct slot generation.
- Supabase database (free tier — generous for a beta).

## What is gated behind a paid step

| Feature | What blocks it | Cheapest unlock |
|---|---|---|
| Magic-link sign-in to anyone besides yourself | Resend needs a verified sender domain | Buy a domain (~$1/yr promo or ~$8 .com.br) and verify in Resend |
| Booking confirmation email to real customers | Same as above | Same |
| Pro/Agency subscription | Stripe account + recurring Prices | Stripe sign-up is free; takes ~10 min once you have a CPF or business |
| Pix payment for paid event bookings | Same as above | Same |
| WhatsApp reminders | Twilio/Z-API account; per-message fee after free credit | Skip and remove from landing page until you have demand |
| Distributed rate limiter | Upstash Redis (Vercel Marketplace) | Free tier exists; add when traffic warrants |

## Three free tiers, with the catches spelled out

### Resend (FREE forever, with caveats)

- 3,000 emails/month, 100/day, no credit card.
- Without a verified domain you can only send from `onboarding@resend.dev` AND only to your own signup email. Good for self-testing magic-link sign-in, useless for real customers.
- **Action:** sign up at resend.com → get the API key → run `printf "re_YOUR_KEY" | vercel env add RESEND_API_KEY production` → magic-link works for your own inbox.

### Domain name (NOT free, but ~$1 promo exists)

- Vercel subdomain `saas-clone-br-calendly.vercel.app` is free and serves the app, but Vercel owns the apex so you cannot verify it as a Resend sender. Stuck with self-only emails.
- `.xyz` / `.click` / `.site` first-year promos at Namecheap or Porkbun: $1–$3.
- `.com.br` at registro.br: ~R$40/year, requires a Brazilian CPF.
- **There is no zero-cost path that lets you email arbitrary recipients.** Either spend $1, or stay on self-only testing until you have your first interested user.

### Twilio WhatsApp (free trial only)

- $15 signup credit. Sandbox WhatsApp numbers free during testing.
- Production WhatsApp Business API charges per conversation (~$0.005–$0.05). Once trial credit is gone, you're paying.
- Z-API (Brazilian alternative): free trial, then ~R$50/mo.
- **Recommendation:** don't wire WhatsApp at all until a customer asks for it. The code already no-ops cleanly when `WHATSAPP_API_TOKEN` is unset.

## The actual zero-spend playbook

1. **Today, $0:**
   - Sign up for Resend free tier. Add `RESEND_API_KEY` to Vercel.
   - Verify your own email by sending yourself a magic link from production.
   - Send the demo URL `https://saas-clone-br-calendly.vercel.app/demo` to friends and Brazilian SMB Facebook groups for feedback.
   - Use the demo as the lead capture surface; collect interested-user emails manually.

2. **First interested user, ~$1–$8:**
   - Buy a domain. Cheapest: `.xyz`/`.click` $1–$3. Best for SEO: `.com.br` ~$8.
   - Verify the domain in Resend → update `MAIL_FROM` to `agenda@yourdomain` → real customer emails work.
   - Point the domain at Vercel (Settings → Domains) → update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL`.

3. **First paying customer, $0 setup:**
   - Sign up for Stripe (free; only needs a card to receive payouts, not to create the account).
   - Create two recurring Prices (R$99 PRO, R$199 AGENCY).
   - Add webhook at `https://yourdomain/api/webhooks/stripe` for the 6 events listed in `README.md`.
   - Enable Billing Portal in Settings → Billing → Customer portal.
   - Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCY`, `STRIPE_WEBHOOK_SECRET` to Vercel.
   - Pix paid bookings and plan checkout now work.

4. **Only when WhatsApp is asked for:**
   - Twilio sandbox to test the integration on the $15 free credit.
   - Switch to Z-API or paid Twilio when WhatsApp reminders prove they reduce no-shows.

## What to remove from the landing page until WhatsApp is real

The landing page (`src/app/page.tsx`) currently advertises "Lembretes no WhatsApp" as a built feature in the hero, the recursos section, and pricing. If shipping the launch posts before wiring WhatsApp, soften the copy:

- Hero subtitle: change "Lembretes no WhatsApp" to "Em breve: lembretes no WhatsApp".
- Pro plan items: prefix WhatsApp item with "Em breve:".
- Demo confirmation message: keep as-is (it's a demo, the conditional "receberia" is honest).

This is a 5-minute copy edit. Worth doing before the Week 3 launch posts so users don't churn on day 2 when they realize the lembretes don't fire.

## Cost ceiling at scale (sanity check)

Assuming the PLAN.md month-1 target (20 paying R$99 = R$1,980 MRR ≈ $400 USD):

| Service | Free tier headroom | Cost if exceeded |
|---|---|---|
| Vercel | Hobby plan, generous bandwidth | $20/mo Pro tier |
| Supabase | 500MB DB, 50K monthly active users | $25/mo Pro |
| Resend | 3,000 emails/mo | $20/mo for 50K |
| Stripe | Free, takes 2.9% + R$0.80 per transaction | Same |
| Domain | One-time | R$40/yr |
| WhatsApp (when added) | $15 trial | ~$0.005/message after |

At 20 paying customers and conservative usage, you stay on free tiers for everything except the domain — total monthly burn ~$0–5 once the trial credits run out.
