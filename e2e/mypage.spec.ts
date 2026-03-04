/**
 * @fileoverview マイページのE2Eテスト
 * @module e2e/mypage.spec
 *
 * EC-278: アカウント管理ポータル
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

// ============================================================
// Page Objects
// ============================================================

/**
 * ログインヘルパー
 * マイページテスト用のログイン共通処理
 */
class LoginHelper {
  constructor(private page: Page) {}

  /** テストユーザーでログイン */
  async loginAsTestUser() {
    await this.page.goto('/login')
    await this.page.locator('#email').fill('test@docomo.ne.jp')
    await this.page.locator('#password').fill('password123')
    await this.page.locator('button[type="submit"]').click()
    await this.page.waitForURL('**/mypage**')
  }
}

/**
 * マイページダッシュボードのPage Object
 */
class MyPageDashboardPage {
  constructor(private page: Page) {}

  /** ダッシュボードに移動（ログイン済み前提） */
  async goto() {
    await this.page.goto('/mypage')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** プラン名が表示されているか */
  async getPlanName() {
    return this.page.locator('text=ahamo').first().isVisible()
  }

  /** データ使用量プログレスバーが表示されているか */
  async isDataUsageProgressBarVisible() {
    return this.page.locator('[role="progressbar"]').isVisible()
  }

  /** 請求額が表示されているか */
  async isBillingAmountVisible() {
    return this.page.locator('text=¥3,470').isVisible()
  }

  /** 端末情報が表示されているか */
  async isDeviceInfoVisible() {
    return this.page.locator('text=iPhone 15 Pro').isVisible()
  }

  /** 通知バナーが表示されているか */
  async isNotificationBannerVisible() {
    return this.page.locator('text=未読の通知').isVisible()
  }

  /** ナビゲーション項目が表示されているか（デスクトップ） */
  async isNavVisible() {
    return this.page.locator('nav[aria-label="マイページナビゲーション"]').isVisible()
  }

  /** ナビゲーションリンクをクリック */
  async clickNavLink(label: string) {
    await this.page.locator(`nav a:has-text("${label}")`).click()
  }
}

/**
 * 契約情報ページのPage Object
 */
class ContractPage {
  constructor(private page: Page) {}

  /** 契約情報ページに移動 */
  async goto() {
    await this.page.goto('/mypage/contract')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** プラン名が表示されているか */
  async isPlanNameVisible() {
    return this.page.locator('text=ahamo').first().isVisible()
  }

  /** 電話番号が表示されているか */
  async isPhoneNumberVisible() {
    return this.page.locator('text=090-1234-5678').isVisible()
  }

  /** 端末情報が表示されているか */
  async isDeviceInfoVisible() {
    return this.page.locator('text=iPhone 15 Pro').isVisible()
  }

  /** SIM情報が表示されているか */
  async isSimInfoVisible() {
    return this.page.locator('text=eSIM').isVisible()
  }
}

/**
 * データ使用量ページのPage Object
 */
class DataUsagePage {
  constructor(private page: Page) {}

  /** データ使用量ページに移動 */
  async goto() {
    await this.page.goto('/mypage/data-usage')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** プログレスバーが表示されているか */
  async isProgressBarVisible() {
    return this.page.locator('[role="progressbar"]').isVisible()
  }

  /** 日別使用量グラフが表示されているか */
  async isDailyChartVisible() {
    return this.page.locator('text=日別使用量').isVisible()
  }

  /** 月別使用量履歴が表示されているか */
  async isMonthlyHistoryVisible() {
    return this.page.locator('text=月別使用量履歴').isVisible()
  }
}

/**
 * 請求・支払いページのPage Object
 */
class BillingPage {
  constructor(private page: Page) {}

