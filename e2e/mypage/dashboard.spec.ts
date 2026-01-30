/**
 * @fileoverview マイページダッシュボードのE2Eテスト
 * @module e2e/mypage/dashboard.spec
 *
 * EC-278: アカウント管理機能
 * シナリオ1: ダッシュボード表示
 * シナリオ2: 契約情報サマリー表示
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * マイページダッシュボードのPage Object
 */
class MyPageDashboard {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /** ダッシュボードに移動 */
  async goto() {
    await this.page.goto('/mypage')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 契約情報サマリーが表示されているか */
  async isContractSummaryVisible() {
    return this.page.locator('text=契約情報').isVisible()
  }

  /** データ使用量カードが表示されているか */
  async isDataUsageCardVisible() {
    return this.page.locator('text=データ使用量').isVisible()
  }

  /** 請求サマリーが表示されているか */
  async isBillingSummaryVisible() {
    return this.page.locator('text=今月の請求').isVisible()
  }

  /** デバイス情報が表示されているか */
  async isDeviceInfoVisible() {
    return this.page.locator('text=ご利用端末').isVisible()
  }

  /** 通知パネルが表示されているか */
  async isNotificationPanelVisible() {
    return this.page.locator('text=お知らせ').isVisible()
  }

  /** サイドナビゲーションが表示されているか */
  async isSideNavigationVisible() {
    return this.page.locator('nav:has-text("マイページ")').isVisible()
  }

  /** 契約詳細リンクをクリック */
  async clickContractDetailsLink() {
    await this.page.locator('a:has-text("契約詳細を見る")').click()
  }

  /** データ使用量詳細リンクをクリック */
  async clickDataUsageDetailsLink() {
    await this.page.locator('a:has-text("詳細を見る")').first().click()
  }

  /** 請求詳細リンクをクリック */
  async clickBillingDetailsLink() {
    await this.page.locator('a:has-text("請求詳細を見る")').click()
  }

  /** ナビゲーションリンクをクリック */
  async clickNavLink(label: string) {
    await this.page.locator(`nav a:has-text("${label}")`).click()
  }

  /** プラン名を取得 */
  async getPlanName() {
    return this.page.locator('text=プラン').locator('..').locator('span.font-medium').textContent()
  }

  /** 電話番号を取得 */
  async getPhoneNumber() {
    return this.page.locator('text=電話番号').locator('..').locator('span.font-medium').textContent()
  }
}

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

test.describe('マイページダッシュボード (EC-278)', () => {
  let dashboard: MyPageDashboard

  test.beforeEach(async ({ page }) => {
    dashboard = new MyPageDashboard(page)
    await loginAsTestUser(page)
  })

  test.describe('ダッシュボード表示', () => {
    test('ダッシュボードページにアクセスするとページタイトルが表示される', async () => {
      // Assert
      const title = await dashboard.getPageTitle()
      expect(title).toBe('ダッシュボード')
    })

    test('サイドナビゲーションが表示される', async () => {
      // Assert
      const isVisible = await dashboard.isSideNavigationVisible()
      expect(isVisible).toBe(true)
    })

    test('契約情報サマリーが表示される', async () => {
      // Assert
      const isVisible = await dashboard.isContractSummaryVisible()
      expect(isVisible).toBe(true)
    })

    test('データ使用量カードが表示される', async () => {
      // Assert
      const isVisible = await dashboard.isDataUsageCardVisible()
      expect(isVisible).toBe(true)
    })

    test('請求サマリーが表示される', async () => {
      // Assert
      const isVisible = await dashboard.isBillingSummaryVisible()
      expect(isVisible).toBe(true)
    })

    test('デバイス情報が表示される', async () => {
      // Assert
      const isVisible = await dashboard.isDeviceInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('通知パネルが表示される', async () => {
      // Assert
      const isVisible = await dashboard.isNotificationPanelVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ナビゲーション', () => {
    test('契約詳細リンクから契約情報ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickContractDetailsLink()

      // Assert
      await page.waitForURL('/mypage/contract')
      expect(page.url()).toContain('/mypage/contract')
    })

    test('請求詳細リンクから請求ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickBillingDetailsLink()

      // Assert
      await page.waitForURL('/mypage/billing')
      expect(page.url()).toContain('/mypage/billing')
    })

    test('サイドナビゲーションから契約情報ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('契約情報')

      // Assert
      await page.waitForURL('/mypage/contract')
      expect(page.url()).toContain('/mypage/contract')
    })

    test('サイドナビゲーションからデータ使用量ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('データ使用量')

      // Assert
      await page.waitForURL('/mypage/data-usage')
      expect(page.url()).toContain('/mypage/data-usage')
    })

    test('サイドナビゲーションから請求・支払いページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('請求・支払い')

      // Assert
      await page.waitForURL('/mypage/billing')
      expect(page.url()).toContain('/mypage/billing')
    })

    test('サイドナビゲーションからプラン変更ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('プラン変更')

      // Assert
      await page.waitForURL('/mypage/plan-change')
      expect(page.url()).toContain('/mypage/plan-change')
    })

    test('サイドナビゲーションからオプションページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('オプション')

      // Assert
      await page.waitForURL('/mypage/options')
      expect(page.url()).toContain('/mypage/options')
    })

    test('サイドナビゲーションからアカウント設定ページに遷移できる', async ({ page }) => {
      // Act
      await dashboard.clickNavLink('アカウント設定')

      // Assert
      await page.waitForURL('/mypage/settings')
      expect(page.url()).toContain('/mypage/settings')
    })
  })
})

test.describe('未認証ユーザーのアクセス制御 (EC-278)', () => {
  test('未認証ユーザーがマイページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Act
    await page.goto('/mypage')

    // Assert
    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })
})
