import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addMinutes } from 'date-fns'
import { prisma } from '@/lib/prisma'

const bookingSchema = z.object({
  eventId: z.string().cuid(),
  startTime: z.string().datetime(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { eventId, startTime, name, email, phone, notes } = parsed.data

  const event = await prisma.eventType.findUnique({ where: { id: eventId } })
  if (!event || !event.isActive) {
    return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 })
  }

  const start = new Date(startTime)
  const end = addMinutes(start, event.duration)

  const conflict = await prisma.booking.findFirst({
    where: {
      eventTypeId: eventId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      startTime: { lt: end },
      endTime: { gt: start },
    },
  })

  if (conflict) {
    return NextResponse.json({ error: 'Horário não disponível' }, { status: 409 })
  }

  const booking = await prisma.booking.create({
    data: {
      eventTypeId: eventId,
      startTime: start,
      endTime: end,
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      notes,
      status: 'PENDING',
    },
  })

  return NextResponse.json(booking, { status: 201 })
}
