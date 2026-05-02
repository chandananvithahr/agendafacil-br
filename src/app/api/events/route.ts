import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createEventSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  duration: z.number().int().min(5).max(480),
  price: z.number().min(0).default(0),
  requiresPayment: z.boolean().default(false),
  location: z.string().default('google_meet'),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const events = await prisma.eventType.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { title, slug, description, duration, price, requiresPayment, location } = parsed.data
  const userId = session.user.id

  const existing = await prisma.eventType.findFirst({ where: { userId, slug } })
  if (existing) {
    return NextResponse.json({ error: 'URL já em uso' }, { status: 409 })
  }

  const event = await prisma.eventType.create({
    data: {
      userId,
      title,
      slug,
      description,
      duration,
      price: Math.round(price * 100),
      currency: 'BRL',
      requiresPayment,
      locations: [{ type: location }],
    },
  })

  return NextResponse.json(event, { status: 201 })
}
