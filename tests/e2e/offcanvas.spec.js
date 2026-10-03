import { test, expect } from '@playwright/test'

test('offcanvas restores focus on the trigger after close', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/e2e-offcanvas.html')
  await page.click('#trigger')
  await expect(page.locator('#myOffcanvas.show')).toBeVisible()

  await page.click('#myOffcanvas .btn-close')
  await expect(page.locator('#myOffcanvas.show')).toHaveCount(0)
  await expect(page.locator('#trigger')).toBeFocused()
})
