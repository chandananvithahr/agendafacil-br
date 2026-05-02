import Link from 'next/link'

const integrations = [
  { name: 'Google Calendar', status: 'Próximo', text: 'Sincronizar eventos e evitar conflito de agenda.' },
  { name: 'Stripe Pix', status: 'Pronto para chave', text: 'Checkout Pix protegido por STRIPE_SECRET_KEY.' },
  { name: 'WhatsApp', status: 'Pro', text: 'Lembretes via Z-API, Twilio ou provedor brasileiro.' },
  { name: 'Resend', status: 'Configurável', text: 'Confirmação e links mágicos por e-mail.' },
]

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Voltar</Link>
          <Link href="/" className="text-lg font-black">AgendaFácil</Link>
        </div>
      </nav>
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Integrações</div>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Conectores que fazem a agenda trabalhar.</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((integration) => (
            <div key={integration.name} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-black">{integration.name}</h2>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{integration.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{integration.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
