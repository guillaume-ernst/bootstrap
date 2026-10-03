import { test, expect } from '@playwright/test'

test('modal opens, focus stays inside and escape closes', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/modal.html')
  await page.click('[data-toggle="modal"]')
  await expect(page.locator('#myModal.show')).toBeVisible()

  // Focus must be inside the modal (Bootstrap focuses the modal element itself
  // when the shown.bs.modal event fires, after the transition completes)
  const focusInside = await page.waitForFunction(() => {
    const modal = document.getElementById('myModal')
    return modal === document.activeElement || modal.contains(document.activeElement)
  }).then(() => true, () => false)
  expect(focusInside).toBe(true)

  await page.keyboard.press('Escape')
  await expect(page.locator('#myModal.show')).toHaveCount(0)
})

test('modal adjusts body padding when scrollbar is present', async ({ page }) => {
  await page.goto('/tests/e2e/fixtures/modal.html')

  const scrollbarWidth = await page.evaluate(() =>
    window.innerWidth - document.documentElement.clientWidth)

  await page.click('[data-toggle="modal"]')
  await expect(page.locator('#myModal.show')).toBeVisible()

  const paddingRight = await page.evaluate(() => document.body.style.paddingRight)
  const navbarPadding = await page.evaluate(() =>
    document.querySelector('.navbar-fixed-top').style.paddingRight)

  // With overlay scrollbars (macOS headless) the measured width is 0 and no
  // padding compensation is applied. Either way it must never be NaN.
  expect(paddingRight).not.toBe('NaNpx')
  expect(navbarPadding).not.toBe('NaNpx')
  if (scrollbarWidth > 0) {
    expect(paddingRight).not.toBe('')
  }

  await page.click('#myModal [data-dismiss="modal"]')
  await expect(page.locator('#myModal.show')).toHaveCount(0)
  const restored = await page.evaluate(() => document.body.style.paddingRight)
  expect(restored).toBe('')
})
