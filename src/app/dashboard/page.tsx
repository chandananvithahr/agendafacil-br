import { addDays, addMonths, addWeeks, format, startOfDay, startOfMonth, startOfWeek } from 'date-fns'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAppUrl } from '@/lib/app-config'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const setup = [
  { title: 'Crie seu primeiro evento', text: 'Defina nome, duracao, preco e local do atendimento.', href: '/dashboard/events/new', action: 'Criar evento' },
  { title: 'Confira a pagina publica', text: 'Veja como o cliente escolhe data, horario e confirma os dados.', href: '/demo', action: 'Ver demo' },
  { title: 'Compartilhe seu link', text: 'Use o link na bio, no WhatsApp, no Instagram e no Google Meu Negocio.', href: '/dashboard/events/new', action: 'Preparar link' },
]

const proFeatures = ['Pix por evento', 'Lembretes no WhatsApp', 'Eventos ilimitados', 'Link personalizado']

const settings = [
  { href: '/dashboard/profile', title: 'Perfil publico', text: 'Nome, link, WhatsApp, CPF/CNPJ e fuso.' },
  { href: '/dashboard/availability', title: 'Horarios', text: 'Dias uteis e janela padrao de atendimento.' },
  { href: '/dashboard/integrations', title: 'Integracoes', text: 'Google Calendar, Stripe Pix, WhatsApp e e-mail.' },
  { href: '/dashboard/payments', title: 'Pagamentos', text: 'Checkout Pix e planos Pro ou Agencias.' },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function planLabel(plan: string) {
  if (plan === 'PRO') return 'Plano Pro'
  if (plan === 'AGENCY') return 'Plano agencias'
  return 'Plano gratuito'
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, slug: true, plan: true },
  })
  if (!user) redirect('/auth/signin')

  const now = new Date()
  const todayStart = startOfDay(now)
  const tomorrowStart = addDays(todayStart, 1)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const monthStart = startOfMonth(now)
  const nextMonthStart = addMonths(monthStart, 1)

  const [todayBookings, weekBookings, guestRows, paidMonthBookings, upcomingBookings, eventCount] = await Promise.all([
    prisma.booking.count({
      where: {
        eventType: { userId: user.id },
        startTime: { gte: todayStart, lt: tomorrowStart },
      },
    }),
    prisma.booking.count({
      where: {
        eventType: { userId: user.id },
        startTime: { gte: weekStart, lt: addWeeks(weekStart, 1) },
      },
    }),
    prisma.booking.findMany({
      where: { eventType: { userId: user.id } },
      distinct: ['guestEmail'],
      select: { guestEmail: true },
    }),
    prisma.booking.findMany({
      where: {
        eventType: { userId: user.id },
        paymentStatus: 'PAID',
        startTime: { gte: monthStart, lt: nextMonthStart },
      },
      select: { eventType: { select: { price: true } } },
    }),
    prisma.booking.findMany({
      where: {
        eventType: { userId: user.id },
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { gte: now },
      },
      orderBy: { startTime: 'asc' },
      take: 3,
      select: {
        id: true,
        startTime: true,
        guestName: true,
        eventType: { select: { title: true } },
      },
    }),
    prisma.eventType.count({ where: { userId: user.id } }),
  ])

  const monthlyRevenue = paidMonthBookings.reduce((total, booking) => total + booking.eventType.price, 0)
  const stats = [
    { label: 'Agendamentos hoje', value: String(todayBookings) },
    { label: 'Esta semana', value: String(weekBookings) },
    { label: 'Clientes', value: String(guestRows.length) },
    { label: 'Receita do mes', value: formatCurrency(monthlyRevenue) },
  ]
  const publicLink = `${getAppUrl().replace(/^https?:\/\//, '').replace(/\/$/, '')}/${user.slug}/consulta`
  const hasEvents = eventCount > 0

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-black">AgendaFacil</Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 sm:inline-flex">
              {planLabel(session.user.plan ?? user.plan)}
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
              <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
                {hasEvents ? 'Painel' : 'Primeiro acesso'}
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-normal">
                {hasEvents ? `Bom trabalho, ${user.name ?? 'vamos vender'}.` : 'Vamos publicar sua agenda.'}
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {hasEvents
                  ? 'Acompanhe reservas, clientes e receita sem perder o proximo ajuste operacional.'
                  : 'O painel ainda esta vazio porque voce nao criou um tipo de evento. Comece pelo servico principal que voce quer vender esta semana.'}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/events/new" className="rounded-lg bg-emerald-700 px-5 py-3 text-center text-sm font-black text-white hover:bg-emerald-800">
                {hasEvents ? 'Criar novo evento' : 'Criar primeiro evento'}
              </Link>
              <Link href="/demo" className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-black text-slate-950 hover:bg-slate-50">
                Ver experiencia do cliente
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">Pro</div>
            <h2 className="mt-3 text-2xl font-black">Quando estiver recebendo reservas, ative cobranca.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">O plano Pro adiciona as pecas que transformam agenda em receita.</p>
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
                <h2 className="text-2xl font-black">Checklist de publicacao</h2>
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
              <h2 className="text-xl font-black">Seu link publico</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Depois de criar um evento, seu link aparece neste formato:</p>
              <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm font-bold text-slate-800">
                {publicLink}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-black">Proximos agendamentos</h2>
              {upcomingBookings.length ? (
                <div className="mt-5 grid gap-3">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="text-sm font-black">{booking.guestName}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{booking.eventType.title}</div>
                      <div className="mt-2 text-xs font-bold text-slate-700">{format(booking.startTime, 'dd/MM HH:mm')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-5 text-center">
                  <p className="text-sm font-bold text-slate-600">Nenhum agendamento ainda</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Assim que o primeiro cliente reservar, ele aparece aqui.</p>
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black">Configuracoes para terminar o MVP</h2>
            <p className="mt-1 text-sm text-slate-500">Essas telas cobrem os pontos do plano: localizacao brasileira, Pix, WhatsApp e integracoes.</p>
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
