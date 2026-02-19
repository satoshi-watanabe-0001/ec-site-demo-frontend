/**
 * @fileoverview 請求情報ページのE2Eテスト
 * @module e2e/mypage-billing.spec
 *
 * EC-278: アカウント管理 - 請求情報テスト（シナリオ5）
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

class BillingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/billing')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isBackLinkVisible() {
    return this.page.locator('text=マイページに戻る').isVisible()
  }

  async isBillingAmountVisible() {
    return this.page.locator('text=（税込）').isVisible()
  }

  async isPaymentStatusVisible() {
    const paid = await this.page.locator('text=支払い済み').isVisible()
    const unpaid = await this.page.locator('text=未払い').isVisible()
    return paid || unpaid
  }

  async isPaymentInfoVisible() {
    return this.page.locator('text=お支払い情報').isVisible()
  }

  async isPaymentMethodVisible() {
    return this.page.locator('text=お支払い方法').isVisible()
  }

  async isCardNumberMasked() {
    return this.page.locator('text=**** **** ****').isVisible()
  }

  async isBillingHistoryVisible() {
    return this.page.locator('text=請求履歴').isVisible()
  }

  async isBillingItemVisible() {
    return this.page.locator('text=基本料金').isVisible()
  }

  async isSubtotalVisible() {
    return this.page.locator('text=小計').isVisible()
  }

  async isTaxVisible() {
    return this.page.locator('text=消費税').isVisible()
  }

  async isTotalVisible() {
    return this.page.locator('text=合計').isVisible()
  }

  async clickBackLink() {
    await this.page.locator('text=マイページに戻る').click()
  }
}

test.describe('請求情報ページ (EC-278)', () => {
  let loginPage: LoginPage
  let billingPage: BillingPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    billingPage = new BillingPage(page)
  })

  test.describe('シナリオ5: 請求情報表示', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('請求情報ページが正しく表示される', async () => {
      await billingPage.goto()
      const title = await billingPage.getPageTitle()
      expect(title).toBe('請求情報')
    })

    test('マイページに戻るリンクが表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isBackLinkVisible()
      expect(isVisible).toBe(true)
    })

    test('請求金額が税込で表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isBillingAmountVisible()
      expect(isVisible).toBe(true)
    })

    test('支払いステータスが表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isPaymentStatusVisible()
      expect(isVisible).toBe(true)
    })

    test('請求項目に基本料金が含まれる', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isBillingItemVisible()
      expect(isVisible).toBe(true)
    })

    test('小計が表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isSubtotalVisible()
      expect(isVisible).toBe(true)
    })

    test('消費税が表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isTaxVisible()
      expect(isVisible).toBe(true)
    })

    test('合計金額が表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isTotalVisible()
      expect(isVisible).toBe(true)
    })

    test('お支払い情報セクションが表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isPaymentInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('カード番号がマスクされて表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isCardNumberMasked()
      expect(isVisible).toBe(true)
    })

    test('請求履歴セクションが表示される', async () => {
      await billingPage.goto()
      const isVisible = await billingPage.isBillingHistoryVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ナビゲーション', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('マイページに戻るリンクをクリックするとダッシュボードに遷移する', async ({ page }) => {
      await billingPage.goto()
      await billingPage.clickBackLink()
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })
  })
})