  /** 請求ページに移動 */
  async goto() {
    await this.page.goto('/mypage/billing')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** 請求額が表示されているか */
  async isBillingAmountVisible() {
    return this.page.locator('text=¥3,470').isVisible()
  }

  /** 請求内訳が表示されているか */
  async isBreakdownVisible() {
    return this.page.locator('text=請求内訳').isVisible()
  }

  /** 請求履歴テーブルが表示されているか */
  async isHistoryTableVisible() {
    return this.page.locator('text=請求履歴').isVisible()
  }
}

/**
 * アカウント設定ページのPage Object
 */
class SettingsPage {
  constructor(private page: Page) {}

  /** 設定ページに移動 */
  async goto() {
    await this.page.goto('/mypage/settings')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** 名前フィールドの値を取得 */
  async getNameValue() {
    return this.page.locator('#settings-name').inputValue()
  }

  /** メールフィールドの値を取得 */
  async getEmailValue() {
    return this.page.locator('#settings-email').inputValue()
  }

  /** 名前を入力 */
  async fillName(name: string) {
    await this.page.locator('#settings-name').fill(name)
  }

  /** メールを入力 */
  async fillEmail(email: string) {
    await this.page.locator('#settings-email').fill(email)
  }

  /** 設定保存ボタンをクリック */
  async clickSaveSettings() {
    await this.page.locator('button:has-text("設定を保存")').click()
  }

  /** 現在のパスワードを入力 */
  async fillCurrentPassword(password: string) {
    await this.page.locator('#current-password').fill(password)
  }

  /** 新しいパスワードを入力 */
  async fillNewPassword(password: string) {
    await this.page.locator('#new-password').fill(password)
  }

  /** パスワード確認を入力 */
  async fillConfirmPassword(password: string) {
    await this.page.locator('#confirm-password').fill(password)
  }

  /** パスワード変更ボタンをクリック */
  async clickChangePassword() {
    await this.page.locator('button:has-text("パスワードを変更")').click()
  }

  /** 成功メッセージが表示されているか */
  async isSuccessMessageVisible() {
    return this.page
      .locator('[role="alert"]:has-text("更新しました"), [role="alert"]:has-text("変更しました")')
      .first()
      .isVisible()
  }

  /** エラーメッセージが表示されているか */
  async isErrorMessageVisible() {
    return this.page
      .locator('[role="alert"]:has-text("正しくありません"), [role="alert"]:has-text("失敗")')
      .first()
      .isVisible()
  }
}

/**
 * プラン変更ページのPage Object
 */
class PlanChangePage {
  constructor(private page: Page) {}

  /** プラン変更ページに移動 */
  async goto() {
    await this.page.goto('/mypage/plan-change')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** 現在のプランが表示されているか */
  async isCurrentPlanVisible() {
    return this.page.locator('text=現在のプラン').isVisible()
  }

  /** ahamo大盛りプランが表示されているか */
  async isLargePlanVisible() {
    return this.page.locator('text=ahamo大盛り').isVisible()
  }
}

/**
 * オプション管理ページのPage Object
 */
class OptionsPage {
  constructor(private page: Page) {}

  /** オプション管理ページに移動 */
  async goto() {
    await this.page.goto('/mypage/options')
  }

  /** ページ見出しを取得 */
  async getPageTitle() {
    return this.page.locator('h2').first().textContent()
  }

  /** 登録中のオプションが表示されているか */
  async isEnrolledSectionVisible() {
    return this.page.locator('text=登録中のオプション').isVisible()
  }

  /** 利用可能なオプションが表示されているか */
  async isAvailableSectionVisible() {
    return this.page.locator('text=利用可能なオプション').isVisible()
  }

  /** かけ放題オプションが表示されているか */
  async isKakehodaiVisible() {
    return this.page.locator('text=かけ放題オプション').isVisible()
  }

  /** 登録ボタンの数を取得 */
  async getEnrollButtonCount() {
    return this.page.locator('button:has-text("登録する")').count()
  }

