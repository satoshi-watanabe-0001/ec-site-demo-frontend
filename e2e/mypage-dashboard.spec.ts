/**
 * @fileoverview マイページダッシュボードのE2Eテスト
 * @module e2e/mypage-dashboard.spec
 *
 * EC-278: アカウント管理 - ダッシュボード表示テスト（シナリオ1-2）
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
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

class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async getGreeting() {
    return this.page.locator('text=さん、こんにちは').textContent()
  }

  async isNavigationVisible() {
    return this.page.locator('nav[aria-label="マイページナビゲーション"]').isVisible()
  }

  async getNavigationLinks() {
    return this.page.locator('nav[aria-label="マイページナビゲーション"] a').allTextContents()
  }

  async isPlanSummaryVisible() {
    return this.page.locator('text=現在のプラン').isVisible()
  }

  async isDataUsageWidgetVisible() {
    return this.page.locator('text=データ使用量').isVisible()
  }

  async isBillingWidgetVisible() {
    return this.page.locator('text=今月の請求').isVisible()
  }

  async isDeviceInfoVisible() {
    return this.page.locator('text=端末情報').isVisible()
  }

  async isNotificationsVisible() {
    return this.page.locator('text=お知らせ').isVisible()
  }

  async clickNavLink(label: string) {
    await this.page.locator(`nav[aria-label="マイページナビゲーション"] a:has-text("${label}")`).click()
  }
}

test.describe('マイページダッシュボード (EC-278)', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
  })

  test.describe('シナリオ1: 認証チェック', () => {
    test('未認証でマイページにアクセスするとログインページにリダイレクトされる', async ({ page }) => {
      await dashboardPage.goto()
      await page.waitForURL(/\/login/)
      expect(page.url()).toContain('/login')
    })

    test('認証済みでマイページにアクセスするとダッシュボードが表示される', async () => {
      await loginPage.login()
      const title = await dashboardPage.getPageTitle()
      expect(title).toBe('マイページ')
    })
  })

  test.describe('シナリオ2: ダッシュボード表示', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('ページタイトルと挨拶メッセージが表示される', async () => {
      const title = await dashboardPage.getPageTitle()
      expect(title).toBe('マイページ')

      const greeting = await dashboardPage.getGreeting()
      expect(greeting).toContain('さん、こんにちは')
    })

    test('ナビゲーションタブが表示される', async () => {
      const isVisible = await dashboardPage.isNavigationVisible()
      expect(isVisible).toBe(true)

      const links = await dashboardPage.getNavigationLinks()
      expect(links).toContain('ダッシュボード')
      expect(links).toContain('契約情報')
      expect(links).toContain('データ使用量')
      expect(links).toContain('請求情報')
      expect(links).toContain('アカウント設定')
      expect(links).toContain('プラン変更')
    })

    test('プラン概要ウィジェットが表示される', async () => {
      const isVisible = await dashboardPage.isPlanSummaryVisible()
      expect(isVisible).toBe(true)
    })

    test('データ使用量ウィジェットが表示される', async () => {
      const isVisible = await dashboardPage.isDataUsageWidgetVisible()
      expect(isVisible).toBe(true)
    })

    test('請求概要ウィジェットが表示される', async () => {
      const isVisible = await dashboardPage.isBillingWidgetVisible()
      expect(isVisible).toBe(true)
    })

    test('端末情報ウィジェットが表示される', async () => {
      const isVisible = await dashboardPage.isDeviceInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('お知らせウィジェットが表示される', async () => {
      const isVisible = await dashboardPage.isNotificationsVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ナビゲーション遷移', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('契約情報タブをクリックすると契約情報ページに遷移する', async ({ page }) => {
      await dashboardPage.clickNavLink('契約情報')
      await page.waitForURL('/mypage/contract')
      expect(page.url()).toContain('/mypage/contract')
    })

    test('データ使用量タブをクリックするとデータ使用量ページに遷移する', async ({ page }) => {
      await dashboardPage.clickNavLink('データ使用量')
      await page.waitForURL('/mypage/data-usage')
      expect(page.url()).toContain('/mypage/data-usage')
    })

    test('請求情報タブをクリックすると請求情報ページに遷移する', async ({ page }) => {
      await dashboardPage.clickNavLink('請求情報')
      await page.waitForURL('/mypage/billing')
      expect(page.url()).toContain('/mypage/billing')
    })

    test('アカウント設定タブをクリックするとアカウント設定ページに遷移する', async ({ page }) => {
      await dashboardPage.clickNavLink('アカウント設定')
      await page.waitForURL('/mypage/settings')
      expect(page.url()).toContain('/mypage/settings')
    })

    test('プラン変更タブをクリックするとプラン変更ページに遷移する', async ({ page }) => {
      await dashboardPage.clickNavLink('プラン変更')
      await page.waitForURL('/mypage/plan')
      expect(page.url()).toContain('/mypage/plan')
    })
  })
})
