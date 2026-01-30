/**
 * @fileoverview 契約情報ページのE2Eテスト
 * @module e2e/mypage/contract.spec
 *
 * EC-278: アカウント管理機能
 * シナリオ3: 契約情報詳細表示
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * 契約情報ページのPage Object
 */
class ContractPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /** 契約情報ページに移動 */
  async goto() {
    await this.page.goto('/mypage/contract')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 契約者情報セクションが表示されているか */
  async isContractorInfoVisible() {
    return this.page.locator('text=契約者情報').isVisible()
  }

  /** 契約詳細セクションが表示されているか */
  async isContractDetailsVisible() {
    return this.page.locator('h3:has-text("契約詳細")').isVisible()
  }

  /** デバイス情報セクションが表示されているか */
  async isDeviceInfoVisible() {
    return this.page.locator('text=ご利用端末').isVisible()
  }

  /** 契約番号が表示されているか */
  async isContractNumberVisible() {
    return this.page.locator('text=契約番号').isVisible()
  }

  /** 電話番号が表示されているか */
  async isPhoneNumberVisible() {
    return this.page.locator('text=電話番号').isVisible()
  }

  /** プラン情報が表示されているか */
  async isPlanInfoVisible() {
    return this.page.locator('text=プラン情報').isVisible()
  }

  /** SIM情報が表示されているか */
  async isSimInfoVisible() {
    return this.page.locator('text=SIM情報').isVisible()
  }

  /** 契約ステータスを取得 */
  async getContractStatus() {
    return this.page.locator('.rounded-full').first().textContent()
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

test.describe('契約情報ページ (EC-278)', () => {
  let contractPage: ContractPage

  test.beforeEach(async ({ page }) => {
    contractPage = new ContractPage(page)
    await loginAsTestUser(page)
    await contractPage.goto()
  })

  test.describe('ページ表示', () => {
    test('契約情報ページにアクセスするとページタイトルが表示される', async () => {
      // Assert
      const title = await contractPage.getPageTitle()
      expect(title).toBe('契約情報')
    })

    test('契約者情報セクションが表示される', async () => {
      // Assert
      const isVisible = await contractPage.isContractorInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('契約詳細セクションが表示される', async () => {
      // Assert
      const isVisible = await contractPage.isContractDetailsVisible()
      expect(isVisible).toBe(true)
    })

    test('デバイス情報セクションが表示される', async () => {
      // Assert
      const isVisible = await contractPage.isDeviceInfoVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('契約詳細情報', () => {
    test('契約番号が表示される', async () => {
      // Assert
      const isVisible = await contractPage.isContractNumberVisible()
      expect(isVisible).toBe(true)
    })

    test('電話番号が表示される', async () => {
      // Assert
      const isVisible = await contractPage.isPhoneNumberVisible()
      expect(isVisible).toBe(true)
    })

    test('プラン情報が表示される', async () => {
      // Assert
      const isVisible = await contractPage.isPlanInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('SIM情報が表示される', async () => {
      // Assert
      const isVisible = await contractPage.isSimInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('契約ステータスが表示される', async () => {
      // Assert
      const status = await contractPage.getContractStatus()
      expect(status).toBeTruthy()
    })
  })
})
