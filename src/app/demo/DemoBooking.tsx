'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { addDays, format, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const slots = ['09:00', '10:30', '14:00', '15:30', '16:00', '17:00']

export default function DemoBooking() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState('15:30')
  const [name, setName] = useState('Ana Carvalho')
  const [email, setEmail] = useState('ana@empresa.com')
  const [phone, setPhone] = useState('(11) 99999-2044')
  const [confirmed, setConfirmed] = useState(false)

  const days = useMemo(() => {
    const today = startOfDay(new Date())
    return Array.from({ length: 5 }, (_, index) => addDays(today, index + 1))
  }, [])

  const selectedDate = days[selectedDay]

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10">
          <div className="mb-6 inline-flex rounded-md bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
            Agendamento confirmado
          </div>
          <h1 className="text-4xl font-black tracking-normal">Consulta inicial marcada.</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            {name} receberia confirmação em {email} e lembrete no WhatsApp {phone}.
          </p>
          <div className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm md:grid-cols-3">
            <div>
              <div className="font-bold text-slate-500">Data</div>
              <div className="mt-1 font-black text-slate-950">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500">Horário</div>
              <div className="mt-1 font-black text-slate-950">{selectedSlot}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500">Pagamento</div>
              <div className="mt-1 font-black text-slate-950">Pix pendente</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-slate-50"
            >
              Editar demonstração
            </button>
            <Link href="/auth/signin" className="rounded-lg bg-emerald-700 px-5 py-3 text-center text-sm font-black text-white hover:bg-emerald-800">
              Criar minha agenda grátis
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-slate-950">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-black">AgendaFácil</Link>
        <Link href="/auth/signin" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
          Criar conta
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="bg-slate-950 p-6 text-white md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-lg font-black">MS</div>
            <div>
              <div className="font-black">Maria Silva</div>
              <div className="text-sm text-slate-300">@mariasilva</div>
            </div>
          </div>

          <div className="rounded-lg bg-white/8 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Consulta inicial</div>
            <h1 className="mt-3 text-3xl font-black tracking-normal">Avaliação para organizar sua rotina de atendimento.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Demonstração de uma página pública com pagamento por Pix, confirmação por e-mail e lembrete por WhatsApp.
            </p>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Duração</span>
              <strong>50 min</strong>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Valor</span>
              <strong>R$120</strong>
            </div>
            <div className="flex justify-between rounded-lg border border-white/10 px-4 py-3">
              <span className="text-slate-300">Local</span>
              <strong>Google Meet</strong>
            </div>
          </div>
        </aside>

        <section className="p-5 md:p-8">
          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Escolha uma data</div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {days.map((day, index) => (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDay(index)}
                  className={`rounded-lg border px-2 py-3 text-center text-sm ${
                    selectedDay === index
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{format(day, 'EEE', { locale: ptBR })}</div>
                  <div className="mt-1 text-lg font-black">{format(day, 'd')}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Horários disponíveis</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-3 py-3 text-sm font-black ${
                    selectedSlot === slot
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <form
            className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            onSubmit={(event) => {
              event.preventDefault()
              setConfirmed(true)
            }}
          >
            <div className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-700">Seus dados</div>
            <div className="grid gap-3">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                placeholder="Seu nome"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                placeholder="seu@email.com"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                placeholder="WhatsApp"
              />
            </div>
            <div className="mt-5 rounded-lg bg-white p-4 text-sm text-slate-600">
              <strong className="text-slate-950">Resumo:</strong> {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })} às {selectedSlot}, 50 minutos, R$120 via Pix.
            </div>
            <button type="submit" className="mt-5 w-full rounded-lg bg-emerald-700 px-5 py-4 text-sm font-black text-white hover:bg-emerald-800">
              Confirmar demonstração
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
