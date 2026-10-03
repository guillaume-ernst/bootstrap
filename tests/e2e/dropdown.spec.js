import { test, expect } from '@playwright/test'

test('ArrowDown opens the dropdown and focuses the first item', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/e2e-dropdown.html')
  await page.locator('#toggle').focus()
  await page.keyboard.press('ArrowDown')

  await expect(page.locator('#toggle')).toHaveClass(/show/)
  await expect(page.locator('#item1')).toBeFocused()
})

test('Escape closes the dropdown and refocuses the toggle', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/e2e-dropdown.html')
  await page.locator('#toggle').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('#item1')).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(page.locator('.dropdown-menu.show')).toHaveCount(0)
  await expect(page.locator('#toggle')).toBeFocused()
})
