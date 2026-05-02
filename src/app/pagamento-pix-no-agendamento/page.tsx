import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'pagamento-pix-no-agendamento'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