  /** 解除ボタンの数を取得 */
  async getCancelButtonCount() {
    return this.page.locator('button:has-text("解除する")').count()
  }
}

// ============================================================
// テストケース
// ============================================================

test.describe('マイページ 認証ガード (EC-278)', () => {
  test('未認証ユーザーがマイページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/mypage')

    // Assert
    await page.waitForURL('**/login**')
    expect(page.url()).toContain('/login')
  })

  test('未認証ユーザーが契約情報ページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/mypage/contract')

    // Assert
    await page.waitForURL('**/login**')
    expect(page.url()).toContain('/login')
  })

  test('未認証ユーザーが設定ページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/mypage/settings')

    // Assert
    await page.waitForURL('**/login**')
    expect(page.url()).toContain('/login')
  })
})

test.describe('マイページ ダッシュボード (EC-278)', () => {
  let loginHelper: LoginHelper
  let dashboardPage: MyPageDashboardPage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    dashboardPage = new MyPageDashboardPage(page)
    await loginHelper.loginAsTestUser()
  })

  test('ダッシュボードにマイページ見出しが表示される', async () => {
    // Assert
    const title = await dashboardPage.getPageTitle()
    expect(title).toBe('マイページ')
  })

  test('ダッシュボードにプラン名が表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.getPlanName()
    expect(isVisible).toBe(true)
  })

  test('ダッシュボードにデータ使用量プログレスバーが表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.isDataUsageProgressBarVisible()
    expect(isVisible).toBe(true)
  })

  test('ダッシュボードに請求額が表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.isBillingAmountVisible()
    expect(isVisible).toBe(true)
  })

  test('ダッシュボードに端末情報が表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.isDeviceInfoVisible()
    expect(isVisible).toBe(true)
  })

  test('ダッシュボードに通知バナーが表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.isNotificationBannerVisible()
    expect(isVisible).toBe(true)
  })

  test('ナビゲーションが表示される', async () => {
    // Assert
    const isVisible = await dashboardPage.isNavVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ 契約情報 (EC-278)', () => {
  let loginHelper: LoginHelper
  let contractPage: ContractPage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    contractPage = new ContractPage(page)
    await loginHelper.loginAsTestUser()
  })

  test('契約情報ページにアクセスできる', async () => {
    // Act
    await contractPage.goto()

    // Assert
    const title = await contractPage.getPageTitle()
    expect(title).toBe('契約情報')
  })

  test('契約情報ページにプラン名が表示される', async () => {
    // Act
    await contractPage.goto()

    // Assert
    const isVisible = await contractPage.isPlanNameVisible()
    expect(isVisible).toBe(true)
  })

  test('契約情報ページに電話番号が表示される', async () => {
    // Act
    await contractPage.goto()

    // Assert
    const isVisible = await contractPage.isPhoneNumberVisible()
    expect(isVisible).toBe(true)
  })

  test('契約情報ページに端末情報が表示される', async () => {
    // Act
    await contractPage.goto()

    // Assert
    const isVisible = await contractPage.isDeviceInfoVisible()
    expect(isVisible).toBe(true)
  })

  test('契約情報ページにSIM情報が表示される', async () => {
    // Act
    await contractPage.goto()

    // Assert
    const isVisible = await contractPage.isSimInfoVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ データ使用量 (EC-278)', () => {
  let loginHelper: LoginHelper
  let dataUsagePage: DataUsagePage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    dataUsagePage = new DataUsagePage(page)
    await loginHelper.loginAsTestUser()
  })

  test('データ使用量ページにアクセスできる', async () => {
    // Act
    await dataUsagePage.goto()

    // Assert
    const title = await dataUsagePage.getPageTitle()
    expect(title).toBe('データ使用量')
  })

  test('データ使用量プログレスバーが表示される', async () => {
    // Act
    await dataUsagePage.goto()

    // Assert
    const isVisible = await dataUsagePage.isProgressBarVisible()
    expect(isVisible).toBe(true)
  })

  test('日別使用量グラフが表示される', async () => {
    // Act
    await dataUsagePage.goto()

    // Assert
    const isVisible = await dataUsagePage.isDailyChartVisible()
    expect(isVisible).toBe(true)
  })

  test('月別使用量履歴が表示される', async () => {
    // Act
    await dataUsagePage.goto()

    // Assert
    const isVisible = await dataUsagePage.isMonthlyHistoryVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ 請求・支払い (EC-278)', () => {
  let loginHelper: LoginHelper
  let billingPage: BillingPage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    billingPage = new BillingPage(page)
    await loginHelper.loginAsTestUser()
  })

  test('請求・支払いページにアクセスできる', async () => {
    // Act
    await billingPage.goto()

    // Assert
    const title = await billingPage.getPageTitle()
    expect(title).toBe('請求・支払い情報')
  })

  test('請求額が表示される', async () => {
    // Act
    await billingPage.goto()

    // Assert
    const isVisible = await billingPage.isBillingAmountVisible()
    expect(isVisible).toBe(true)
  })

  test('請求内訳が表示される', async () => {
    // Act
    await billingPage.goto()

    // Assert
    const isVisible = await billingPage.isBreakdownVisible()
    expect(isVisible).toBe(true)
  })

  test('請求履歴テーブルが表示される', async () => {
    // Act
    await billingPage.goto()

    // Assert
    const isVisible = await billingPage.isHistoryTableVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ アカウント設定 (EC-278)', () => {
  let loginHelper: LoginHelper
  let settingsPage: SettingsPage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    settingsPage = new SettingsPage(page)
    await loginHelper.loginAsTestUser()
  })

  test('アカウント設定ページにアクセスできる', async () => {
    // Act
    await settingsPage.goto()

    // Assert
    const title = await settingsPage.getPageTitle()
    expect(title).toBe('アカウント設定')
  })

  test('設定フォームに現在の値が表示される', async () => {
    // Act
    await settingsPage.goto()

    // Assert
    await expect(settingsPage['page'].locator('#settings-name')).toHaveValue('テストユーザー')
    await expect(settingsPage['page'].locator('#settings-email')).toHaveValue('test@docomo.ne.jp')
  })

  test('設定を保存できる', async ({ page }) => {
    // Arrange
    await settingsPage.goto()
    await page.locator('#settings-name').waitFor({ state: 'visible' })

    // Act
    await settingsPage.fillName('更新テストユーザー')
    await settingsPage.clickSaveSettings()

    // Assert
    await expect(page.locator('[role="alert"]').first()).toBeVisible()
    const isSuccess = await settingsPage.isSuccessMessageVisible()
    expect(isSuccess).toBe(true)
  })

  test('パスワード変更フォームが表示される', async () => {
    // Act
    await settingsPage.goto()

    // Assert
    await expect(settingsPage['page'].locator('text=パスワード変更')).toBeVisible()
  })
})

