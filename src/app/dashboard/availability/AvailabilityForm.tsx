'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

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

type TimeWindow = {
  startTime: string
  endTime: string
}

type AvailabilityState = Record<number, TimeWindow[]>

const defaultWindow: TimeWindow = { startTime: '09:00', endTime: '17:00' }
const splitDayWindow: TimeWindow = { startTime: '14:00', endTime: '18:00' }

function buildInitialState(initialSlots: AvailabilitySlot[]) {
  const state = days.reduce<AvailabilityState>((current, [, day]) => {
    current[day] = []
    return current
  }, {})

  for (const slot of initialSlots) {
    state[slot.dayOfWeek] ??= []
    state[slot.dayOfWeek].push({ startTime: slot.startTime, endTime: slot.endTime })
  }

  return state
}

export default function AvailabilityForm({ initialSlots }: { initialSlots: AvailabilitySlot[] }) {
  const [availability, setAvailability] = useState<AvailabilityState>(() => buildInitialState(initialSlots))
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const slots = useMemo(() => {
    return days.flatMap(([, dayOfWeek]) => (
      availability[dayOfWeek].map((window) => ({ dayOfWeek, ...window }))
    ))
  }, [availability])
  const slotLimitReached = slots.length >= 14

  function toggleDay(dayOfWeek: number) {
    setAvailability((current) => ({
      ...current,
      [dayOfWeek]: current[dayOfWeek].length ? [] : [{ ...defaultWindow }],
    }))
  }

  function addWindow(dayOfWeek: number) {
    if (slotLimitReached) {
      setStatus('O limite do MVP e 14 janelas por semana.')
      return
    }

    setAvailability((current) => ({
      ...current,
      [dayOfWeek]: [...current[dayOfWeek], { ...splitDayWindow }],
    }))
  }

  function removeWindow(dayOfWeek: number, index: number) {
    setAvailability((current) => ({
      ...current,
      [dayOfWeek]: current[dayOfWeek].filter((_, currentIndex) => currentIndex !== index),
    }))
  }

  function updateWindow(dayOfWeek: number, index: number, field: keyof TimeWindow, value: string) {
    setAvailability((current) => ({
      ...current,
      [dayOfWeek]: current[dayOfWeek].map((window, currentIndex) => (
        currentIndex === index ? { ...window, [field]: value } : window
      )),
    }))
  }

  async function saveAvailability() {
    setSaving(true)
    setStatus('')

    try {
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
            <p className="mt-3 text-sm leading-6 text-slate-600">Use uma ou mais janelas por dia para bloquear almoco, deslocamentos e pausas.</p>
          </div>

          <div className="grid gap-4">
            {days.map(([label, dayOfWeek]) => {
              const windows = availability[dayOfWeek]
              const active = windows.length > 0

              return (
                <div key={dayOfWeek} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => toggleDay(dayOfWeek)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm font-black sm:min-w-40 ${active ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 text-slate-700 hover:border-emerald-400'}`}
                    >
                      {label}
                    </button>
                    <button
                      type="button"
                      onClick={() => addWindow(dayOfWeek)}
                      disabled={slotLimitReached}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-slate-50 disabled:opacity-60"
                    >
                      + adicionar janela
                    </button>
                  </div>

                  {active ? (
                    <div className="mt-4 grid gap-3">
                      {windows.map((window, index) => (
                        <div key={`${dayOfWeek}-${index}`} className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                          <label className="grid gap-2 text-sm font-bold text-slate-700">
                            Inicio
                            <input type="time" value={window.startTime} onChange={(event) => updateWindow(dayOfWeek, index, 'startTime', event.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
                          </label>
                          <label className="grid gap-2 text-sm font-bold text-slate-700">
                            Fim
                            <input type="time" value={window.endTime} onChange={(event) => updateWindow(dayOfWeek, index, 'endTime', event.target.value)} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
                          </label>
                          <button type="button" onClick={() => removeWindow(dayOfWeek, index)} className="rounded-lg border border-rose-200 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-50">
                            remover
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">Indisponivel</p>
                  )}
                </div>
              )
            })}

            {status && <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">{status}</div>}
            <button onClick={saveAvailability} disabled={saving || slots.length === 0 || slots.length > 14} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-60">
              {saving ? 'Salvando...' : 'Salvar disponibilidade'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
