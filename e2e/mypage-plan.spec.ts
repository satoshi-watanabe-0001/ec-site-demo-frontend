/**
 * @fileoverview プラン変更ページのE2Eテスト
 * @module e2e/mypage-plan.spec
 *
 * EC-278: アカウント管理 - プラン変更テスト（シナリオ7-8）
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

class PlanPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/plan')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isBackLinkVisible() {
    return this.page.locator('text=マイページに戻る').isVisible()
  }

  async isPlanSectionVisible() {
    return this.page.locator('text=料金プラン').isVisible()
  }

  async isOptionSectionVisible() {
    return this.page.locator('text=オプションサービス').isVisible()
  }

  async isCurrentPlanBadgeVisible() {
    return this.page.locator('text=現在のプラン').isVisible()
  }

  async getPlanCards() {
    return this.page.locator('text=このプランに変更する').count()
  }

  async getSubscribedOptions() {
    return this.page.locator('text=契約中').count()
  }

  async getUnsubscribedOptions() {
    return this.page.locator('text=申し込む').count()
  }

  async clickPlanChangeButton() {
    await this.page.locator('text=このプランに変更する').first().click()
  }

  async clickSubscribeOption() {
    await this.page.locator('text=申し込む').first().click()
  }

  async isSuccessMessageVisible() {
    return this.page.locator('.text-green-400').isVisible()
  }

  async clickBackLink() {
    await this.page.locator('text=マイページに戻る').click()
  }
}

test.describe('プラン変更ページ (EC-278)', () => {
  let loginPage: LoginPage
  let planPage: PlanPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    planPage = new PlanPage(page)
  })

  test.describe('シナリオ7: プラン表示', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('プラン変更ページが正しく表示される', async () => {
      await planPage.goto()
      const title = await planPage.getPageTitle()
      expect(title).toContain('プラン変更')
    })

    test('マイページに戻るリンクが表示される', async () => {
      await planPage.goto()
      const isVisible = await planPage.isBackLinkVisible()
      expect(isVisible).toBe(true)
    })

    test('料金プランセクションが表示される', async () => {
      await planPage.goto()
      const isVisible = await planPage.isPlanSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('現在のプランバッジが表示される', async () => {
      await planPage.goto()
      const isVisible = await planPage.isCurrentPlanBadgeVisible()
      expect(isVisible).toBe(true)
    })

    test('オプションサービスセクションが表示される', async () => {
      await planPage.goto()
      const isVisible = await planPage.isOptionSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('プラン変更ボタンが表示される', async () => {
      await planPage.goto()
      const count = await planPage.getPlanCards()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('シナリオ8: プラン変更操作', () => {
    test.beforeEach(async () => {
      await loginPage.login()
      await planPage.goto()
    })

    test('プラン変更ボタンをクリックすると成功メッセージが表示される', async () => {
      await planPage.clickPlanChangeButton()
      const isVisible = await planPage.isSuccessMessageVisible()
      expect(isVisible).toBe(true)
    })

    test('オプション申し込みボタンをクリックすると成功メッセージが表示される', async () => {
      const count = await planPage.getUnsubscribedOptions()
      if (count > 0) {
        await planPage.clickSubscribeOption()
        const isVisible = await planPage.isSuccessMessageVisible()
        expect(isVisible).toBe(true)
      }
    })
  })

  test.describe('ナビゲーション', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('マイページに戻るリンクをクリックするとダッシュボードに遷移する', async ({ page }) => {
      await planPage.goto()
      await planPage.clickBackLink()
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })
  })
})
