import Link from 'next/link'
import type { Metadata } from 'next'
import { getAppUrl } from '@/lib/app-config'

export type SeoSlug =
  | 'agendamento-online-gratis'
  | 'alternativa-calendly-portugues'
  | 'como-criar-link-agendamento'
  | 'agendamento-online-para-coaches'
  | 'agendamento-online-para-psicologos'
  | 'agendamento-online-para-nutricionistas'
  | 'aplicativo-agendamento-para-freelancers'
  | 'pagamento-pix-no-agendamento'
  | 'agendamento-online-com-whatsapp'

type SeoArticle = {
  slug: SeoSlug
  title: string
  description: string
  audience: string
  sections: Array<{ heading: string; body: string }>
}

export const seoArticles: SeoArticle[] = [
  {
    slug: 'agendamento-online-gratis',
    title: 'Agendamento online grátis para profissionais brasileiros',
    description: 'Crie um link de agendamento online grátis, em português, para receber reservas sem troca infinita de mensagens.',
    audience: 'profissionais autônomos, clínicas pequenas e consultores',
    sections: [
      { heading: 'Quando usar uma agenda grátis', body: 'Use uma agenda grátis quando o problema principal ainda é organização: o cliente precisa escolher um horário, informar dados básicos e receber confirmação sem depender de conversa manual.' },
      { heading: 'O que configurar primeiro', body: 'Comece com um único serviço: consulta inicial, avaliação, aula experimental ou diagnóstico. Um serviço claro converte melhor que uma lista longa de opções.' },
      { heading: 'Quando cobrar por recursos Pro', body: 'Ative pagamento por Pix e lembretes no WhatsApp quando faltas, reservas falsas ou reagendamentos já estão custando dinheiro.' },
    ],
  },
  {
    slug: 'alternativa-calendly-portugues',
    title: 'Alternativa ao Calendly em português para o Brasil',
    description: 'Veja por que uma agenda em português, com Pix e WhatsApp, funciona melhor para atendimento no Brasil.',
    audience: 'quem usa Calendly, mas atende clientes brasileiros',
    sections: [
      { heading: 'O problema do fluxo importado', body: 'Ferramentas globais resolvem o calendário, mas deixam a experiência fria para clientes brasileiros: idioma, pagamento local e lembrete no canal certo fazem diferença.' },
      { heading: 'O que uma alternativa brasileira precisa ter', body: 'Português claro, fuso de São Paulo por padrão, cobrança em reais, Pix e WhatsApp são partes do produto, não detalhes de tradução.' },
      { heading: 'Quando migrar', body: 'Migre quando o link internacional atrapalha conversão, quando o cliente pede Pix ou quando a equipe ainda confirma horários manualmente pelo WhatsApp.' },
    ],
  },
  {
    slug: 'como-criar-link-agendamento',
    title: 'Como criar link de agendamento para WhatsApp e Instagram',
    description: 'Passo a passo para criar um link de agendamento, publicar na bio e receber horários marcados sem conversa manual.',
    audience: 'profissionais que vendem atendimento por WhatsApp ou Instagram',
    sections: [
      { heading: 'Defina o serviço', body: 'Dê nome ao atendimento, escolha a duração e explique o resultado esperado. Evite nomes genéricos como reunião ou bate-papo.' },
      { heading: 'Escolha a disponibilidade', body: 'Defina dias e horários reais. Uma agenda enxuta passa mais confiança que uma grade aberta demais.' },
      { heading: 'Publique onde o cliente já está', body: 'Use o link na bio do Instagram, mensagem automática do WhatsApp Business, site, assinatura de e-mail e Google Meu Negócio.' },
    ],
  },
  {
    slug: 'agendamento-online-para-coaches',
    title: 'Agendamento online para coaches',
    description: 'Organize sessões de coaching, diagnósticos e chamadas iniciais com confirmação automática e cobrança opcional por Pix.',
    audience: 'coaches e mentores',
    sections: [
      { heading: 'Venda uma primeira conversa clara', body: 'A melhor primeira agenda para coaches é uma chamada de diagnóstico com promessa específica, duração definida e próximos passos claros.' },
      { heading: 'Reduza faltas', body: 'Lembretes no WhatsApp ajudam o cliente a lembrar do compromisso sem sua equipe precisar mandar mensagens manualmente.' },
      { heading: 'Separe gratuito e pago', body: 'Use eventos gratuitos para triagem e eventos pagos para sessões individuais, consultorias ou pacotes de acompanhamento.' },
    ],
  },
  {
    slug: 'agendamento-online-para-psicologos',
    title: 'Agendamento online para psicólogos',
    description: 'Crie uma página de agendamento simples para avaliação inicial, retorno ou orientação, com comunicação em português.',
    audience: 'psicólogos e clínicas pequenas',
    sections: [
      { heading: 'Clareza antes da consulta', body: 'A página deve informar duração, formato, preço quando aplicável e o que o paciente precisa saber antes do horário.' },
      { heading: 'Privacidade e confiança', body: 'Evite expor informações sensíveis no link. Colete apenas dados necessários para confirmar o atendimento.' },
      { heading: 'Rotina previsível', body: 'Janelas fixas de atendimento reduzem trocas de mensagens e ajudam a manter agenda profissional.' },
    ],
  },
  {
    slug: 'agendamento-online-para-nutricionistas',
    title: 'Agendamento online para nutricionistas',
    description: 'Organize avaliações, retornos e consultas nutricionais com link público, Pix e lembrete por WhatsApp.',
    audience: 'nutricionistas',
    sections: [
      { heading: 'Eventos por tipo de consulta', body: 'Separe avaliação inicial, retorno e acompanhamento. Cada tipo pode ter duração e preço próprios.' },
      { heading: 'Pagamento antes do horário', body: 'Cobrar por Pix antes da consulta reduz desistências de última hora e facilita previsibilidade de receita.' },
      { heading: 'Melhor experiência para o paciente', body: 'O paciente escolhe horário, informa contato e recebe confirmação sem esperar resposta manual.' },
    ],
  },
  {
    slug: 'aplicativo-agendamento-para-freelancers',
    title: 'Melhor aplicativo de agendamento para freelancers',
    description: 'Freelancers podem usar agendamento online para vender consultorias, calls de briefing e revisões sem bagunçar o WhatsApp.',
    audience: 'designers, devs, social media, consultores e prestadores de serviço',
    sections: [
      { heading: 'Transforme conversa em fluxo', body: 'Em vez de negociar horário por mensagem, envie um link com opções disponíveis e dados necessários para a reunião.' },
      { heading: 'Cobre pelo seu tempo', body: 'Calls de briefing, diagnóstico e revisão podem ser pagas quando seu tempo já tem demanda.' },
      { heading: 'Pareça maior sem complicar', body: 'Um link limpo, confirmação automática e política clara de horário aumentam confiança antes do primeiro contato.' },
    ],
  },
  {
    slug: 'pagamento-pix-no-agendamento',
    title: 'Como receber pagamento por Pix no agendamento',
    description: 'Entenda quando cobrar por Pix antes do atendimento e como isso reduz faltas em serviços profissionais.',
    audience: 'profissionais que querem cobrar antes da reserva',
    sections: [
      { heading: 'Quando cobrar antes', body: 'Cobrança antecipada faz sentido para avaliações, sessões, aulas, consultorias e horários com alta taxa de falta.' },
      { heading: 'Como explicar ao cliente', body: 'Mostre valor, duração e política de reagendamento antes do pagamento. Clareza evita suporte desnecessário.' },
      { heading: 'O papel do Pix', body: 'Pix é rápido, familiar no Brasil e reduz a fricção de pagar por um serviço pontual.' },
    ],
  },
  {
    slug: 'agendamento-online-com-whatsapp',
    title: 'Agendamento online com WhatsApp',
    description: 'Use WhatsApp como canal de lembrete e confirmação, sem depender de conversas manuais para cada horário.',
    audience: 'negócios que já atendem pelo WhatsApp',
    sections: [
      { heading: 'WhatsApp é canal de operação', body: 'No Brasil, WhatsApp é onde o cliente confirma, pergunta e lembra. O agendamento precisa funcionar junto desse hábito.' },
      { heading: 'O que automatizar', body: 'Automatize confirmação, lembrete e instruções antes da consulta. Deixe conversas humanas para exceções e vendas importantes.' },
      { heading: 'Como evitar ruído', body: 'Mensagens devem ser curtas, com data, horário, link e opção clara para reagendar quando necessário.' },
    ],
  },
]

