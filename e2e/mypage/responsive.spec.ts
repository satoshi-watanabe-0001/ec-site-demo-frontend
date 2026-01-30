/**
 * @fileoverview マイページのレスポンシブデザインE2Eテスト
 * @module e2e/mypage/responsive.spec
 *
 * EC-278: アカウント管理機能
 * シナリオ11: レスポンシブデザイン対応
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * ログインヘルパー
 */
async function loginAsTestUser(page: Page) {
  await page.goto('/login')
  await page.locator('#email').fill('test@docomo.ne.jp')
  await page.locator('#password').fill('password123')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('/mypage')
}

/**
 * ビューポートサイズ定義
 */
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
}

test.describe('マイページレスポンシブデザイン (EC-278)', () => {
  test.describe('モバイル表示', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile)
    })

    test('モバイルサイズでダッシュボードが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('ダッシュボード')
    })

    test('モバイルサイズでナビゲーションが表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const navVisible = await page.locator('nav').isVisible()
      expect(navVisible).toBe(true)
    })

    test('モバイルサイズで契約情報ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/contract')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('契約情報')
    })

    test('モバイルサイズで請求・支払いページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/billing')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('請求・支払い')
    })

    test('モバイルサイズでアカウント設定ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/settings')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('アカウント設定')
    })

    test('モバイルサイズでデータ使用量ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/data-usage')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('データ使用量')
    })

    test('モバイルサイズでプラン変更ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/plan-change')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('プラン変更')
    })

    test('モバイルサイズでオプションページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/options')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('オプション管理')
    })
  })

  test.describe('タブレット表示', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet)
    })

    test('タブレットサイズでダッシュボードが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('ダッシュボード')
    })

    test('タブレットサイズでナビゲーションが表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const navVisible = await page.locator('nav').isVisible()
      expect(navVisible).toBe(true)
    })

    test('タブレットサイズで契約情報ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/contract')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('契約情報')
    })

    test('タブレットサイズで請求・支払いページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/billing')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('請求・支払い')
    })

    test('タブレットサイズでアカウント設定ページが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)
      await page.goto('/mypage/settings')

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('アカウント設定')
    })
  })

  test.describe('デスクトップ表示', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop)
    })

    test('デスクトップサイズでダッシュボードが正しく表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const title = await page.locator('h1').textContent()
      expect(title).toBe('ダッシュボード')
    })

    test('デスクトップサイズでサイドナビゲーションが表示される', async ({ page }) => {
      // Arrange
      await loginAsTestUser(page)

      // Assert
      const navVisible = await page.locator('nav').isVisible()
      expect(navVisible).toBe(true)
    })
  })
})
