'use client'

import { useState } from 'react'
import { format, addDays, startOfDay, setHours, setMinutes, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  eventId: string
  duration: number
  timezone: string
}

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

export default function BookingForm({ eventId, duration, timezone }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [step, setStep] = useState<'date' | 'form' | 'done'>('date')
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)

  const today = startOfDay(new Date())
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1))

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setLoading(true)

    const [h, m] = selectedTime.split(':').map(Number)
    const startTime = setMinutes(setHours(selectedDate, h), m)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, startTime: startTime.toISOString(), ...form }),
      })
      if (res.ok) setStep('done')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Agendado com sucesso!</h2>
        <p className="text-gray-500 text-sm">
          Você receberá uma confirmação no email <strong>{form.email}</strong> em breve.
        </p>
        <div className="mt-4 bg-green-50 rounded-xl p-4 text-sm text-green-800">
          📅 {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {step === 'date' ? (
        <>
          <h2 className="font-bold text-gray-900 mb-4">Escolha um horário</h2>

          {/* Date picker */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {days.map(day => (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-xl text-center text-xs font-semibold border transition-colors ${
                  selectedDate?.toDateString() === day.toDateString()
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-200 text-gray-700 hover:border-green-400'
                }`}
              >
                <div className="text-gray-400 text-[10px] font-normal">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div>{format(day, 'd')}</div>
                <div className="text-[10px] font-normal">
                  {format(day, 'MMM', { locale: ptBR })}
                </div>
              </button>
            ))}
          </div>

          {/* Time slots */}
          {selectedDate && (
            <>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Horários disponíveis — {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                      selectedTime === slot
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-200 text-gray-700 hover:border-green-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!selectedTime}
                onClick={() => setStep('form')}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40"
              >
                Continuar →
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <button type="button" onClick={() => setStep('date')} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
            ← Voltar
          </button>

          <div className="bg-green-50 rounded-xl p-3 text-sm text-green-800 mb-5 flex items-center gap-2">
            📅 {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedTime}
          </div>

          <h2 className="font-bold text-gray-900 mb-4">Seus dados</h2>

          <form onSubmit={handleBook} className="space-y-3">
            <input
              type="text"
              placeholder="Seu nome completo *"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Seu email *"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Observações (opcional)"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
