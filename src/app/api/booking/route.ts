import { addMinutes } from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import Stripe from 'stripe'
import { z } from 'zod'
import { getAppUrl } from '@/lib/app-config'
import { queueWhatsAppReminder, sendBookingConfirmation } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { isInsideAvailability } from '@/lib/scheduling'

const bookingSchema = z.object({
  eventId: z.string().cuid(),
  startTime: z.string().datetime(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  company: z.string().max(120).optional(),
})

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)
  const rateLimit = await checkRateLimit(`booking:${ip}`, 8, 60_000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde um pouco e tente novamente.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    )
  }

  const body = await req.json()
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { eventId, startTime, name, email, phone, notes, company } = parsed.data
  if (company) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const event = await prisma.eventType.findUnique({
    where: { id: eventId },
    include: { user: true },
  })
  if (!event || !event.isActive) {
    return NextResponse.json({ error: 'Evento nao encontrado' }, { status: 404 })
  }

  const start = new Date(startTime)
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: 'Horario invalido' }, { status: 400 })
  }
  const end = addMinutes(start, event.duration)

  const availability = await prisma.availability.findMany({ where: { userId: event.userId } })
  if (!isInsideAvailability(start, end, event.user.timezone, availability)) {
    return NextResponse.json({ error: 'Horario fora da disponibilidade do profissional' }, { status: 409 })
  }

  const conflict = await prisma.booking.findFirst({
    where: {
      eventType: { userId: event.userId },
      status: { in: ['PENDING', 'CONFIRMED'] },
      startTime: { lt: end },
      endTime: { gt: start },
    },
  })

  if (conflict) {
    return NextResponse.json({ error: 'Horario nao disponivel' }, { status: 409 })
  }

  const requiresPayment = event.requiresPayment && event.price > 0
  const stripe = requiresPayment ? stripeClient() : null
  if (requiresPayment && !stripe) {
    return NextResponse.json({ error: 'Checkout Pix nao configurado' }, { status: 501 })
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        eventTypeId: eventId,
        startTime: start,
        endTime: end,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        notes,
        status: requiresPayment ? 'PENDING' : 'CONFIRMED',
        paymentStatus: requiresPayment ? 'UNPAID' : 'PAID',
        amount: requiresPayment ? event.price : 0,
      },
    })

    if (requiresPayment && stripe) {
      try {
        const origin = req.headers.get('origin') ?? getAppUrl()
        const checkout = await stripe.checkout.sessions.create({
          mode: 'payment',
          customer_email: email,
          payment_method_types: ['pix'],
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: 'brl',
                unit_amount: event.price,
                product_data: { name: event.title },
              },
            },
          ],
          metadata: {
            type: 'booking',
            bookingId: booking.id,
            eventId: event.id,
            userId: event.userId,
          },
          success_url: `${origin}/booking/confirmado?status=paid`,
          cancel_url: `${origin}/${event.user.slug}/${event.slug}?payment=cancelled`,
        })

        await prisma.booking.update({
          where: { id: booking.id },
          data: { paymentId: checkout.id },
        })

        return NextResponse.json({ bookingId: booking.id, paymentUrl: checkout.url }, { status: 201 })
      } catch {
        await prisma.booking.delete({ where: { id: booking.id } }).catch(() => undefined)
        return NextResponse.json({ error: 'Nao foi possivel abrir o checkout Pix' }, { status: 502 })
      }
    }

    const notification = {
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      eventTitle: event.title,
      professionalName: event.user.name ?? 'profissional',
      startTime: start,
      timezone: event.user.timezone,
    }

    const [emailResult, whatsappResult] = await Promise.all([
      sendBookingConfirmation(notification),
      queueWhatsAppReminder(notification),
    ])

    return NextResponse.json({ booking, notifications: { email: emailResult, whatsapp: whatsappResult } }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Horario nao disponivel' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Nao foi possivel criar o agendamento' }, { status: 500 })
  }
}
