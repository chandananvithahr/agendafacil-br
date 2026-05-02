import { createSeoMetadata, SeoArticlePage } from '@/lib/seo-content'

const slug = 'alternativa-calendly-portugues'
export const metadata = createSeoMetadata(slug)

export default function Page() {
  return <SeoArticlePage slug={slug} />
}
