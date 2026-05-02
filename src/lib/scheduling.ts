import { addDays, addMinutes, format, startOfDay } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import type { Availability, Booking } from '@prisma/client'

export type PublicSlot = {
  startTime: string
  dateKey: string
  dayLabel: string
  dateLabel: string
  timeLabel: string
}

type BusyBooking = Pick<Booking, 'startTime' | 'endTime'>

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function overlaps(start: Date, end: Date, booking: BusyBooking) {
  return booking.startTime < end && booking.endTime > start
}

export function isInsideAvailability(start: Date, end: Date, timezone: string, availability: Availability[]) {
  const startLocal = toZonedTime(start, timezone)
  const endLocal = toZonedTime(end, timezone)

  if (format(startLocal, 'yyyy-MM-dd') !== format(endLocal, 'yyyy-MM-dd')) {
    return false
  }

  const startMinutes = startLocal.getHours() * 60 + startLocal.getMinutes()
  const endMinutes = endLocal.getHours() * 60 + endLocal.getMinutes()
  const dayOfWeek = startLocal.getDay()

  return availability.some((slot) => {
    return (
      slot.dayOfWeek === dayOfWeek &&
      startMinutes >= toMinutes(slot.startTime) &&
      endMinutes <= toMinutes(slot.endTime)
    )
  })
}

export function buildPublicSlots(options: {
  availability: Availability[]
  bookings: BusyBooking[]
  duration: number
  timezone: string
  days?: number
  now?: Date
}) {
  const { availability, bookings, duration, timezone, days = 14, now = new Date() } = options
  const slots: PublicSlot[] = []
  const todayInTimezone = startOfDay(toZonedTime(now, timezone))

  for (let dayOffset = 1; dayOffset <= days; dayOffset += 1) {
    const localDay = addDays(todayInTimezone, dayOffset)
    const dateKey = format(localDay, 'yyyy-MM-dd')
    const dayOfWeek = localDay.getDay()
    const dayAvailability = availability.filter((slot) => slot.dayOfWeek === dayOfWeek)

    for (const window of dayAvailability) {
      const windowStart = toMinutes(window.startTime)
      const windowEnd = toMinutes(window.endTime)

      for (let cursor = windowStart; cursor + duration <= windowEnd; cursor += duration) {
        const time = minutesToTime(cursor)
        const start = fromZonedTime(`${dateKey}T${time}:00`, timezone)
        const end = addMinutes(start, duration)

        if (start <= now) continue
        if (bookings.some((booking) => overlaps(start, end, booking))) continue

        slots.push({
          startTime: start.toISOString(),
          dateKey,
          dayLabel: formatInTimeZone(start, timezone, 'EEE'),
          dateLabel: formatInTimeZone(start, timezone, "dd/MM"),
          timeLabel: formatInTimeZone(start, timezone, 'HH:mm'),
        })
      }
    }
  }

  return slots
}
