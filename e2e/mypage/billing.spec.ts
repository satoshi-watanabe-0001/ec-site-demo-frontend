/**
 * @fileoverview 請求・支払いページのE2Eテスト
 * @module e2e/mypage/billing.spec
 *
 * EC-278: アカウント管理機能
 * シナリオ5: 請求情報確認・支払い方法管理
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * 請求・支払いページのPage Object
 */
class BillingPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /** 請求・支払いページに移動 */
  async goto() {
    await this.page.goto('/mypage/billing')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 今月の請求セクションが表示されているか */
  async isCurrentBillingVisible() {
    return this.page.locator('text=今月の請求').isVisible()
  }

  /** 支払い方法セクションが表示されているか */
  async isPaymentMethodVisible() {
    return this.page.locator('text=お支払い方法').isVisible()
  }

  /** 請求履歴セクションが表示されているか */
  async isBillingHistoryVisible() {
    return this.page.locator('text=請求履歴').isVisible()
  }

  /** 請求金額が表示されているか */
  async isBillingAmountVisible() {
    return this.page.locator('text=¥').first().isVisible()
  }

  /** 支払い期限が表示されているか */
  async isDueDateVisible() {
    return this.page.locator('text=支払い期限').isVisible()
  }

  /** 支払い方法変更ボタンが表示されているか */
  async isPaymentMethodEditButtonVisible() {
    return this.page.locator('button:has-text("変更")').isVisible()
  }

  /** 請求ステータスを取得 */
  async getBillingStatus() {
    return this.page.locator('.text-blue-400, .text-green-400, .text-red-400').first().textContent()
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

test.describe('請求・支払いページ (EC-278)', () => {
  let billingPage: BillingPage

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page)
    await loginAsTestUser(page)
    await billingPage.goto()
  })

  test.describe('ページ表示', () => {
    test('請求・支払いページにアクセスするとページタイトルが表示される', async () => {
      // Assert
      const title = await billingPage.getPageTitle()
      expect(title).toBe('請求・支払い')
    })

    test('今月の請求セクションが表示される', async () => {
      // Assert
      const isVisible = await billingPage.isCurrentBillingVisible()
      expect(isVisible).toBe(true)
    })

    test('支払い方法セクションが表示される', async () => {
      // Assert
      const isVisible = await billingPage.isPaymentMethodVisible()
      expect(isVisible).toBe(true)
    })

    test('請求履歴セクションが表示される', async () => {
      // Assert
      const isVisible = await billingPage.isBillingHistoryVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('請求情報', () => {
    test('請求金額が表示される', async () => {
      // Assert
      const isVisible = await billingPage.isBillingAmountVisible()
      expect(isVisible).toBe(true)
    })

    test('支払い期限が表示される', async () => {
      // Assert
      const isVisible = await billingPage.isDueDateVisible()
      expect(isVisible).toBe(true)
    })

    test('請求ステータスが表示される', async () => {
      // Assert
      const status = await billingPage.getBillingStatus()
      expect(status).toBeTruthy()
    })
  })

  test.describe('支払い方法', () => {
    test('支払い方法変更ボタンが表示される', async () => {
      // Assert
      const isVisible = await billingPage.isPaymentMethodEditButtonVisible()
      expect(isVisible).toBe(true)
    })
  })
})
