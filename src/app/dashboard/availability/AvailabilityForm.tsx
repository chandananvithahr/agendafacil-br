'use client'

import Link from 'next/link'
import { useState } from 'react'

const days = [
  ['Domingo', 0],
  ['Segunda', 1],
  ['Terca', 2],
  ['Quarta', 3],
  ['Quinta', 4],
  ['Sexta', 5],
  ['Sabado', 6],
] as const

type AvailabilitySlot = {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export default function AvailabilityForm({ initialSlots }: { initialSlots: AvailabilitySlot[] }) {
  const [startTime, setStartTime] = useState(initialSlots[0]?.startTime ?? '09:00')
  const [endTime, setEndTime] = useState(initialSlots[0]?.endTime ?? '17:00')
  const [enabledDays, setEnabledDays] = useState<number[]>(initialSlots.map((slot) => slot.dayOfWeek).sort())
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  async function saveAvailability() {
    setSaving(true)
    setStatus('')
    try {
      const slots = enabledDays.map((dayOfWeek) => ({ dayOfWeek, startTime, endTime }))
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })
      const data = await res.json().catch(() => ({}))
      setStatus(res.ok ? 'Disponibilidade salva.' : data.error ?? 'Nao foi possivel salvar. Entre novamente e tente de novo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Voltar</Link>
          <Link href="/" className="text-lg font-black">AgendaFacil</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Horarios</div>
            <h1 className="mt-3 text-4xl font-black tracking-normal">Defina quando clientes podem agendar.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Este MVP usa uma janela semanal simples. Depois da para adicionar excecoes, feriados e bloqueios.</p>
          </div>

          <div className="grid gap-5">
            <div>
              <div className="mb-2 text-sm font-bold text-slate-700">Dias disponiveis</div>
              <div className="grid gap-2 sm:grid-cols-7">
                {days.map(([label, value]) => {
                  const active = enabledDays.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEnabledDays((current) => active ? current.filter((day) => day !== value) : [...current, value].sort())}
                      className={`rounded-lg border px-3 py-3 text-sm font-black ${active ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 text-slate-700 hover:border-emerald-400'}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Inicio
                <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Fim
                <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
              </label>
            </div>

            {status && <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">{status}</div>}
            <button onClick={saveAvailability} disabled={saving || enabledDays.length === 0} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-60">
              {saving ? 'Salvando...' : 'Salvar disponibilidade'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