test.describe('マイページ プラン変更 (EC-278)', () => {
  let loginHelper: LoginHelper
  let planChangePage: PlanChangePage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    planChangePage = new PlanChangePage(page)
    await loginHelper.loginAsTestUser()
  })

  test('プラン変更ページにアクセスできる', async () => {
    // Act
    await planChangePage.goto()

    // Assert
    const title = await planChangePage.getPageTitle()
    expect(title).toBe('プラン変更')
  })

  test('現在のプランが表示される', async () => {
    // Act
    await planChangePage.goto()

    // Assert
    const isVisible = await planChangePage.isCurrentPlanVisible()
    expect(isVisible).toBe(true)
  })

  test('ahamo大盛りプランが表示される', async () => {
    // Act
    await planChangePage.goto()

    // Assert
    const isVisible = await planChangePage.isLargePlanVisible()
    expect(isVisible).toBe(true)
  })
})

test.describe('マイページ オプション管理 (EC-278)', () => {
  let loginHelper: LoginHelper
  let optionsPage: OptionsPage

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    optionsPage = new OptionsPage(page)
    await loginHelper.loginAsTestUser()
  })

  test('オプション管理ページにアクセスできる', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const title = await optionsPage.getPageTitle()
    expect(title).toBe('オプション管理')
  })

  test('登録中のオプションセクションが表示される', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const isVisible = await optionsPage.isEnrolledSectionVisible()
    expect(isVisible).toBe(true)
  })

  test('利用可能なオプションセクションが表示される', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const isVisible = await optionsPage.isAvailableSectionVisible()
    expect(isVisible).toBe(true)
  })

  test('かけ放題オプションが表示される', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const isVisible = await optionsPage.isKakehodaiVisible()
    expect(isVisible).toBe(true)
  })

  test('登録ボタンが表示される', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const count = await optionsPage.getEnrollButtonCount()
    expect(count).toBeGreaterThan(0)
  })

  test('解除ボタンが表示される', async () => {
    // Act
    await optionsPage.goto()

    // Assert
    const count = await optionsPage.getCancelButtonCount()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('マイページ レスポンシブデザイン (EC-278)', () => {
  let loginHelper: LoginHelper

  test('モバイルサイズでダッシュボードが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 })
    loginHelper = new LoginHelper(page)
    await loginHelper.loginAsTestUser()

    // Assert
    const title = await page.locator('h1').textContent()
    expect(title).toBe('マイページ')
    // モバイルではハンバーガーメニューが表示される
    await expect(page.locator('button[aria-label="メニューを開く"]')).toBeVisible()
  })

  test('タブレットサイズでダッシュボードが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 768, height: 1024 })
    loginHelper = new LoginHelper(page)
    await loginHelper.loginAsTestUser()

    // Assert
    const title = await page.locator('h1').textContent()
    expect(title).toBe('マイページ')
  })

  test('モバイルでハンバーガーメニューが開閉できる', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 })
    loginHelper = new LoginHelper(page)
    await loginHelper.loginAsTestUser()

    // Act - メニューを開く
    await page.locator('button[aria-label="メニューを開く"]').click()

    // Assert - ナビゲーション項目が表示される
    await expect(page.locator('nav a:has-text("ダッシュボード")')).toBeVisible()
    await expect(page.locator('nav a:has-text("契約情報")')).toBeVisible()
    await expect(page.locator('nav a:has-text("データ使用量")')).toBeVisible()
  })
})

