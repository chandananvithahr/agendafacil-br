'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewEvent() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    duration: 30,
    price: 0,
    requiresPayment: false,
    location: 'google_meet',
  })
  const [loading, setLoading] = useState(false)

  const handleTitle = (title: string) => {
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setForm(f => ({ ...f, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">← Voltar</Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="font-black text-green-600">AgendaFácil</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Novo tipo de evento</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
            <h2 className="font-bold text-gray-900">Informações básicas</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do evento *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleTitle(e.target.value)}
                placeholder="Ex: Consulta inicial, Sessão de coaching"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL do evento</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <span className="bg-gray-50 px-3 py-3 text-xs text-gray-400 border-r border-gray-200 whitespace-nowrap">
                  agendafacil.com.br/seu-nome/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="flex-1 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descreva o que acontece nesta reunião..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
            <h2 className="font-bold text-gray-900">Duração e local</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
              <div className="flex gap-2">
                {[15, 30, 45, 60, 90].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, duration: d }))}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      form.duration === d
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    {d}min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local / Formato</label>
              <select
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="google_meet">Google Meet (link automático)</option>
                <option value="zoom">Zoom</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Telefone</option>
                <option value="in_person">Presencial</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
            <h2 className="font-bold text-gray-900">Pagamento</h2>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requiresPayment"
                checked={form.requiresPayment}
                onChange={e => setForm(f => ({ ...f, requiresPayment: e.target.checked }))}
                className="w-4 h-4 accent-green-600"
              />
              <label htmlFor="requiresPayment" className="text-sm text-gray-700">
                Cobrar para agendar
              </label>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">PRO</span>
            </div>

            {form.requiresPayment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  min={0}
                  step={0.01}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">Pagamento via Pix (disponível no plano Pro)</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1 text-center border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !form.title}
              className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
