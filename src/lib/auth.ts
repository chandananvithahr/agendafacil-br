import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Plan } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { getMailFrom } from '@/lib/app-config'
import { prisma } from '@/lib/prisma'

type AgendaUser = {
  id: string
  slug?: string | null
  plan?: Plan | null
}

function slugBaseFromUser(email?: string | null, name?: string | null, userId?: string) {
  const source = name || email?.split('@')[0] || userId || 'agenda'
  const slug = source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return slug.length >= 3 ? slug : `user-${userId?.slice(0, 8) ?? 'agenda'}`
}

async function assignOnboardingDefaults(user: { id: string; email?: string | null; name?: string | null }) {
  const baseSlug = slugBaseFromUser(user.email, user.name, user.id)
  let slug = baseSlug
  let counter = 1

  while (await prisma.user.findFirst({ where: { slug, NOT: { id: user.id } }, select: { id: true } })) {
    slug = `${baseSlug}-${counter}`
    counter += 1
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { slug, timezone: 'America/Sao_Paulo' },
    }),
    prisma.availability.createMany({
      data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
        userId: user.id,
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
      })),
    }),
  ])
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 465,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: getMailFrom(),
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const agendaUser = user as AgendaUser
      return {
        ...session,
        user: {
          ...session.user,
          id: agendaUser.id,
          slug: agendaUser.slug ?? null,
          plan: agendaUser.plan ?? 'FREE',
        },
      }
    },
  },
  events: {
    async createUser({ user }) {
      await assignOnboardingDefaults({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'database' },
}
