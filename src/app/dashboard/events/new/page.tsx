'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const durations = [15, 30, 45, 60, 90]

const locations = [
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Telefone' },
  { value: 'in_person', label: 'Presencial' },
]

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewEvent() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    duration: 50,
    price: 120,
    requiresPayment: true,
    location: 'google_meet',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTitle = (title: string) => {
    setForm((current) => ({ ...current, title, slug: makeSlug(title) }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: makeSlug(form.slug),
          price: form.requiresPayment ? form.price : 0,
        }),
      })

      if (res.ok) {
        router.push('/dashboard')
        return
      }

      if (res.status === 401) {
        setError('Sua sessão expirou. Entre novamente para criar o evento.')
      } else if (res.status === 409) {
        setError('Este endereço de evento já está em uso. Escolha outro link.')
      } else {
        setError('Não foi possível criar o evento. Revise os campos e tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const publicSlug = form.slug || 'consulta-inicial'
  const selectedLocation = locations.find((location) => location.value === form.location)?.label ?? 'Google Meet'

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Voltar
            </Link>
            <Link href="/" className="text-lg font-black">AgendaFácil</Link>
          </div>
          <Link href="/demo" className="hidden rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 sm:inline-flex">
            Ver demo
          </Link>
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-7">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Novo evento</div>
            <h1 className="mt-3 text-4xl font-black tracking-normal">Crie o serviço que o cliente vai agendar.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Comece com o atendimento principal. Depois você pode criar variações para avaliação, retorno, consultoria ou aula.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-lg font-black">Informações básicas</h2>
              <div className="mt-5 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="title">Nome do evento</label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(event) => handleTitle(event.target.value)}
                    placeholder="Consulta inicial"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="slug">Link público</label>
                  <div className="grid overflow-hidden rounded-lg border border-slate-300 bg-white sm:grid-cols-[minmax(0,230px)_1fr]">
                    <span className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-500 sm:border-b-0 sm:border-r">
                      agendafacil.com.br/seu-nome/
                    </span>
                    <input
                      id="slug"
                      type="text"
                      value={form.slug}
                      onChange={(event) => setForm((current) => ({ ...current, slug: makeSlug(event.target.value) }))}
                      className="min-w-0 px-3 py-3 text-sm font-bold outline-none"
                      placeholder="consulta-inicial"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Explique o que acontece neste atendimento."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-lg font-black">Duração e local</h2>
              <div className="mt-5 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Duração</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {durations.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, duration }))}
                        className={`rounded-lg border px-3 py-3 text-sm font-black ${
                          form.duration === duration
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-slate-300 text-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="location">Local</label>
                  <select
                    id="location"
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  >
                    {locations.map((location) => (
                      <option key={location.value} value={location.value}>{location.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-black">Pagamento</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Use cobrança quando faltas ou reservas falsas custam caro.</p>
                </div>
                <label className="flex items-center gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
                  <input
                    type="checkbox"
                    checked={form.requiresPayment}
                    onChange={(event) => setForm((current) => ({ ...current, requiresPayment: event.target.checked }))}
                    className="h-4 w-4 accent-emerald-700"
                  />
                  Cobrar por Pix
                </label>
              </div>

              {form.requiresPayment && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="price">Valor em reais</label>
                  <input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                    min={0}
                    step={1}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-black text-slate-700 hover:bg-slate-50 sm:flex-1">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || !form.title || !form.slug}
                className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              >
                {loading ? 'Criando evento...' : 'Criar evento'}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Preview</div>
            <div className="mt-4 rounded-lg bg-slate-950 p-5 text-white">
              <div className="text-sm text-slate-300">@seu-nome</div>
              <h2 className="mt-2 text-2xl font-black">{form.title || 'Consulta inicial'}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {form.description || 'Descrição curta do atendimento que o cliente está marcando.'}
              </p>
              <div className="mt-5 grid gap-2 text-sm">
                <div className="flex justify-between rounded-lg bg-white/10 px-3 py-2">
                  <span>Duração</span>
                  <strong>{form.duration} min</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-white/10 px-3 py-2">
                  <span>Local</span>
                  <strong>{selectedLocation}</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-white/10 px-3 py-2">
                  <span>Valor</span>
                  <strong>{form.requiresPayment ? `R$${form.price}` : 'Grátis'}</strong>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-slate-100 px-3 py-3 font-mono text-xs font-bold text-slate-700">
              /seu-nome/{publicSlug}
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-black text-amber-950">Boa primeira oferta</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Use um evento pago para consulta inicial, avaliação ou diagnóstico. É mais fácil vender um serviço claro do que uma agenda genérica.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
