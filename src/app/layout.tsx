import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendaFácil — Agendamento Online para Profissionais Brasileiros",
  description: "Crie seu link de agendamento em minutos. Pagamento via Pix, lembretes no WhatsApp, e interface 100% em português. Alternativa brasileira ao Calendly.",
  keywords: ["agendamento online", "alternativa calendly", "agendamento pix", "agenda online gratuita", "link de agendamento"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
