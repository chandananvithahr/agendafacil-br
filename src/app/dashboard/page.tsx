import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-green-600">AgendaFácil</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Plano: <strong className="text-green-600">Gratuito</strong></span>
            <Link href="/dashboard/upgrade" className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Upgrade Pro
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* WELCOME */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Sua Agenda</h1>
          <p className="text-gray-500 text-sm mt-1">
            Seu link de agendamento:{' '}
            <span className="bg-green-50 text-green-700 font-mono text-xs px-2 py-0.5 rounded">
              agendafacil.com.br/seu-nome
            </span>
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Agendamentos hoje', value: '0', icon: '📅' },
            { label: 'Esta semana', value: '0', icon: '📊' },
            { label: 'Total de clientes', value: '0', icon: '👥' },
            { label: 'Receita (mês)', value: 'R$0', icon: '💰' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* EVENT TYPES */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Tipos de evento</h2>
                <Link href="/dashboard/events/new" className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  + Novo evento
                </Link>
              </div>

              {/* Empty state */}
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-medium text-gray-500">Nenhum tipo de evento ainda</p>
                <p className="text-sm mt-1">Crie seu primeiro tipo de evento para começar a receber agendamentos</p>
                <Link href="/dashboard/events/new" className="inline-block mt-4 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Criar primeiro evento
                </Link>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            {/* Quick links */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Configurações rápidas</h3>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/availability', label: '⏰ Horários disponíveis' },
                  { href: '/dashboard/profile', label: '👤 Perfil público' },
                  { href: '/dashboard/integrations', label: '🔗 Integrações' },
                  { href: '/dashboard/payments', label: '💳 Pagamentos (Pix)' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="flex items-center text-sm text-gray-600 hover:text-green-600 py-1 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-5">
              <div className="font-bold text-green-800 mb-1">🚀 Upgrade para Pro</div>
              <p className="text-xs text-green-700 mb-3">Ative Pix, WhatsApp e eventos ilimitados por R$99/mês</p>
              <Link href="/dashboard/upgrade" className="block text-center bg-green-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-green-700 transition-colors">
                Ver plano Pro
              </Link>
            </div>
          </div>
        </div>

        {/* UPCOMING BOOKINGS */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mt-6">
          <h2 className="font-bold text-gray-900 mb-4">Próximos agendamentos</h2>
          <div className="text-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">Nenhum agendamento ainda</p>
            <p className="text-xs mt-1">Compartilhe seu link para receber seu primeiro agendamento</p>
          </div>
        </div>
      </div>
    </div>
  )
}
