import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'agendamento-online-para-psicologos'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
