import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'agendamento-online-com-whatsapp'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
