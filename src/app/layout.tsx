import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://saas-clone-br-calendly.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'AgendaFacil - Agendamento online com Pix e WhatsApp',
  description: 'Crie seu link de agendamento em 5 minutos. Pagamento via Pix, lembretes no WhatsApp, 100% em portugues. Gratis para sempre. Alternativa brasileira ao Calendly.',
  keywords: [
    'agendamento online',
    'alternativa calendly',
    'agendamento pix',
    'agenda online gratuita',
    'link de agendamento',
    'calendly brasil',
    'agendamento whatsapp',
    'agenda profissional',
  ],
  authors: [{ name: 'AgendaFacil' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: appUrl,
    siteName: 'AgendaFacil',
    title: 'AgendaFacil - Agendamento online com Pix e WhatsApp',
    description: 'Crie seu link de agendamento em 5 minutos. Pagamento via Pix, lembretes no WhatsApp. Gratis para sempre.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgendaFacil - Agendamento online com Pix e WhatsApp',
    description: 'Crie seu link de agendamento em 5 minutos. Pagamento via Pix, lembretes no WhatsApp. Gratis.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: appUrl },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
