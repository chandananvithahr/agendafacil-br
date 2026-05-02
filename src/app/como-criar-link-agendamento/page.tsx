import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'como-criar-link-agendamento'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
