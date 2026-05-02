import type { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/app-config'

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl().replace(/\/$/, '')

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/'] }],
    sitemap: `${base}/sitemap.xml`,
  }
}
