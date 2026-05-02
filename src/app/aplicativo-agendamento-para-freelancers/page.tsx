import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'aplicativo-agendamento-para-freelancers'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
