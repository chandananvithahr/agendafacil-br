import Link from 'next/link'

const personas = ['Psicólogos', 'Nutricionistas', 'Coaches', 'Consultores', 'Personal trainers', 'Clínicas pequenas']

const metrics = [
  { value: '5 min', label: 'para publicar sua agenda' },
  { value: '70%', label: 'menos faltas com lembrete' },
  { value: 'R$99', label: 'plano Pro mensal' },
]

const features = [
  {
    label: 'PIX',
    title: 'Receba antes da consulta',
    text: 'Crie eventos pagos em reais, cobre por Pix e reduza o entra-e-sai de clientes que marcam e somem.',
  },
  {
    label: 'WA',
    title: 'Lembretes no WhatsApp',
    text: 'Confirmações e lembretes chegam no canal que o cliente brasileiro já usa todos os dias.',
  },
  {
    label: 'BR',
    title: 'Português de verdade',
    text: 'Página pública, e-mails, horários e fluxo de reserva pensados para vender serviço no Brasil.',
  },
  {
    label: 'URL',
    title: 'Link com sua marca',
    text: 'Compartilhe uma página simples no Instagram, WhatsApp, bio, anúncio ou assinatura de e-mail.',
  },
  {
    label: 'CAL',
    title: 'Agenda sem conflito',
    text: 'Horários, duração e disponibilidade ficam claros para o cliente antes de ele preencher os dados.',
  },
  {
    label: 'CRM',
    title: 'Histórico organizado',
    text: 'Nome, e-mail, WhatsApp, observações e status de cada reserva ficam no mesmo painel.',
  },
]

const steps = [
  { title: 'Configure', text: 'Defina serviços, duração, preço e horários disponíveis.' },
  { title: 'Compartilhe', text: 'Use o link no WhatsApp, Instagram, site ou Google Meu Negócio.' },
  { title: 'Receba', text: 'O cliente agenda, paga quando necessário e recebe confirmação.' },
]

const plans = [
  {
    name: 'Gratuito',
    price: 'R$0',
    note: 'para começar hoje',
    items: ['1 tipo de evento', '5 agendamentos por mês', 'Página pública', 'Confirmação por e-mail'],
    cta: 'Começar grátis',
    featured: false,
  },
  {
    name: 'Pro',
    price: 'R$99',
    note: 'por mês',
    items: ['Eventos ilimitados', 'Pix integrado', 'WhatsApp reminders', 'Google Calendar', 'Link personalizado', 'Suporte em português'],
    cta: 'Assinar Pro',
    featured: true,
  },
  {
    name: 'Agências',
    price: 'R$199',
    note: 'por mês',
    items: ['Tudo do Pro', 'Até 10 usuários', 'Painel de equipe', 'Relatórios', 'Prioridade no suporte'],
    cta: 'Falar com vendas',
    featured: false,
  },
]

const faqs = [
  {
    question: 'Preciso de cartão para começar?',
    answer: 'Não. O plano gratuito deixa você publicar a página e testar o fluxo antes de assinar.',
  },
  {
    question: 'Funciona para consulta paga?',
    answer: 'Sim. O plano Pro adiciona cobrança por Pix para o cliente pagar antes do horário marcado.',
  },
  {
    question: 'É só para profissionais de saúde?',
    answer: 'Não. AgendaFácil serve para qualquer profissional que vende horário: consultoria, aula, atendimento, sessão ou avaliação.',
  },
]

