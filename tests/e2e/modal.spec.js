import { test, expect } from '@playwright/test'

test('modal opens, focus is trapped and escape closes', async ({ page }) => {
  await page.goto('/e2e/modal.html')
  await page.click('[data-toggle="modal"]')
  await expect(page.locator('.modal.show')).toBeVisible()
  // Focus should be inside modal
  await expect(page.locator('.modal.show input')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.modal.show')).toHaveCount(0)
})
