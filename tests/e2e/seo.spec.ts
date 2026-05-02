import { expect, test } from '@playwright/test'
import { seoArticles } from '../../src/lib/seo-content'

for (const article of seoArticles) {
  test(`${article.slug} returns 200 and renders canonical heading`, async ({ page }) => {
    const response = await page.goto(`/${article.slug}`)

    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: article.title })).toBeVisible()
  })
}
