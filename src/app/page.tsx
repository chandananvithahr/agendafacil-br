import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-gray-100">
        <div className="font-black text-xl text-green-600">AgendaFácil</div>
        <div className="flex items-center gap-6">
          <Link href="#precos" className="text-sm text-gray-600 hover:text-gray-900">Preços</Link>
          <Link href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900">Como funciona</Link>
          <Link href="/auth/signin" className="text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
          🇧🇷 Feito para o Brasil
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
          Agendamento online com{' '}
          <span className="text-green-600">Pix e WhatsApp</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Crie seu link de agendamento em 5 minutos. Seus clientes agendam, pagam via Pix, e recebem lembretes no WhatsApp — tudo em português.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/signin" className="bg-green-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-green-700 transition-colors">
            Criar minha agenda grátis
          </Link>
          <Link href="#como-funciona" className="text-gray-600 font-semibold px-8 py-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
            Ver como funciona
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">Gratuito para sempre · Sem cartão de crédito · 5 minutos para configurar</p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400 mb-6">Profissionais que usam o AgendaFácil</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-medium">
            {['👩‍⚕️ Psicólogos', '💪 Personal trainers', '📚 Tutores', '🧘 Coaches', '💇 Salões de beleza', '⚖️ Advogados', '🍎 Nutricionistas', '💻 Freelancers'].map(p => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20" id="como-funciona">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Por que escolher o AgendaFácil?</h2>
        <p className="text-center text-gray-500 mb-14">O Calendly não foi feito para o Brasil. Nós fomos.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '💚', title: 'Pix integrado', desc: 'Cobranças automáticas via Pix. Seu cliente agenda e paga na hora — sem burocracia.' },
            { icon: '📱', title: 'Lembretes no WhatsApp', desc: 'Reduza faltas em até 70%. Lembretes automáticos no WhatsApp — onde todo brasileiro está.' },
            { icon: '🇧🇷', title: '100% em português', desc: 'Interface, emails e página de agendamento completamente em pt-BR.' },
            { icon: '🔗', title: 'Link personalizado', desc: 'Seu link: agendafacil.com.br/seu-nome. Compartilhe em segundos.' },
            { icon: '📅', title: 'Disponibilidade automática', desc: 'Configure seus horários uma vez. O sistema só mostra quando você está disponível.' },
            { icon: '📊', title: 'Relatórios simples', desc: 'Agendamentos, pagamentos e histórico de clientes em um lugar só.' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-green-50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Pronto em 3 passos</h2>
          <div className="flex flex-col md:flex-row gap-8">
            {[
              { num: '1', title: 'Crie sua conta', desc: 'Cadastre-se com email ou Google em menos de 1 minuto.' },
              { num: '2', title: 'Configure sua agenda', desc: 'Defina seus horários e tipos de consulta ou serviço.' },
              { num: '3', title: 'Compartilhe seu link', desc: 'Envie no Instagram ou WhatsApp. Seus clientes agendam sozinhos.' },
            ].map((s) => (
              <div key={s.num} className="flex-1 text-center">
                <div className="w-12 h-12 bg-green-600 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/auth/signin" className="inline-block mt-10 bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-colors">
            Começar agora — é grátis
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-4xl mx-auto px-6 py-20" id="precos">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Planos simples e transparentes</h2>
        <p className="text-center text-gray-500 mb-12">Sem letras miúdas. Sem surpresas na fatura.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Gratuito</div>
            <div className="text-4xl font-black mb-1">R$0</div>
            <div className="text-gray-400 text-sm mb-6">para sempre</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {['1 tipo de evento', '5 agendamentos/mês', 'Página de agendamento', 'Confirmação por email'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/auth/signin" className="block text-center bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
              Começar grátis
            </Link>
          </div>

          <div className="border-2 border-green-600 rounded-2xl p-6 bg-green-50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              MAIS POPULAR
            </div>
            <div className="text-xs font-bold text-green-700 uppercase mb-2">Pro</div>
            <div className="text-4xl font-black mb-1">R$99</div>
            <div className="text-gray-400 text-sm mb-6">por mês</div>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              {['Tipos de evento ilimitados', 'Agendamentos ilimitados', 'Pagamento via Pix', 'Lembretes no WhatsApp', 'Google Calendar', 'Link personalizado', 'Suporte em português'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/auth/signin" className="block text-center bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">
              Assinar Pro
            </Link>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Agências</div>
            <div className="text-4xl font-black mb-1">R$199</div>
            <div className="text-gray-400 text-sm mb-6">por mês</div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {['Tudo do Pro', 'Até 10 usuários', 'Painel de administração', 'White-label', 'Relatórios avançados', 'Suporte prioritário'].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
              ))}
            </ul>
            <Link href="/auth/signin" className="block text-center bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
              Falar com a equipe
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-black mb-4">Pronto para parar de perder clientes?</h2>
        <p className="text-green-100 mb-8 max-w-md mx-auto">
          Crie sua agenda grátis agora. Configure em 5 minutos, comece a receber agendamentos hoje.
        </p>
        <Link href="/auth/signin" className="inline-block bg-white text-green-700 font-black px-8 py-4 rounded-xl hover:bg-green-50 transition-colors text-lg">
          Criar minha agenda grátis →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-sm text-gray-400">
        <p>AgendaFácil — Agendamento online para profissionais brasileiros</p>
        <p className="mt-1">
          <Link href="/privacidade" className="hover:text-gray-600">Privacidade</Link>
          {' · '}
          <Link href="/termos" className="hover:text-gray-600">Termos</Link>
          {' · '}
          <Link href="/contato" className="hover:text-gray-600">Contato</Link>
        </p>
      </footer>
    </main>
  )
}
