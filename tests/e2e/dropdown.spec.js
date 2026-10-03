import { test, expect } from '@playwright/test'

test('dropdown opens on click and closes on outside click', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/dropdown.html')
  await page.click('#dropdownMenuButton')
  await expect(page.locator('#dropdownMenuButton + .dropdown-menu.show')).toBeVisible()

  const box = await page.locator('#dropdownMenuButton + .dropdown-menu').boundingBox()
  expect(box).not.toBeNull()
  expect(box.y).toBeGreaterThan(0)

  await page.click('body', { position: { x: 5, y: 5 } })
  await expect(page.locator('.dropdown-menu.show')).toHaveCount(0)
})

test('dropdown applies data-offset option', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/dropdown.html')
  await page.click('#dropdownOffset')
  const menu = page.locator('[aria-labelledby="dropdownOffset"]')
  await expect(menu).toBeVisible()

  const transform = await menu.evaluate(el => getComputedStyle(el).transform)
  expect(transform).toContain('matrix')
})

test('dropdown flips inside scrollable container', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/dropdown.html')
  const scrollable = page.locator('.scrollable')
  await scrollable.evaluate(el => {
    el.scrollTop = el.scrollHeight
  })
  await page.click('#dropdownFlip')
  const menu = page.locator('[aria-labelledby="dropdownFlip"]')
  await expect(menu).toBeVisible()
  const placement = await menu.getAttribute('x-placement') ?? await menu.getAttribute('data-popper-placement')
  expect(placement).toBeTruthy()
})
