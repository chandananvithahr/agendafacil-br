import { Resend } from 'resend'
import { getMailFrom } from '@/lib/app-config'

type BookingNotification = {
  guestName: string
  guestEmail: string
  guestPhone?: string | null
  eventTitle: string
  professionalName: string
  startTime: Date
  timezone: string
}

export function bookingEmailHtml(booking: BookingNotification) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h1>Agendamento confirmado</h1>
      <p>Ola, ${booking.guestName}.</p>
      <p>Seu horario para <strong>${booking.eventTitle}</strong> com ${booking.professionalName} foi confirmado.</p>
      <p><strong>Data:</strong> ${booking.startTime.toLocaleString('pt-BR', { timeZone: booking.timezone })}</p>
      <p>Se precisar alterar o horario, responda este e-mail ou fale pelo WhatsApp informado na pagina de agendamento.</p>
    </div>
  `
}

export async function sendBookingConfirmation(booking: BookingNotification) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: 'RESEND_API_KEY nao configurada' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: getMailFrom(),
    to: booking.guestEmail,
    subject: `Agendamento confirmado: ${booking.eventTitle}`,
    html: bookingEmailHtml(booking),
  })

  return { sent: true }
}

export async function queueWhatsAppReminder(booking: BookingNotification) {
  if (!process.env.WHATSAPP_API_TOKEN || !booking.guestPhone) {
    return { queued: false, reason: 'WhatsApp nao configurado' }
  }

  // Provider-specific sending is intentionally isolated behind env checks.
  // Wire Z-API, Twilio, or another Brazil-first provider here in production.
  return { queued: true }
}
