import { expect, test } from '@playwright/test'

test('landing page links to demo and demo form confirms', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Agendamento online')

  await page.getByRole('link', { name: /Ver demonstra/i }).click()
  await expect(page).toHaveURL(/\/demo$/)

  await page.getByRole('button', { name: /Confirmar demonstra/i }).click()
  await expect(page.getByText('Agendamento confirmado')).toBeVisible()
})
