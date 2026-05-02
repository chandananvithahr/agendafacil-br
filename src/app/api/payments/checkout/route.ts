import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { z } from 'zod'
import { getAppUrl } from '@/lib/app-config'
import { authOptions } from '@/lib/auth'

const checkoutSchema = z.object({
  plan: z.enum(['PRO', 'AGENCY']).default('PRO'),
})

const planPrices = {
  PRO: { amount: 9900, name: 'AgendaFacil Pro' },
  AGENCY: { amount: 19900, name: 'AgendaFacil Agencias' },
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY nao configurada' }, { status: 501 })
  }

  const parsed = checkoutSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const plan = planPrices[parsed.data.plan]
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  const origin = req.headers.get('origin') ?? getAppUrl()

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'brl',
          unit_amount: plan.amount,
          recurring: { interval: 'month' },
          product_data: { name: plan.name },
        },
      },
    ],
    metadata: {
      type: 'plan',
      userId: session.user.id,
      plan: parsed.data.plan,
    },
    subscription_data: {
      metadata: {
        type: 'plan',
        userId: session.user.id,
        plan: parsed.data.plan,
      },
    },
    success_url: `${origin}/dashboard/payments?checkout=success`,
    cancel_url: `${origin}/dashboard/payments?checkout=cancelled`,
  })

  return NextResponse.json({ url: checkout.url })
}
