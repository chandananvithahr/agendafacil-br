import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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
      from: 'AgendaFácil <noreply@agendafacil.com.br>',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          slug: (user as any).slug,
          plan: (user as any).plan,
        },
      }
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser) {
        const baseSlug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        let slug = baseSlug
        let counter = 1
        while (await prisma.user.findUnique({ where: { slug } })) {
          slug = `${baseSlug}${counter}`
          counter++
        }
        await prisma.user.update({
          where: { email: user.email },
          data: { slug },
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'database' },
}
