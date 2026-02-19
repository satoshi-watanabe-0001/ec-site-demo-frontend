/**
 * @fileoverview レスポンシブデザインのE2Eテスト
 * @module e2e/mypage-responsive.spec
 *
 * EC-278: アカウント管理 - レスポンシブデザインテスト
 */

import { test, expect, type Page } from '@playwright/test'

class LoginPage {
  constructor(private page: Page) {}

  async login(email = 'test@docomo.ne.jp', password = 'password123') {
    await this.page.goto('/login')
    await this.page.locator('#email').fill(email)
    await this.page.locator('#password').fill(password)
    await this.page.locator('button[type="submit"]').click()
    await this.page.waitForURL('/mypage')
  }
}

test.describe('マイページ レスポンシブデザイン (EC-278)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test.describe('モバイル表示 (375x667)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test('ダッシュボードがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      const title = await page.locator('h1').textContent()
      expect(title).toBe('マイページ')

      const nav = await page.locator('nav[aria-label="マイページナビゲーション"]').isVisible()
      expect(nav).toBe(true)
    })

    test('契約情報ページがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/contract')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('契約情報')
    })

    test('請求情報ページがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/billing')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('請求情報')
    })

    test('アカウント設定ページがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/settings')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('アカウント設定')
    })

    test('プラン変更ページがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/plan')
      const title = await page.locator('h1').textContent()
      expect(title).toContain('プラン変更')
    })

    test('データ使用量ページがモバイルサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/data-usage')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('データ使用量')
    })
  })

  test.describe('タブレット表示 (768x1024)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
    })

    test('ダッシュボードがタブレットサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      const title = await page.locator('h1').textContent()
      expect(title).toBe('マイページ')
    })

    test('契約情報ページがタブレットサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/contract')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('契約情報')
    })

    test('請求情報ページがタブレットサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/billing')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('請求情報')
    })
  })

  test.describe('デスクトップ表示 (1280x720)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
    })

    test('ダッシュボードがデスクトップサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      const title = await page.locator('h1').textContent()
      expect(title).toBe('マイページ')

      const nav = await page.locator('nav[aria-label="マイページナビゲーション"]').isVisible()
      expect(nav).toBe(true)
    })

    test('契約情報ページがデスクトップサイズで正しく表示される', async ({ page }) => {
      await loginPage.login()
      await page.goto('/mypage/contract')
      const title = await page.locator('h1').textContent()
      expect(title).toBe('契約情報')
    })
  })
})
