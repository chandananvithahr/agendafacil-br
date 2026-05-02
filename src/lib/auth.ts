import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Plan } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { Resend } from 'resend'
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

function magicLinkEmailHtml(url: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;background:#f7f3ea;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px">
        <p style="margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#047857">AgendaFacil</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#0f172a">Seu link de acesso esta pronto.</h1>
        <p style="margin:0 0 20px;font-size:15px;color:#475569">Clique no botao abaixo para entrar no painel e continuar configurando sua agenda.</p>
        <a href="${url}" style="display:inline-block;background:#047857;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 18px;font-size:14px;font-weight:800">Entrar no AgendaFacil</a>
        <p style="margin:22px 0 0;font-size:12px;color:#64748b">Se voce nao pediu este acesso, ignore este e-mail.</p>
      </div>
    </div>
  `
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
      async sendVerificationRequest({ identifier, url }) {
        if (!process.env.RESEND_API_KEY) {
          throw new Error('RESEND_API_KEY nao configurada')
        }

        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: getMailFrom(),
          to: identifier,
          subject: 'Seu link de acesso ao AgendaFacil',
          html: magicLinkEmailHtml(url),
        })
      },
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
