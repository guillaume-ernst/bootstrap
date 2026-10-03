import { test, expect } from '@playwright/test'

const openModal = async page => {
  await page.goto('/tests/e2e/fixtures/e2e-modal.html')
  await page.click('#trigger')
  await page.waitForFunction(() => document.getElementById('myModal').contains(document.activeElement))
}

test('modal restores focus on the trigger after close', async ({ page }) => {
  await openModal(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('#myModal.show')).toHaveCount(0)
  await expect(page.locator('#trigger')).toBeFocused()
})

test('modal moves focus inside while open', async ({ page }) => {
  await openModal(page)
  const focusInside = await page.evaluate(() =>
    document.getElementById('myModal').contains(document.activeElement))
  expect(focusInside).toBe(true)
})
