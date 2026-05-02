'use client'

import Link from 'next/link'
import { useState } from 'react'

type ProfileInitialValues = {
  name: string
  slug: string
  phone: string
  cpf: string
  timezone: string
}

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

export default function ProfileForm({
  initialValues,
  appUrl,
}: {
  initialValues: ProfileInitialValues
  appUrl: string
}) {
  const [form, setForm] = useState(initialValues)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault()
    setStatus('')
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, slug: makeSlug(form.slug) }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          phone: data.phone ?? '',
          cpf: data.cpf ?? '',
          timezone: data.timezone ?? 'America/Sao_Paulo',
        })
      }
      setStatus(res.ok ? 'Perfil salvo.' : data.error ?? 'Nao foi possivel salvar. Entre novamente e tente de novo.')
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

      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-8 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Perfil publico</div>
            <h1 className="mt-3 text-4xl font-black tracking-normal">Dados que aparecem na sua agenda.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Use nome profissional, telefone brasileiro e CPF quando precisar emitir recibo ou nota.</p>
          </div>

          <form onSubmit={saveProfile} className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Nome profissional
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Link publico
              <div className="grid overflow-hidden rounded-lg border border-slate-300 bg-white sm:grid-cols-[210px_1fr]">
                <span className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-500 sm:border-b-0 sm:border-r">{appUrl.replace(/^https?:\/\//, '')}/</span>
                <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: makeSlug(event.target.value) }))} className="min-w-0 px-3 py-3 font-normal outline-none" />
              </div>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                WhatsApp
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                CPF ou CNPJ
                <input value={form.cpf} onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))} className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-700" placeholder="Opcional" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Fuso horario
              <select value={form.timezone} onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))} className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700">
                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                <option value="America/Manaus">America/Manaus</option>
                <option value="America/Fortaleza">America/Fortaleza</option>
                <option value="America/Recife">America/Recife</option>
              </select>
            </label>
            {status && <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">{status}</div>}
            <button disabled={saving || !form.name || !form.slug} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-60">
              {saving ? 'Salvando...' : 'Salvar perfil'}
            </button>
          </form>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black">Preview do link</h2>
          <div className="mt-4 rounded-lg bg-slate-950 p-5 text-white">
            <div className="text-sm text-slate-300">@{form.slug || 'seu-nome'}</div>
            <div className="mt-2 text-2xl font-black">{form.name || 'Seu nome'}</div>
            <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm">{form.phone || '+55'}</div>
          </div>
        </aside>
      </div>
    </main>
  )
}
