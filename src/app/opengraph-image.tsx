import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AgendaFácil — Agendamento Online com Pix e WhatsApp'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        <div
          style={{
            background: 'white',
            color: '#16a34a',
            padding: '12px 28px',
            borderRadius: 999,
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          🇧🇷 FEITO PARA O BRASIL
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 96,
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: -3,
          }}
        >
          AgendaFácil
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 44,
            fontWeight: 600,
            marginTop: 24,
            textAlign: 'center',
            opacity: 0.95,
          }}
        >
          Agendamento online com Pix e WhatsApp
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 28,
            marginTop: 32,
            opacity: 0.85,
          }}
        >
          Grátis · 5 minutos para configurar
        </div>
      </div>
    ),
    { ...size }
  )
}
