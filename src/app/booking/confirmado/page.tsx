import Link from 'next/link'

export default function BookingConfirmedPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-xl rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="mb-4 inline-flex rounded-md bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
          Pagamento recebido
        </div>
        <h1 className="text-3xl font-black tracking-normal">Seu agendamento esta confirmado.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A confirmacao sera enviada por e-mail. Se o profissional usa WhatsApp, o lembrete tambem sera enviado para o telefone informado.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
          Voltar ao inicio
        </Link>
      </section>
    </main>
  )
}
