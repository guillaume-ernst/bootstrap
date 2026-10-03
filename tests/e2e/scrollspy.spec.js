import { test, expect } from '@playwright/test'

test('scrollspy activates the nav link matching the visible section', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/e2e-scrollspy.html')

  const link = page.locator('#navbar a[href="#section2"]')
  await page.locator('#scrollable').evaluate(element => {
    element.scrollTop = element.scrollHeight
  })

  await expect(link).toHaveClass(/active/)
})
