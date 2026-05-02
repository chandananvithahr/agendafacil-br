export const dynamic = 'force-dynamic'

import { addDays } from 'date-fns'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'
import { prisma } from '@/lib/prisma'
import { buildPublicSlots } from '@/lib/scheduling'

interface PageProps {
  params: Promise<{ username: string; eventSlug: string }>
}

async function loadBookingData(username: string, eventSlug: string) {
  try {
    const user = await prisma.user.findUnique({ where: { slug: username } })
    if (!user) return { status: 'not-found' as const }

    const event = await prisma.eventType.findFirst({
      where: { userId: user.id, slug: eventSlug, isActive: true },
    })
    if (!event) return { status: 'not-found' as const }

    const now = new Date()
    const windowEnd = addDays(now, 15)
    const [availability, bookings] = await Promise.all([
      prisma.availability.findMany({
        where: { userId: user.id },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      }),
      prisma.booking.findMany({
        where: {
          eventType: { userId: user.id },
          status: { in: ['PENDING', 'CONFIRMED'] },
          startTime: { lt: windowEnd },
          endTime: { gt: now },
        },
        select: { startTime: true, endTime: true },
      }),
    ])

    return {
      status: 'ok' as const,
      user,
      event,
      slots: buildPublicSlots({
        availability,
        bookings,
        duration: event.duration,
        timezone: user.timezone,
        now,
      }),
    }
  } catch {
    return { status: 'error' as const }
  }
}

function UnavailablePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-black uppercase tracking-[0.16em] text-amber-700">Agenda indisponivel</div>
        <h1 className="mt-3 text-3xl font-black tracking-normal">Nao foi possivel carregar esta agenda agora.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Tente novamente em alguns minutos. Se o problema continuar, fale com o profissional pelo canal em que recebeu o link.
        </p>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { username, eventSlug } = await params
  const data = await loadBookingData(username, eventSlug)

  if (data.status === 'not-found') return { title: 'Agendamento nao encontrado' }
  if (data.status === 'error') return { title: 'Agenda indisponivel' }

  return {
    title: `${data.event.title} - Agendar com ${data.user.name ?? 'AgendaFacil'}`,
    description: data.event.description ?? `Agende ${data.event.duration} minutos com ${data.user.name ?? 'este profissional'}.`,
  }
}

export default async function BookingPage({ params }: PageProps) {
  const { username, eventSlug } = await params
  const data = await loadBookingData(username, eventSlug)

  if (data.status === 'not-found') notFound()
  if (data.status === 'error') return <UnavailablePage />

  const { user, event, slots } = data
  const price = event.price > 0 ? `R$${(event.price / 100).toFixed(0)}` : 'Gratis'

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-slate-950">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <div className="text-lg font-black">AgendaFacil</div>
        <div className="rounded-lg bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">@{user.slug}</div>
      </div>

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="bg-slate-950 p-6 text-white md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-lg font-black">
              {user.name?.slice(0, 2).toUpperCase() ?? 'AF'}
            </div>
            <div>
              <div className="font-black">{user.name ?? 'Profissional AgendaFacil'}</div>
              <div className="text-sm text-slate-300">@{user.slug}</div>
            </div>
          </div>

          <div className="rounded-lg bg-white/8 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Agendamento</div>
            <h1 className="mt-3 text-3xl font-black tracking-normal">{event.title}</h1>
            {event.description && (
              <p className="mt-4 text-sm leading-6 text-slate-300">{event.description}</p>
            )}
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Duracao</span>
              <strong>{event.duration} min</strong>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Valor</span>
              <strong>{price}</strong>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Fuso</span>
              <strong>{user.timezone}</strong>
            </div>
          </div>
        </aside>

        <BookingForm
          eventId={event.id}
          duration={event.duration}
          timezone={user.timezone}
          slots={slots}
          requiresPayment={event.requiresPayment}
          price={event.price}
        />
      </div>
    </main>
  )
}
