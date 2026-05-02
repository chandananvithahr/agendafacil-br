import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth'
import { sendBookingCancellation } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'

type RouteContext = {
  params: Promise<{ id: string }>
}

type RefundResult = {
  refunded: boolean
  reason?: string
}

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
}

function asStripeId(value: string | { id: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id
}

async function refundPayment(paymentId: string) {
  const stripe = stripeClient()
  if (!stripe) {
    console.warn('[bookings] STRIPE_SECRET_KEY missing; booking cancellation refund skipped.')
    return { refunded: false, reason: 'STRIPE_SECRET_KEY nao configurada' }
  }

  let paymentIntent = paymentId
  if (paymentId.startsWith('cs_')) {
    const checkout = await stripe.checkout.sessions.retrieve(paymentId)
    paymentIntent = asStripeId(checkout.payment_intent) ?? ''
  }

  if (!paymentIntent.startsWith('pi_')) {
    return { refunded: false, reason: 'Pagamento Stripe nao encontrado para reembolso' }
  }

  await stripe.refunds.create({ payment_intent: paymentIntent })
  return { refunded: true }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { id } = await params
  const booking = await prisma.booking.findFirst({
    where: {
      id,
      eventType: { userId: session.user.id },
    },
    include: {
      eventType: {
        include: { user: true },
      },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Agendamento nao encontrado' }, { status: 404 })
  }

  if (!['PENDING', 'CONFIRMED'].includes(booking.status) || booking.startTime <= new Date()) {
    return NextResponse.json({ error: 'Este agendamento nao pode mais ser cancelado pelo painel.' }, { status: 409 })
  }

  const cancelled = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED' },
  })

  const notification = {
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    eventTitle: booking.eventType.title,
    professionalName: booking.eventType.user.name ?? 'profissional',
    startTime: booking.startTime,
    timezone: booking.eventType.user.timezone,
  }

  const cancellationEmail = await sendBookingCancellation(notification).catch((error) => {
    console.error('[bookings] Failed to send cancellation email', error)
    return { sent: false, reason: 'Falha ao enviar e-mail de cancelamento' }
  })

  let refund: RefundResult = { refunded: false, reason: 'Sem pagamento Stripe para reembolsar' }
  if (booking.paymentId) {
    refund = await refundPayment(booking.paymentId).catch((error) => {
      console.error('[bookings] Failed to refund cancelled booking', error)
      return { refunded: false, reason: 'Falha ao reembolsar; verifique na Stripe' }
    })

    if (refund.refunded) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: 'REFUNDED' },
      })
    }
  }

  return NextResponse.json({ booking: cancelled, cancellationEmail, refund })
}
