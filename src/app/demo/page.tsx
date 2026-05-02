import type { Metadata } from 'next'
import DemoBooking from './DemoBooking'

export const metadata: Metadata = {
  title: 'Demonstração - AgendaFácil',
  description: 'Veja como funciona uma página pública de agendamento com Pix e WhatsApp no AgendaFácil.',
}

export default function DemoPage() {
  return <DemoBooking />
}
