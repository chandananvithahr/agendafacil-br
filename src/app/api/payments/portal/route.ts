import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { getAppUrl } from '@/lib/app-config'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY nao configurada' }, { status: 501 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: 'Ainda nao encontramos uma assinatura ativa para gerenciar.' },
      { status: 404 },
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
  const origin = req.headers.get('origin') ?? getAppUrl()
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/dashboard/payments`,
  })

  return NextResponse.json({ url: portal.url })
}
