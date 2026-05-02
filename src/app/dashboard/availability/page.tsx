import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AvailabilityForm from './AvailabilityForm'

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const slots = await prisma.availability.findMany({
    where: { userId: session.user.id },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    select: { dayOfWeek: true, startTime: true, endTime: true },
  })

  return <AvailabilityForm initialSlots={slots} />
}
