export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { username: string; eventSlug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const user = await prisma.user.findUnique({ where: { slug: params.username } })
  const event = user
    ? await prisma.eventType.findFirst({ where: { userId: user.id, slug: params.eventSlug, isActive: true } })
    : null

  if (!event) return { title: 'Agendamento não encontrado' }
  return {
    title: `${event.title} — Agendar com ${user!.name}`,
    description: event.description ?? `Agende uma sessão de ${event.duration} minutos com ${user!.name}`,
  }
}

export default async function BookingPage({ params }: PageProps) {
  const user = await prisma.user.findUnique({ where: { slug: params.username } })
  if (!user) notFound()

  const event = await prisma.eventType.findFirst({
    where: { userId: user.id, slug: params.eventSlug, isActive: true },
  })
  if (!event) notFound()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-lg">
              {user.name?.[0] ?? '?'}
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-green-100 text-xs">@{user.slug}</div>
            </div>
          </div>
          <h1 className="text-xl font-black">{event.title}</h1>
          {event.description && (
            <p className="text-green-100 text-sm mt-1">{event.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-green-100">
            <span>⏱️ {event.duration} min</span>
            {event.price > 0 && (
              <span>💰 R${(event.price / 100).toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Booking form */}
        <BookingForm eventId={event.id} duration={event.duration} timezone={user.timezone} />
      </div>
    </div>
  )
}
