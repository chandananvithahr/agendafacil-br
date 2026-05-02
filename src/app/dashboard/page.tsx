import Link from 'next/link'

const setup = [
  { title: 'Crie seu primeiro evento', text: 'Defina nome, duração, preço e local do atendimento.', href: '/dashboard/events/new', action: 'Criar evento' },
  { title: 'Confira a página pública', text: 'Veja como o cliente escolhe data, horário e confirma os dados.', href: '/demo', action: 'Ver demo' },
  { title: 'Compartilhe seu link', text: 'Use o link na bio, no WhatsApp, no Instagram e no Google Meu Negócio.', href: '/dashboard/events/new', action: 'Preparar link' },
]

const stats = [
  { label: 'Agendamentos hoje', value: '0' },
  { label: 'Esta semana', value: '0' },
  { label: 'Clientes', value: '0' },
  { label: 'Receita do mês', value: 'R$0' },
]

const proFeatures = ['Pix por evento', 'Lembretes no WhatsApp', 'Eventos ilimitados', 'Link personalizado']

const settings = [
  { href: '/dashboard/profile', title: 'Perfil público', text: 'Nome, link, WhatsApp, CPF/CNPJ e fuso.' },
  { href: '/dashboard/availability', title: 'Horários', text: 'Dias úteis e janela padrão de atendimento.' },
  { href: '/dashboard/integrations', title: 'Integrações', text: 'Google Calendar, Stripe Pix, WhatsApp e e-mail.' },
  { href: '/dashboard/payments', title: 'Pagamentos', text: 'Checkout Pix e planos Pro ou Agências.' },
]

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-black">AgendaFácil</Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 sm:inline-flex">
              Plano gratuito
            </span>
            <Link href="/dashboard/events/new" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
              Novo evento
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="max-w-3xl">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Primeiro acesso</div>
              <h1 className="mt-3 text-4xl font-black tracking-normal">Vamos publicar sua agenda.</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                O painel ainda está vazio porque você não criou um tipo de evento. Comece pelo serviço principal que você quer vender esta semana.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/events/new" className="rounded-lg bg-emerald-700 px-5 py-3 text-center text-sm font-black text-white hover:bg-emerald-800">
                Criar primeiro evento
              </Link>
              <Link href="/demo" className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-black text-slate-950 hover:bg-slate-50">
                Ver experiência do cliente
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">Pro</div>
            <h2 className="mt-3 text-2xl font-black">Quando estiver recebendo reservas, ative cobrança.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">O plano Pro adiciona as peças que transformam agenda em receita.</p>
            <div className="mt-5 grid gap-2">
              {proFeatures.map((feature) => (
                <div key={feature} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-slate-100">
                  {feature}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="mt-1 text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">Checklist de publicação</h2>
                <p className="mt-1 text-sm text-slate-500">Complete estes passos para deixar o link pronto para clientes reais.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {setup.map((item, index) => (
                <div key={item.title} className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[40px_1fr_auto] sm:items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-sm font-black text-emerald-800">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-black">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                  <Link href={item.href} className="rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-black text-slate-950 hover:bg-slate-200">
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-black">Seu link público</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Depois de criar um evento, seu link aparece neste formato:</p>
              <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm font-bold text-slate-800">
                agendafacil.com.br/seu-nome/consulta
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-black">Próximos agendamentos</h2>
              <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-5 text-center">
                <p className="text-sm font-bold text-slate-600">Nenhum agendamento ainda</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Assim que o primeiro cliente reservar, ele aparece aqui.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black">Configurações para terminar o MVP</h2>
            <p className="mt-1 text-sm text-slate-500">Essas telas cobrem os pontos do plano: localização brasileira, Pix, WhatsApp e integrações.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {settings.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50">
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