export const seoSlugs = seoArticles.map((article) => article.slug)

export function getSeoArticle(slug: SeoSlug) {
  return seoArticles.find((article) => article.slug === slug) ?? seoArticles[0]
}

export function createSeoMetadata(slug: SeoSlug): Metadata {
  const article = getSeoArticle(slug)
  const base = getAppUrl().replace(/\/$/, '')
  return {
    title: `${article.title} - AgendaFácil`,
    description: article.description,
    alternates: { canonical: `${base}/${article.slug}` },
  }
}

export function SeoArticlePage({ slug }: { slug: SeoSlug }) {
  const article = getSeoArticle(slug)

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-black">AgendaFácil</Link>
          <Link href="/auth/signin" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Criar agenda
          </Link>
        </div>
      </nav>
      <article className="mx-auto max-w-4xl px-5 py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-10">
          <div className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">{article.audience}</div>
          <h1 className="mt-4 text-4xl font-black tracking-normal md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{article.description}</p>
          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-black">{section.heading}</h2>
                <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-10 rounded-lg bg-emerald-800 p-6 text-white">
            <h2 className="text-2xl font-black">Crie sua agenda em português</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50">Publique um link, configure horários e teste o fluxo do cliente hoje.</p>
            <Link href="/auth/signin" className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-black text-emerald-900 hover:bg-emerald-50">
              Começar grátis
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
