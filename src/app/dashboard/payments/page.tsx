'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

const plans = [
  { key: 'PRO', name: 'Pro', price: 'R$99', text: 'Pix nos agendamentos, WhatsApp e eventos ilimitados.' },
  { key: 'AGENCY', name: 'Agencias', price: 'R$199', text: 'Equipe, relatorios e suporte prioritario.' },
] as const

function PaymentsContent() {
  const search = useSearchParams()
  const [message, setMessage] = useState('')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function startCheckout(plan: 'PRO' | 'AGENCY') {
    setMessage('')
    setLoadingPlan(plan)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setMessage(data.error ?? 'Nao foi possivel abrir o checkout.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <>
      {search.get('checkout') === 'success' && <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">Checkout concluido. O plano sera ativado pelo webhook da Stripe.</div>}
      {search.get('checkout') === 'cancelled' && <div className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">Checkout cancelado.</div>}
      {message && <div className="mb-5 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">{message}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.key} className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <div className="mt-4 text-5xl font-black">{plan.price}<span className="text-base font-bold text-slate-500">/mes</span></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{plan.text}</p>
            <button onClick={() => startCheckout(plan.key)} disabled={loadingPlan === plan.key} className="mt-6 w-full rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-60">
              {loadingPlan === plan.key ? 'Abrindo checkout...' : 'Assinar plano'}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Voltar</Link>
          <Link href="/" className="text-lg font-black">AgendaFacil</Link>
        </div>
      </nav>
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Pagamentos</div>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Ative a agenda paga quando comecar a vender.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">A assinatura libera recursos pagos; os agendamentos pagos usam checkout Pix no fluxo publico.</p>
        </div>

        <Suspense fallback={<div className="rounded-lg bg-white p-6 text-sm font-bold text-slate-600">Carregando checkout...</div>}>
          <PaymentsContent />
        </Suspense>
      </section>
    </main>
  )
}