test.describe('マイページ ナビゲーション (EC-278)', () => {
  let loginHelper: LoginHelper

  test.beforeEach(async ({ page }) => {
    loginHelper = new LoginHelper(page)
    await loginHelper.loginAsTestUser()
  })

  test('ダッシュボードから契約情報ページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("契約情報")').click()

    // Assert
    await page.waitForURL('**/mypage/contract**')
    expect(page.url()).toContain('/mypage/contract')
  })

  test('ダッシュボードからデータ使用量ページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("データ使用量")').click()

    // Assert
    await page.waitForURL('**/mypage/data-usage**')
    expect(page.url()).toContain('/mypage/data-usage')
  })

  test('ダッシュボードから請求・支払いページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("請求・支払い")').click()

    // Assert
    await page.waitForURL('**/mypage/billing**')
    expect(page.url()).toContain('/mypage/billing')
  })

  test('ダッシュボードからアカウント設定ページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("アカウント設定")').click()

    // Assert
    await page.waitForURL('**/mypage/settings**')
    expect(page.url()).toContain('/mypage/settings')
  })

  test('ダッシュボードからプラン変更ページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("プラン変更")').click()

    // Assert
    await page.waitForURL('**/mypage/plan-change**')
    expect(page.url()).toContain('/mypage/plan-change')
  })

  test('ダッシュボードからオプション管理ページに遷移できる', async ({ page }) => {
    // Act
    await page.locator('nav a:has-text("オプション管理")').click()

    // Assert
    await page.waitForURL('**/mypage/options**')
    expect(page.url()).toContain('/mypage/options')
  })
})
