import { NextRequest, NextResponse } from 'next/server'
import type { Plan } from '@prisma/client'
import Stripe from 'stripe'
import { queueWhatsAppReminder, sendBookingConfirmation } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
}

function asStripeId(value: string | { id: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id
}

function isPlan(value: string | undefined): value is Plan {
  return value === 'PRO' || value === 'AGENCY'
}

async function activatePlan(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId || !isPlan(plan)) return

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeCustomerId: asStripeId(session.customer) ?? undefined,
      stripeSubscriptionId: asStripeId(session.subscription) ?? undefined,
    },
  })
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const plan = subscription.metadata.plan
  if (!userId || !isPlan(plan)) return

  const active = ['active', 'trialing', 'past_due'].includes(subscription.status)
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: active ? plan : 'FREE',
      stripeCustomerId: asStripeId(subscription.customer) ?? undefined,
      stripeSubscriptionId: active ? subscription.id : null,
    },
  })
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: 'FREE', stripeSubscriptionId: null },
    })
    return
  }

  await prisma.user.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { plan: 'FREE', stripeSubscriptionId: null },
  })
}

async function confirmPaidBooking(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId
  if (!bookingId) return

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentId: asStripeId(session.payment_intent) ?? session.id,
    },
    include: {
      eventType: {
        include: { user: true },
      },
    },
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

  await Promise.all([
    sendBookingConfirmation(notification),
    queueWhatsAppReminder(notification),
  ])
}

export async function POST(req: NextRequest) {
  const stripe = stripeClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json({ error: 'Stripe webhook nao configurado' }, { status: 501 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Assinatura Stripe invalida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.metadata?.type === 'plan') {
      await activatePlan(session)
    }

    if (session.metadata?.type === 'booking') {
      await confirmPaidBooking(session)
    }
  }

  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'UNPAID', status: 'PENDING' },
      })
    }
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    await syncSubscription(event.data.object as Stripe.Subscription)
  }

  if (event.type === 'customer.subscription.deleted') {
    await cancelSubscription(event.data.object as Stripe.Subscription)
  }

  return NextResponse.json({ received: true })
}