function ProductPreview() {
  return (
    <div className="w-full max-w-[560px] rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">agenda pública</div>
          <div className="text-sm font-bold text-slate-950">mariasilva/consulta-inicial</div>
        </div>
        <div className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">PIX ativo</div>
      </div>
      <div className="grid gap-0 md:grid-cols-[1fr_1.15fr]">
        <div className="border-b border-slate-100 p-4 md:border-b-0 md:border-r">
          <div className="mb-4 h-20 rounded-lg bg-gradient-to-br from-emerald-600 to-sky-700 p-4 text-white">
            <div className="text-xs opacity-80">Consulta inicial</div>
            <div className="mt-1 text-2xl font-black">R$120</div>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Duração</span><strong>50 min</strong></div>
            <div className="flex justify-between"><span>Local</span><strong>Google Meet</strong></div>
            <div className="flex justify-between"><span>Fuso</span><strong>São Paulo</strong></div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3 text-sm font-bold text-slate-950">Escolha um horário</div>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {['Seg', 'Ter', 'Qua', 'Qui'].map((day, index) => (
              <div
                key={day}
                className={`rounded-md border px-2 py-3 text-center text-xs ${
                  index === 1 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-bold">{day}</div>
                <div>{12 + index}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['09:00', '10:30', '14:00', '15:30', '16:00', '17:00'].map((time, index) => (
              <div
                key={time}
                className={`rounded-md border py-2 text-center text-xs font-bold ${
                  index === 3 ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700'
                }`}
              >
                {time}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white">
            Confirmar agendamento
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative min-h-[700px] overflow-hidden bg-[#f7f3ea]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(247,243,234,0.98)_0%,rgba(247,243,234,0.92)_42%,rgba(236,247,242,0.76)_100%)]" />
        <div className="absolute right-[-160px] top-20 hidden w-[660px] rotate-[-2deg] opacity-95 lg:block">
          <ProductPreview />
        </div>
        <div className="absolute bottom-[-140px] right-[18%] hidden h-72 w-72 rounded-full bg-sky-200/45 blur-3xl lg:block" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight text-slate-950">
            AgendaFácil
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <Link href="#como-funciona" className="hover:text-slate-950">Como funciona</Link>
            <Link href="#recursos" className="hover:text-slate-950">Recursos</Link>
            <Link href="#precos" className="hover:text-slate-950">Preços</Link>
          </div>
          <Link href="/auth/signin" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Entrar
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-16 lg:grid-cols-[0.92fr_1fr] lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex rounded-lg border border-emerald-200 bg-white/70 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-800">
              Feito para vender horário no Brasil
            </div>
            <h1 className="max-w-[12ch] text-5xl font-black leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Agendamento online com Pix e WhatsApp.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-700">
              Uma agenda pública em português para profissionais que querem receber reservas, cobrar antes do atendimento e reduzir faltas sem parecer ferramenta importada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/signin" className="rounded-lg bg-emerald-700 px-6 py-4 text-center text-base font-black text-white hover:bg-emerald-800">
                Criar minha agenda grátis
              </Link>
              <Link href="/demo" className="rounded-lg border border-slate-300 bg-white/70 px-6 py-4 text-center text-base font-black text-slate-950 hover:bg-white">
                Ver demonstração
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">Sem cartão de crédito. Configure em minutos. Cancele quando quiser.</p>
          </div>

          <div className="relative flex items-center justify-center lg:hidden">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-5 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.value} className="border-b border-slate-200 py-7 md:border-b-0 md:border-r last:md:border-r-0">
              <div className="text-3xl font-black text-slate-950">{metric.value}</div>
              <div className="mt-1 text-sm font-medium text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">Clientes certos</div>
            <h2 className="mt-2 text-2xl font-black">Para quem vive de consulta, sessão, aula ou atendimento.</h2>
          </div>
          <div className="flex max-w-3xl flex-wrap gap-2">
            {personas.map((persona) => (
              <span key={persona} className="rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200">
                {persona}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-[#fbfaf6] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Fluxo simples</div>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">Do link publicado ao cliente confirmado.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-black text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Recursos</div>
              <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">O básico que o Calendly esquece no Brasil.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                O produto é pequeno de propósito: uma página de agendamento clara, cobrança local e follow-up no canal certo.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="mb-4 inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
                    {feature.label}
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="precos" className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Preços</div>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">Comece grátis, pague quando a agenda virar dinheiro.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${
                  plan.featured ? 'border-emerald-700 bg-white shadow-xl shadow-emerald-900/10' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{plan.note}</p>
                  </div>
                  {plan.featured && (
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-black text-amber-800">Popular</span>
                  )}
                </div>
                <div className="mt-7">
                  <span className="text-5xl font-black tracking-tight text-slate-950">{plan.price}</span>
                </div>
                <ul className="mt-7 space-y-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-medium text-slate-700">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signin"
                  className={`mt-8 block rounded-lg px-5 py-3 text-center text-sm font-black ${
                    plan.featured ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-slate-100 text-slate-950 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">Dúvidas</div>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-slate-950">Antes de publicar sua agenda.</h2>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-lg font-black text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-800 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-normal">Publique sua agenda ainda hoje.</h2>
            <p className="mt-3 text-emerald-50">Se o cliente já chama no WhatsApp, ele também pode escolher horário e confirmar sozinho.</p>
          </div>
          <Link href="/auth/signin" className="rounded-lg bg-white px-6 py-4 text-center text-base font-black text-emerald-900 hover:bg-emerald-50">
            Criar agenda grátis
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 text-sm text-slate-500 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="font-bold text-slate-950">AgendaFácil</div>
            <p className="mt-2 max-w-sm leading-6">Agendamento online com Pix e WhatsApp para profissionais brasileiros.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <div className="font-black text-slate-950">Produto</div>
              <Link href="/demo" className="hover:text-slate-950">Demonstração</Link>
              <Link href="/auth/signin" className="hover:text-slate-950">Entrar</Link>
              <Link href="/dashboard/payments" className="hover:text-slate-950">Planos</Link>
            </div>
            <div className="grid gap-2">
              <div className="font-black text-slate-950">Guias</div>
              <Link href="/agendamento-online-gratis" className="hover:text-slate-950">Agendamento grátis</Link>
              <Link href="/alternativa-calendly-portugues" className="hover:text-slate-950">Alternativa ao Calendly</Link>
              <Link href="/pagamento-pix-no-agendamento" className="hover:text-slate-950">Pagamento por Pix</Link>
            </div>
            <div className="grid gap-2">
              <div className="font-black text-slate-950">Legal</div>
              <Link href="/privacidade" className="hover:text-slate-950">Privacidade</Link>
              <Link href="/termos" className="hover:text-slate-950">Termos</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
