import { addDays, format, startOfWeek, subDays } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { BookingStatus, PaymentStatus } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CancelBookingButton from './CancelBookingButton'

type BookingRow = {
  id: string
  startTime: Date
  guestName: string
  guestEmail: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  eventType: { title: string }
}

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluido',
}

const paymentLabels: Record<PaymentStatus, string> = {
  UNPAID: 'Aguardando',
  PAID: 'Pago',
  REFUNDED: 'Reembolsado',
}

function statusClass(status: BookingStatus) {
  if (status === 'CONFIRMED') return 'bg-emerald-50 text-emerald-800'
  if (status === 'PENDING') return 'bg-amber-50 text-amber-900'
  if (status === 'CANCELLED') return 'bg-rose-50 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

function paymentClass(status: PaymentStatus) {
  if (status === 'PAID') return 'bg-emerald-50 text-emerald-800'
  if (status === 'REFUNDED') return 'bg-slate-100 text-slate-700'
  return 'bg-amber-50 text-amber-900'
}

function canCancel(booking: BookingRow, now: Date) {
  return ['PENDING', 'CONFIRMED'].includes(booking.status) && booking.startTime > now
}

function BookingSection({
  title,
  description,
  bookings,
  timezone,
  now,
}: {
  title: string
  description: string
  bookings: BookingRow[]
  timezone: string
  now: Date
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      {bookings.length ? (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black">{booking.guestName}</h3>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${statusClass(booking.status)}`}>
                    {statusLabels[booking.status]}
                  </span>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${paymentClass(booking.paymentStatus)}`}>
                    {paymentLabels[booking.paymentStatus]}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-700">{booking.eventType.title}</p>
                <p className="mt-1 text-sm text-slate-500">{booking.guestEmail}</p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {formatInTimeZone(booking.startTime, timezone, "dd/MM/yyyy 'as' HH:mm")}
                </p>
              </div>

              {canCancel(booking, now) && <CancelBookingButton bookingId={booking.id} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-500">
          Nenhum agendamento nesta secao.
        </div>
      )}
    </section>
  )
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, timezone: true },
  })
  if (!user) redirect('/auth/signin')

  const now = new Date()
  const timezone = user.timezone
  const localNow = toZonedTime(now, timezone)
  const localWeekStart = startOfWeek(localNow, { weekStartsOn: 1 })
  const localWeekEnd = addDays(localWeekStart, 7)
  const weekStartUtc = fromZonedTime(`${format(localWeekStart, 'yyyy-MM-dd')}T00:00:00`, timezone)
  const weekEndUtc = fromZonedTime(`${format(localWeekEnd, 'yyyy-MM-dd')}T00:00:00`, timezone)
  const todayKey = formatInTimeZone(now, timezone, 'yyyy-MM-dd')
  const historyStart = subDays(now, 30)

  const bookings = await prisma.booking.findMany({
    where: { eventType: { userId: user.id } },
    orderBy: { startTime: 'asc' },
    select: {
      id: true,
      startTime: true,
      guestName: true,
      guestEmail: true,
      status: true,
      paymentStatus: true,
      eventType: { select: { title: true } },
    },
  })

  const today = bookings.filter((booking) => formatInTimeZone(booking.startTime, timezone, 'yyyy-MM-dd') === todayKey)
  const thisWeek = bookings.filter((booking) => {
    const dateKey = formatInTimeZone(booking.startTime, timezone, 'yyyy-MM-dd')
    return dateKey !== todayKey && booking.startTime >= now && booking.startTime >= weekStartUtc && booking.startTime < weekEndUtc
  })
  const previous = bookings.filter((booking) => {
    const dateKey = formatInTimeZone(booking.startTime, timezone, 'yyyy-MM-dd')
    return dateKey !== todayKey && booking.startTime < now && booking.startTime >= historyStart
  }).reverse()

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Voltar</Link>
          <Link href="/" className="text-lg font-black">AgendaFacil</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Agenda</div>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Agendamentos</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Veja reservas por periodo, status de pagamento e cancele horarios futuros quando necessario.</p>
        </div>

        <div className="grid gap-5">
          <BookingSection title="Hoje" description="Reservas no seu fuso configurado." bookings={today} timezone={timezone} now={now} />
          <BookingSection title="Esta semana" description="Proximos horarios ainda nesta semana." bookings={thisWeek} timezone={timezone} now={now} />
          <BookingSection title="Anteriores" description="Historico dos ultimos 30 dias." bookings={previous} timezone={timezone} now={now} />
        </div>
      </div>
    </main>
  )
}
