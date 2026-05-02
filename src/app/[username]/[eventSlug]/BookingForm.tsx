'use client'

import { useMemo, useState } from 'react'
import type { PublicSlot } from '@/lib/scheduling'

interface Props {
  eventId: string
  duration: number
  timezone: string
  slots: PublicSlot[]
  requiresPayment: boolean
  price: number
}

export default function BookingForm({ eventId, duration, timezone, slots, requiresPayment, price }: Props) {
  const firstDay = slots[0]?.dateKey ?? ''
  const [selectedDay, setSelectedDay] = useState(firstDay)
  const [selectedStartTime, setSelectedStartTime] = useState(slots[0]?.startTime ?? '')
  const [step, setStep] = useState<'time' | 'details' | 'done'>('time')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const days = useMemo(() => {
    const byDate = new Map<string, PublicSlot>()
    for (const slot of slots) {
      if (!byDate.has(slot.dateKey)) byDate.set(slot.dateKey, slot)
    }
    return Array.from(byDate.values())
  }, [slots])

  const visibleSlots = slots.filter((slot) => slot.dateKey === selectedDay)
  const selectedSlot = slots.find((slot) => slot.startTime === selectedStartTime) ?? visibleSlots[0] ?? slots[0]
  const displayPrice = price > 0 ? `R$${(price / 100).toFixed(0)}` : 'gratis'

  const selectDay = (dateKey: string) => {
    const firstSlot = slots.find((slot) => slot.dateKey === dateKey)
    setSelectedDay(dateKey)
    setSelectedStartTime(firstSlot?.startTime ?? '')
  }

  const handleBook = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedSlot) return

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, startTime: selectedSlot.startTime, ...form }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
          return
        }
        setStep('done')
      } else if (res.status === 409) {
        setError('Este horario acabou de ser reservado. Escolha outro horario.')
        setStep('time')
      } else if (res.status === 429) {
        setError('Muitas tentativas em pouco tempo. Aguarde um minuto e tente de novo.')
      } else {
        setError(data.error ?? 'Nao foi possivel confirmar o agendamento. Revise seus dados e tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!slots.length) {
    return (
      <section className="p-6 md:p-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="mb-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-black text-amber-800">
            Sem horarios abertos
          </div>
          <h2 className="text-3xl font-black tracking-normal">Este profissional ainda nao abriu horarios.</h2>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Fale pelo canal onde recebeu o link ou tente novamente mais tarde.
          </p>
        </div>
      </section>
    )
  }

  if (step === 'done') {
    return (
      <section className="p-6 md:p-8">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div className="mb-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-black text-emerald-800">
            Agendamento confirmado
          </div>
          <h2 className="text-3xl font-black tracking-normal">Seu horario foi reservado.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Enviaremos a confirmacao para <strong>{form.email}</strong>. Se o profissional usa WhatsApp, o lembrete tambem sera enviado para {form.phone || 'o telefone informado'}.
          </p>
          <div className="mt-6 grid gap-3 rounded-lg bg-white p-4 text-sm md:grid-cols-3">
            <div>
              <div className="font-bold text-slate-500">Data</div>
              <div className="mt-1 font-black">{selectedSlot.dateLabel}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500">Horario</div>
              <div className="mt-1 font-black">{selectedSlot.timeLabel}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500">Duracao</div>
              <div className="mt-1 font-black">{duration} min</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="p-5 md:p-8">
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          {error}
        </div>
      )}

      {step === 'time' ? (
        <>
          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Escolha uma data</div>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((day) => (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => selectDay(day.dateKey)}
                  className={`rounded-lg border px-2 py-3 text-center text-sm ${
                    selectedDay === day.dateKey
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{day.dayLabel}</div>
                  <div className="mt-1 text-lg font-black">{day.dateLabel}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Horarios disponiveis</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {visibleSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setSelectedStartTime(slot.startTime)}
                  className={`rounded-lg border px-3 py-3 text-sm font-black ${
                    selectedStartTime === slot.startTime
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {slot.timeLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <strong className="text-slate-950">Resumo:</strong> {selectedSlot.dateLabel} as {selectedSlot.timeLabel}, {duration} minutos, fuso {timezone}.
            {requiresPayment && <span className="block pt-1 font-bold text-slate-950">Pagamento Pix: {displayPrice} antes da confirmacao final.</span>}
          </div>

          <button
            type="button"
            onClick={() => setStep('details')}
            className="mt-5 w-full rounded-lg bg-emerald-700 px-5 py-4 text-sm font-black text-white hover:bg-emerald-800"
          >
            Continuar
          </button>
        </>
      ) : (
        <form onSubmit={handleBook}>
          <button
            type="button"
            onClick={() => setStep('time')}
            className="mb-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Voltar
          </button>

          <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <strong className="text-slate-950">Selecionado:</strong> {selectedSlot.dateLabel} as {selectedSlot.timeLabel}
            {requiresPayment && <span className="block pt-1 font-bold text-slate-950">Voce sera levado ao checkout Pix para pagar {displayPrice}.</span>}
          </div>

          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Seu nome completo"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            />
            <input
              type="tel"
              placeholder="WhatsApp"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            />
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
              className="hidden"
              aria-hidden="true"
            />
            <textarea
              placeholder="Observacoes para o profissional"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
              className="resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-emerald-700 px-5 py-4 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Confirmando...' : requiresPayment ? 'Continuar para Pix' : 'Confirmar agendamento'}
          </button>
        </form>
      )}
    </section>
  )
}
