import type { MetadataRoute } from 'next'
import { seoSlugs } from '@/lib/seo-content'
import { getAppUrl } from '@/lib/app-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl().replace(/\/$/, '')
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/auth/signin`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...seoSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
