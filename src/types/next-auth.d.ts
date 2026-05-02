import type { Plan } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      slug: string | null
      plan: Plan
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    slug?: string | null
    plan?: Plan
  }
}
