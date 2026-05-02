import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getAppUrl } from '@/lib/app-config'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, slug: true, phone: true, cpf: true, timezone: true },
  })
  if (!user) redirect('/auth/signin')

  return (
    <ProfileForm
      appUrl={getAppUrl().replace(/\/$/, '')}
      initialValues={{
        name: user.name ?? '',
        slug: user.slug ?? '',
        phone: user.phone ?? '',
        cpf: user.cpf ?? '',
        timezone: user.timezone ?? 'America/Sao_Paulo',
      }}
    />
  )
}
