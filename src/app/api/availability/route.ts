import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const availabilitySchema = z.object({
  slots: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  }).refine((slot) => slot.startTime < slot.endTime, {
    message: 'Horario final deve ser depois do inicio',
    path: ['endTime'],
  })).min(1).max(14),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const slots = await prisma.availability.findMany({
    where: { userId: session.user.id },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json({ slots })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const parsed = availabilitySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { userId: session.user.id } }),
    prisma.availability.createMany({
      data: parsed.data.slots.map((slot) => ({ ...slot, userId: session.user.id })),
    }),
  ])

  return NextResponse.json({ ok: true })
}
