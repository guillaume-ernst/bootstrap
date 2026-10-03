import { test, expect } from '@playwright/test'

test('tooltip shows on hover and hides on leave', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/tooltip.html')
  await page.hover('#tooltipTop')
  const tip = page.locator('.tooltip.show')
  await expect(tip).toBeVisible()
  await expect(tip).toHaveText('Tooltip on top')

  const placement = await tip.getAttribute('x-placement') ?? await tip.getAttribute('data-popper-placement')
  expect(placement).toBeTruthy()

  await page.mouse.move(10, 10)
  await expect(page.locator('.tooltip.show')).toHaveCount(0)
})

test('popover toggles on click', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/tooltip.html')
  await page.click('#popoverBtn')
  const popover = page.locator('.popover.show')
  await expect(popover).toBeVisible()
  await expect(popover.locator('.popover-header')).toHaveText('Popover title')
  await expect(popover.locator('.popover-body')).toContainText('amazing content')

  await page.click('#popoverBtn')
  await expect(page.locator('.popover.show')).toHaveCount(0)
})
