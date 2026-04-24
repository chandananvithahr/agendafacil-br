# Product #1 — Brazilian Portuguese Calendly Clone
**Priority:** Build THIRD (30-45 days, highest ceiling at $10-65K/mo)
**Model:** Subscription R$99/mo (~$20) via Stripe + Pix

---

## The Problem
Calendly has terrible Brazilian Portuguese localization — no Pix payment, no pt-BR UI, no local SEO, no Brazilian identity. 215M Brazilians, fastest-growing digital SMB market in Latin America. "SEO like it's 2005" — zero competition for these keywords.

## The Buyer
Brazilian coaches, therapists, tutors, consultants, freelancers who need online scheduling. They want a tool that feels local, has Pix (Brazil's instant payment system), and has support in Portuguese.

## Why Cal.com as the Base
- 100% open source (MIT license) — free to fork and use commercially
- Already has the core scheduling logic built
- Active community, well-maintained codebase
- You just need: pt-BR translation + Pix + .com.br domain + local SEO

---

## Tech Stack
- **Base:** Cal.com (fork from GitHub — free)
- **Language:** TypeScript/Next.js (Cal.com's stack)
- **Database:** PostgreSQL (Cal.com uses Prisma)
- **Hosting:** Railway or Render (~$20/mo) or self-host on a VPS ($10/mo)
- **Payments:** Stripe (supports Pix natively since 2022)
- **Domain:** .com.br (~$15/yr)
- **Email:** Resend ($0 free tier, then $20/mo)
- **Total cost:** $25-35/mo

---

## What to Change from Cal.com
1. Full pt-BR translation of all UI strings
2. Pix as primary payment option (via Stripe)
3. Brazilian phone format (+55) as default
4. Brazilian timezone (America/Sao_Paulo) as default
5. CPF field for Brazilian invoicing
6. Branding: new name, new logo, Brazilian colors/feel
7. Landing page in Portuguese with local SEO content
8. WhatsApp reminders instead of SMS (Brazilians use WhatsApp, not SMS)

---

## Name Ideas
- Agenda.com.br
- Agendafácil.com.br
- Marcarconsulta.com.br
- Minhagenda.com.br

---

## 30-Day Day-by-Day Plan

### Week 1 — Setup + Translation (Days 1-7)
- **Day 1:** Fork Cal.com. Set up local dev environment. Register .com.br domain.
- **Day 2:** Get the app running locally. Map all UI strings that need translation.
- **Day 3-4:** Full pt-BR translation of UI (use DeepL for first pass, then fix manually)
- **Day 5:** Set up Railway/Render for hosting. Deploy first version.
- **Day 6:** Configure Stripe + Pix payment flow
- **Day 7:** Add WhatsApp reminder integration (Twilio WhatsApp API or Z-API for Brazil)

### Week 2 — Localization + Landing Page (Days 8-14)
- **Day 8:** Build Brazilian landing page — headline: "Agendamento online para profissionais brasileiros"
- **Day 9:** Write 10 SEO pages in Portuguese: "agendamento online grátis", "alternativa ao Calendly em português", "como criar link de agendamento"
- **Day 10:** Add CPF field, Brazilian phone formatting, Sao Paulo timezone default
- **Day 11:** Set up email sequences in Portuguese (confirmation, reminder, follow-up)
- **Day 12:** Create pricing page: Gratuito / Pro R$99/mo / Agências R$199/mo
- **Day 13:** Set up Stripe billing with Brazilian Real (BRL) currency
- **Day 14:** Beta test with 5 Brazilian users (find on LinkedIn, Facebook groups)

### Week 3 — Launch (Days 15-21)
- **Day 15:** Soft launch — post in Brazilian Facebook groups for coaches/terapeutas
- **Day 16:** Post on LinkedIn Brazil: "Criei uma alternativa ao Calendly feita para o Brasil"
- **Day 17:** Post in r/empreendedorismo and r/brasil
- **Day 18:** Submit to Capterra Brazil, GetApp Brazil
- **Day 19:** Cold email 50 Brazilian coaches found on Instagram
- **Day 20:** Reach out to Brazilian business YouTubers for a mention
- **Day 21:** First paying customers

### Week 4 — Iterate (Days 22-30)
- Fix everything users complain about
- Add features Brazilians specifically want (NF-e invoice generation, iFood calendar sync)
- Target: 20 paying customers = R$1,980/mo

---

## SEO Strategy (Your Biggest Moat)
Write these pages before anyone else:
1. "Alternativa ao Calendly em português" (Calendly alternative in Portuguese)
2. "Como criar link de agendamento gratuito"
3. "Agendamento online para coaches"
4. "Agendamento online para psicólogos"
5. "Agendamento online para nutricionistas"
6. "Melhor aplicativo de agendamento para freelancers"
7. "Como receber pagamento por Pix no agendamento"
8. "Agendamento online com WhatsApp"

These keywords have: HIGH search volume in Brazil, ZERO competition, NO existing content in Portuguese from scheduling tools.

---

## Distribution Channels
1. **Facebook Groups:** "Coaches do Brasil" (380K members), "Empreendedorismo Digital" (200K members), "Psicólogos Empreendedores" (50K members)
2. **Instagram:** DM Brazilian coaches/therapists who promote services online
3. **YouTube Brazil:** Tutorial "Como criar agendamento online grátis" — ranks fast
4. **WhatsApp Groups:** Brazilian business communities — share your free tier
5. **ProductHunt:** Launch in Portuguese section

---

## Revenue Model
| Plan | Price | Description |
|---|---|---|
| Gratuito | R$0 | 1 event type, 5 bookings/mo |
| Pro | R$99/mo | Unlimited, Pix, WhatsApp reminders |
| Agências | R$199/mo | Multiple users, client management |

**Revenue targets:**
- Month 1: 20 paying × R$99 = R$1,980/mo (~$400)
- Month 3: 150 paying × R$99 = R$14,850/mo (~$3K)
- Month 6: 500 paying × R$99 = R$49,500/mo (~$10K)
- Month 12: 2K paying × R$99 = R$198K/mo (~$40K) — Teach Easy level

---

## Costs
| Item | Cost/mo |
|---|---|
| Railway/Render hosting | $20 |
| Domain (.com.br) | $1.25 (=$15/yr) |
| Resend email | $0-20 |
| Twilio WhatsApp | $0.005/message |
| Stripe fees | 2.9% + R$0.80 |
| **Total** | **~$25-35/mo** |

---

## Key Risks + Mitigations
| Risk | Mitigation |
|---|---|
| Cal.com releases pt-BR officially | You own local SEO + Pix + WhatsApp = still differentiated |
| Low conversion on free tier | Gate Pix + WhatsApp behind paid — these are the must-haves |
| Brazilian payment complexity | Stripe handles Pix natively — no local payment gateway needed |
| Support in Portuguese | Use Claude API to auto-draft support replies in Portuguese |

---

## Success Metrics
- Week 2: App live, 10 beta users
- Month 1: 20 paying customers, R$1,980 MRR
- Month 3: 150 customers, R$14,850 MRR
- Month 6: 500 customers, R$49,500 MRR (~$10K USD)
