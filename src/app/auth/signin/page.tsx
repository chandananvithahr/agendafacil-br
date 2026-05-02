'use client'

import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

const setupItems = ['Publique seu link', 'Configure horários', 'Ative Pix no Pro', 'Receba lembretes por WhatsApp']

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    await signIn('email', { email, callbackUrl: '/dashboard', redirect: false })
    setLoading(false)
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-black">AgendaFácil</Link>
        <Link href="/demo" className="rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-sm font-bold hover:bg-white">
          Ver demonstração
        </Link>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-950 p-7 text-white md:p-10">
          <div className="inline-flex rounded-md bg-emerald-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Comece grátis
          </div>
          <h1 className="mt-6 max-w-[11ch] text-5xl font-black leading-[0.95] tracking-normal md:text-6xl">
            Sua agenda online em poucos minutos.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Entre para criar sua página pública, configurar horários e receber agendamentos sem mandar a mesma mensagem manualmente todo dia.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {setupItems.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-3 h-2 w-2 rounded-full bg-emerald-400" />
                <div className="text-sm font-bold text-slate-100">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-black text-white">O que acontece depois do login</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Você cai direto no painel para criar o primeiro tipo de evento. O link público fica pronto para compartilhar no WhatsApp, Instagram ou site.
            </p>
          </div>
        </section>

        <section className="p-7 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Acesso</div>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-slate-950">Entrar ou criar conta</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Sem senha para decorar. Use Google ou receba um link seguro no e-mail.</p>
            </div>

            {sent ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                <div className="mb-4 inline-flex rounded-md bg-white px-3 py-2 text-sm font-black text-emerald-800">Link enviado</div>
                <h3 className="text-2xl font-black text-slate-950">Verifique seu e-mail.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Enviamos um link de acesso para <strong>{email}</strong>. Clique nele para abrir seu painel.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-lg border border-emerald-700 px-4 py-3 text-sm font-black text-emerald-800 hover:bg-white"
                >
                  Usar outro e-mail
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-4 text-sm font-black text-slate-950 hover:bg-slate-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar com Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">ou</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <form onSubmit={handleEmail} className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700" htmlFor="email">
                    E-mail profissional
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@empresa.com"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-4 text-sm outline-none focus:border-emerald-700"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-700 px-5 py-4 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Enviando link...' : 'Receber link de acesso'}
                  </button>
                </form>
              </>
            )}

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Ao continuar, você concorda com os{' '}
              <Link href="/termos" className="font-bold underline">Termos</Link>
              {' '}e a{' '}
              <Link href="/privacidade" className="font-bold underline">Política de Privacidade</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
