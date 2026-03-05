/**
 * @fileoverview マイページのE2Eテスト
 * @module e2e/mypage.spec
 *
 * EC-278: ahamoマイページ機能
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * ログインページのPage Object（ログインフロー用）
 */
class LoginPage {
  constructor(private page: Page) {}

  /** ログインページに移動 */
  async goto() {
    await this.page.goto('/login')
  }

  /** メールアドレスを入力 */
  async fillEmail(email: string) {
    await this.page.locator('#email').fill(email)
  }

  /** パスワードを入力 */
  async fillPassword(password: string) {
    await this.page.locator('#password').fill(password)
  }

  /** ログインボタンをクリック */
  async clickLoginButton() {
    await this.page.locator('button[type="submit"]').click()
  }

  /** ログインしてマイページに遷移 */
  async loginAndNavigateToMypage() {
    await this.goto()
    await this.fillEmail('test@docomo.ne.jp')
    await this.fillPassword('password123')
    await this.clickLoginButton()
    await this.page.waitForURL('/mypage')
  }
}

/**
 * マイページのPage Object
 */
class MypagePage {
  constructor(private page: Page) {}

  /** マイページに直接アクセス */
  async goto() {
    await this.page.goto('/mypage')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** ダッシュボードサマリーが表示されているか */
  async isDashboardSummaryVisible() {
    return this.page.locator('text=ようこそ').isVisible()
  }

  /** データ使用量バーが表示されているか */
  async isDataUsageBarVisible() {
    return this.page.locator('[role="progressbar"]').isVisible()
  }

  /** サイドバーナビゲーションが表示されているか */
  async isSidebarVisible() {
    return this.page.locator('nav').first().isVisible()
  }

  /** サイドバーのリンク数を取得 */
  async getSidebarLinkCount() {
    return this.page.locator('nav a').count()
  }

  /** 指定したパスのナビゲーションリンクをクリック */
  async clickNavLink(href: string) {
    await this.page.locator(`nav a[href="${href}"]`).click()
  }

  /** ローディング状態が表示されているか */
  async isLoadingVisible() {
    return this.page
      .locator('.animate-pulse')
      .first()
      .isVisible({ timeout: 1000 })
      .catch(() => false)
  }

  /** モバイルメニューボタンをクリック */
  async clickMobileMenuButton() {
    await this.page
      .locator('button:has-text("メニュー"), button[aria-label*="メニュー"]')
      .first()
      .click()
  }

  /** クイックアクションが表示されているか */
  async isQuickActionsVisible() {
    return this.page.locator('text=クイックアクション').isVisible()
  }
}

/**
 * 契約情報ページのPage Object
 */
class ContractPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/contract')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 契約IDが表示されているか */
  async isContractIdVisible() {
    return this.page.locator('text=契約ID').isVisible()
  }
}

/**
 * データ使用量ページのPage Object
 */
class DataUsagePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/data-usage')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** データ使用量バーが表示されているか */
  async isUsageBarVisible() {
    return this.page.locator('[role="progressbar"]').isVisible()
  }
}

/**
 * 請求情報ページのPage Object
 */
class BillingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/billing')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }
}

/**
 * 設定ページのPage Object
 */
class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/settings')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** プロフィールセクションが表示されているか */
  async isProfileSectionVisible() {
    return this.page.locator('text=プロフィール').isVisible()
  }

  /** パスワード変更セクションが表示されているか */
  async isPasswordSectionVisible() {
    return this.page.locator('text=パスワード変更').isVisible()
  }

  /** 通知設定セクションが表示されているか */
  async isNotificationSectionVisible() {
    return this.page.locator('text=通知設定').isVisible()
  }
}

/**
 * プラン変更ページのPage Object
 */
class PlanChangePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/plan-change')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** プランカードの数を取得 */
  async getPlanCardCount() {
    return this.page.locator('[class*="rounded-lg"][class*="border-2"]').count()
  }
}

/**
 * オプション管理ページのPage Object
 */
class OptionsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/options')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 契約中オプションセクションが表示されているか */
  async isSubscribedSectionVisible() {
    return this.page.locator('text=契約中のオプション').isVisible()
  }

  /** 利用可能オプションセクションが表示されているか */
  async isAvailableSectionVisible() {
    return this.page.locator('text=利用可能なオプション').isVisible()
  }
}

// ===== テストスイート =====

test.describe('マイページ アクセス制御 (EC-278)', () => {
  test('未ログイン状態でマイページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/mypage')

    // Assert
    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })

  test('未ログイン状態で契約情報ページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/mypage/contract')

    // Assert
    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })
})

