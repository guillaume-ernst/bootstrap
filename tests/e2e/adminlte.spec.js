import { existsSync } from 'node:fs'
import { test, expect } from '@playwright/test'

const fixtureInstalled = existsSync('tests/adminlte/node_modules/admin-lte/dist/js/adminlte.js')

test.describe('AdminLTE 3 on the bootstrap fork', () => {
  test.skip(!fixtureInstalled, 'AdminLTE fixture not installed (npm --prefix tests/adminlte ci --ignore-scripts --legacy-peer-deps)')
  let pageErrors

  test.beforeEach(async ({ page }) => {
    pageErrors = []
    page.on('pageerror', error => pageErrors.push(String(error)))
    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(msg.text())
      }
    })
    await page.goto('/tests/e2e/fixtures/adminlte.html')
  })

  test.afterEach(() => {
    expect(pageErrors).toEqual([])
  })

  test('adminlte.js registers its jQuery plugins under jQuery 4', async ({ page }) => {
    const plugins = await page.evaluate(() => ({
      pushMenu: typeof globalThis.$.fn.PushMenu === 'function',
      cardWidget: typeof globalThis.$.fn.CardWidget === 'function',
      treeview: typeof globalThis.$.fn.Treeview === 'function',
      layout: typeof globalThis.$.fn.Layout === 'function',
      jquery: globalThis.$.fn.jquery
    }))
    expect(plugins.pushMenu).toBe(true)
    expect(plugins.cardWidget).toBe(true)
    expect(plugins.treeview).toBe(true)
    expect(plugins.layout).toBe(true)
    expect(plugins.jquery.startsWith('4.')).toBe(true)
  })

  test('PushMenu toggles the sidebar', async ({ page }) => {
    await page.click('[data-widget="pushmenu"]')
    await expect(page.locator('body')).toHaveClass(/sidebar-collapse/)
    await page.click('[data-widget="pushmenu"]')
    await expect(page.locator('body')).not.toHaveClass(/sidebar-collapse/)
  })

  test('CardWidget collapses and expands a card', async ({ page }) => {
    const card = page.locator('#card1')
    await page.click('[data-card-widget="collapse"]')
    await expect(card).toHaveClass(/collapsed-card/)
    await page.click('[data-card-widget="collapse"]')
    await expect(card).not.toHaveClass(/collapsed-card/)
  })

  test('Treeview opens the nested menu', async ({ page }) => {
    const treeMenu = page.locator('.nav-treeview')
    await expect(treeMenu).toBeHidden()
    await page.locator('.nav-sidebar > .nav-item > .nav-link').click()
    await expect(treeMenu).toBeVisible()
    await expect(page.locator('.nav-sidebar > .nav-item')).toHaveClass(/menu-open|menu-is-opening/)
  })
})
