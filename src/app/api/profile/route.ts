import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(3).max(40).regex(/^[a-z0-9-]+$/),
  phone: z.string().max(24).optional(),
  cpf: z.string().max(18).optional(),
  timezone: z.string().min(3).max(80).default('America/Sao_Paulo'),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, slug: true, phone: true, cpf: true, timezone: true, plan: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const parsed = profileSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existingSlug = await prisma.user.findFirst({
    where: { slug: parsed.data.slug, id: { not: session.user.id } },
    select: { id: true },
  })

  if (existingSlug) {
    return NextResponse.json({ error: 'Este link público já está em uso' }, { status: 409 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { name: true, email: true, slug: true, phone: true, cpf: true, timezone: true, plan: true },
  })

  return NextResponse.json(user)
}