test.describe('マイページ ダッシュボード (EC-278)', () => {
  let loginPage: LoginPage
  let mypagePage: MypagePage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    mypagePage = new MypagePage(page)
    // ログインしてマイページに遷移
    await loginPage.loginAndNavigateToMypage()
  })

  test('ダッシュボードページが正しく表示される', async () => {
    // Assert
    const title = await mypagePage.getPageTitle()
    expect(title).toBe('マイページ')
  })

  test('ダッシュボードサマリーが表示される', async ({ page }) => {
    // Assert - ダッシュボードの主要要素を確認
    await expect(page.locator('text=ようこそ')).toBeVisible({ timeout: 10000 })
    const isVisible = await mypagePage.isDashboardSummaryVisible()
    expect(isVisible).toBe(true)
  })

  test('データ使用量バーが表示される', async ({ page }) => {
    // Assert
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 10000 })
    const isVisible = await mypagePage.isDataUsageBarVisible()
    expect(isVisible).toBe(true)
  })

  test('サイドバーナビゲーションが表示される', async () => {
    // Assert
    const isVisible = await mypagePage.isSidebarVisible()
    expect(isVisible).toBe(true)
  })

  test('クイックアクションセクションが表示される', async ({ page }) => {
    // Assert
    await expect(page.locator('text=クイックアクション')).toBeVisible({ timeout: 10000 })
    const isVisible = await mypagePage.isQuickActionsVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ サブページ遷移 (EC-278)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()
  })

  test('契約情報ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/contract')

    // Assert
    await page.waitForURL('/mypage/contract')
    const contractPage = new ContractPage(page)
    const title = await contractPage.getPageTitle()
    expect(title).toBe('契約情報')
  })

  test('データ使用量ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/data-usage')

    // Assert
    await page.waitForURL('/mypage/data-usage')
    const dataUsagePage = new DataUsagePage(page)
    const title = await dataUsagePage.getPageTitle()
    expect(title).toBe('データ使用量')
  })

  test('請求情報ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/billing')

    // Assert
    await page.waitForURL('/mypage/billing')
    const billingPage = new BillingPage(page)
    const title = await billingPage.getPageTitle()
    expect(title).toBe('請求・お支払い')
  })

  test('設定ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/settings')

    // Assert
    await page.waitForURL('/mypage/settings')
    const settingsPage = new SettingsPage(page)
    const title = await settingsPage.getPageTitle()
    expect(title).toBe('アカウント設定')
  })

  test('プラン変更ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/plan-change')

    // Assert
    await page.waitForURL('/mypage/plan-change')
    const planChangePage = new PlanChangePage(page)
    const title = await planChangePage.getPageTitle()
    expect(title).toBe('プラン変更')
  })

  test('オプション管理ページに遷移できる', async ({ page }) => {
    // Arrange
    const mypagePage = new MypagePage(page)

    // Act
    await mypagePage.clickNavLink('/mypage/options')

    // Assert
    await page.waitForURL('/mypage/options')
    const optionsPage = new OptionsPage(page)
    const title = await optionsPage.getPageTitle()
    expect(title).toBe('オプション管理')
  })
})

test.describe('マイページ 設定フォーム (EC-278)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()
  })

  test('設定ページにプロフィール・パスワード・通知の3セクションが表示される', async ({ page }) => {
    // Arrange
    const settingsPage = new SettingsPage(page)

    // Act
    await page.goto('/mypage/settings')
    await page.waitForLoadState('networkidle')

    // Assert
    const hasProfile = await settingsPage.isProfileSectionVisible()
    const hasPassword = await settingsPage.isPasswordSectionVisible()
    const hasNotification = await settingsPage.isNotificationSectionVisible()
    expect(hasProfile).toBe(true)
    expect(hasPassword).toBe(true)
    expect(hasNotification).toBe(true)
  })
})

test.describe('マイページ プラン変更 (EC-278)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()
  })

  test('プラン変更ページにプランカードが表示される', async ({ page }) => {
    // Arrange
    const planChangePage = new PlanChangePage(page)

    // Act
    await page.goto('/mypage/plan-change')
    await page.waitForLoadState('networkidle')

    // Assert
    const count = await planChangePage.getPlanCardCount()
    expect(count).toBeGreaterThanOrEqual(2)
  })
})

test.describe('マイページ オプション管理 (EC-278)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()
  })

  test('オプション管理ページに契約中・利用可能セクションが表示される', async ({ page }) => {
    // Arrange
    const optionsPage = new OptionsPage(page)

    // Act
    await page.goto('/mypage/options')
    await page.waitForLoadState('networkidle')

    // Assert
    const hasSubscribed = await optionsPage.isSubscribedSectionVisible()
    const hasAvailable = await optionsPage.isAvailableSectionVisible()
    expect(hasSubscribed).toBe(true)
    expect(hasAvailable).toBe(true)
  })
})

test.describe('マイページ レスポンシブデザイン (EC-278)', () => {
  let loginPage: LoginPage

  test('モバイルサイズ（375px）でマイページが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 })
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()

    // Assert
    const mypagePage = new MypagePage(page)
    const title = await mypagePage.getPageTitle()
    expect(title).toBe('マイページ')
  })

  test('タブレットサイズ（768px）でマイページが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 768, height: 1024 })
    loginPage = new LoginPage(page)
    await loginPage.loginAndNavigateToMypage()

    // Assert
    const mypagePage = new MypagePage(page)
    const title = await mypagePage.getPageTitle()
    expect(title).toBe('マイページ')
  })
})
