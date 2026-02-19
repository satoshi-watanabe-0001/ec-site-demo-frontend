/**
 * @fileoverview 契約情報ページのE2Eテスト
 * @module e2e/mypage-contract.spec
 *
 * EC-278: アカウント管理 - 契約情報テスト（シナリオ3）
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

class ContractPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/contract')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isBackLinkVisible() {
    return this.page.locator('text=マイページに戻る').isVisible()
  }

  async isContractOverviewVisible() {
    return this.page.locator('text=契約概要').isVisible()
  }

  async isPlanInfoVisible() {
    return this.page.locator('text=プラン情報').isVisible()
  }

  async isLineInfoVisible() {
    return this.page.locator('text=回線情報').isVisible()
  }

  async isDeviceInfoVisible() {
    return this.page.locator('text=端末情報').isVisible()
  }

  async isOptionServicesVisible() {
    return this.page.locator('text=オプションサービス').isVisible()
  }

  async isContractNumberVisible() {
    return this.page.locator('text=契約番号').isVisible()
  }

  async isPlanChangeButtonVisible() {
    return this.page.locator('text=プランを変更する').isVisible()
  }

  async clickPlanChangeButton() {
    await this.page.locator('text=プランを変更する').click()
  }

  async clickBackLink() {
    await this.page.locator('text=マイページに戻る').click()
  }
}

test.describe('契約情報ページ (EC-278)', () => {
  let loginPage: LoginPage
  let contractPage: ContractPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    contractPage = new ContractPage(page)
  })

  test.describe('シナリオ3: 契約情報表示', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('契約情報ページが正しく表示される', async () => {
      await contractPage.goto()
      const title = await contractPage.getPageTitle()
      expect(title).toBe('契約情報')
    })

    test('マイページに戻るリンクが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isBackLinkVisible()
      expect(isVisible).toBe(true)
    })

    test('契約概要セクションが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isContractOverviewVisible()
      expect(isVisible).toBe(true)
    })

    test('契約番号が表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isContractNumberVisible()
      expect(isVisible).toBe(true)
    })

    test('プラン情報セクションが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isPlanInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('回線情報セクションが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isLineInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('端末情報セクションが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isDeviceInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('オプションサービスセクションが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isOptionServicesVisible()
      expect(isVisible).toBe(true)
    })

    test('プラン変更ボタンが表示される', async () => {
      await contractPage.goto()
      const isVisible = await contractPage.isPlanChangeButtonVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ナビゲーション', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('プラン変更ボタンをクリックするとプラン変更ページに遷移する', async ({ page }) => {
      await contractPage.goto()
      await contractPage.clickPlanChangeButton()
      await page.waitForURL('/mypage/plan')
      expect(page.url()).toContain('/mypage/plan')
    })

    test('マイページに戻るリンクをクリックするとダッシュボードに遷移する', async ({ page }) => {
      await contractPage.goto()
      await contractPage.clickBackLink()
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })
  })
})
