/**
 * @fileoverview マイページのE2Eテスト
 * @module e2e/mypage.spec
 *
 * EC-278: マイページアカウント管理機能
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * ログインページのPage Object（認証フロー用）
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

  /** ログインを実行（一連の操作） */
  async login(email: string, password: string) {
    await this.goto()
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.clickLoginButton()
    await this.page.waitForURL('/mypage')
  }
}

/**
 * ヘッダーのPage Object
 */
class HeaderPage {
  constructor(private page: Page) {}

  /** マイページボタンが表示されているか */
  async isMyPageButtonVisible() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }

  /** マイページボタンをクリック */
  async clickMyPageButton() {
    await this.page.locator('a[href="/mypage"]').click()
  }
}

/**
 * マイページダッシュボードのPage Object
 */
class MyPageDashboard {
  constructor(private page: Page) {}

  /** ダッシュボードに移動 */
  async goto() {
    await this.page.goto('/mypage')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** ユーザー名挨拶が表示されているか */
  async hasUserGreeting() {
    return this.page.locator('text=こんにちは').isVisible()
  }

  /** プラン情報が表示されているか */
  async hasPlanInfo() {
    return this.page.locator('[aria-label="現在のプラン"]').isVisible()
  }

  /** データ使用量が表示されているか */
  async hasDataUsageInfo() {
    return this.page.locator('[aria-label="データ使用量"]').isVisible()
  }

  /** 請求情報が表示されているか */
  async hasBillingInfo() {
    return this.page.locator('[aria-label="今月の請求見積もり"]').isVisible()
  }

  /** 端末情報が表示されているか */
  async hasDeviceInfo() {
    return this.page.locator('[aria-label="ご利用端末"]').isVisible()
  }

  /** 通知バナーが表示されているか */
  async hasNotificationBanner() {
    return this.page.locator('text=未読通知があります').isVisible()
  }

  /** クイックアクセスリンクが表示されているか */
  async hasQuickLinks() {
    return this.page.locator('text=各種手続き').isVisible()
  }

  /** サポートセクションが表示されているか */
  async hasSupportSection() {
    return this.page.locator('text=サポート').isVisible()
  }

  /** チャットサポートボタンが表示されているか */
  async hasChatSupport() {
    return this.page.locator('[aria-label="チャットサポート"]').isVisible()
  }

  /** FAQリンクが表示されているか */
  async hasFaqLink() {
    return this.page.locator('[aria-label="よくある質問"]').isVisible()
  }

  /** お問い合わせフォームが表示されているか */
  async hasContactForm() {
    return this.page.locator('[aria-label="お問い合わせフォーム"]').isVisible()
  }

  /** 電話サポートが表示されているか */
  async hasPhoneSupport() {
    return this.page.locator('[aria-label="電話サポート"]').isVisible()
  }

  /** 契約内容リンクをクリック */
  async clickContractLink() {
    await this.page.locator('a[href="/mypage/contract"]').first().click()
  }

  /** データ使用量リンクをクリック */
  async clickDataUsageLink() {
    await this.page.locator('a[href="/mypage/data-usage"]').first().click()
  }

  /** 請求・支払いリンクをクリック */
  async clickBillingLink() {
    await this.page.locator('a[href="/mypage/billing"]').first().click()
  }

  /** アカウント設定リンクをクリック */
  async clickSettingsLink() {
    await this.page.locator('a[href="/mypage/settings"]').first().click()
  }

  /** プラン変更リンクをクリック */
  async clickPlanLink() {
    await this.page.locator('a[href="/mypage/plan"]').first().click()
  }

  /** オプション管理リンクをクリック */
  async clickOptionsLink() {
    await this.page.locator('a[href="/mypage/options"]').first().click()
  }

  /** プログレスバーが表示されているか */
  async hasProgressBar() {
    return this.page.locator('[role="progressbar"]').isVisible()
  }
}

/**
 * サイドナビゲーションのPage Object
 */
class SideNavigation {
  constructor(private page: Page) {}

  /** ナビゲーションが表示されているか */
  async isVisible() {
    return this.page.locator('[aria-label="マイページナビゲーション"]').isVisible()
  }

  /** 契約内容リンクをクリック */
  async clickContract() {
    await this.page.locator('nav >> a[href="/mypage/contract"]').click()
  }

  /** データ使用量リンクをクリック */
  async clickDataUsage() {
    await this.page.locator('nav >> a[href="/mypage/data-usage"]').click()
  }

  /** 請求・支払いリンクをクリック */
  async clickBilling() {
    await this.page.locator('nav >> a[href="/mypage/billing"]').click()
  }

  /** アカウント設定リンクをクリック */
  async clickSettings() {
    await this.page.locator('nav >> a[href="/mypage/settings"]').click()
  }

  /** プラン変更リンクをクリック */
  async clickPlan() {
    await this.page.locator('nav >> a[href="/mypage/plan"]').click()
  }

  /** オプション管理リンクをクリック */
  async clickOptions() {
    await this.page.locator('nav >> a[href="/mypage/options"]').click()
  }
}

// ========================================
// テストスイート
// ========================================

/**
 * テスト認証情報
 */
const TEST_EMAIL = 'test@docomo.ne.jp'
const TEST_PASSWORD = 'password123'

test.describe('マイページ (EC-278)', () => {
  // ========================================
  // シナリオ1: ヘッダーからマイページにアクセス
  // ========================================
  test.describe('シナリオ1: マイページへのアクセス', () => {
    test('ヘッダーのマイページボタンからマイページにアクセスできる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const headerPage = new HeaderPage(page)

      // Act - ログイン
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert - ヘッダーにマイページボタンが表示されている
      const isVisible = await headerPage.isMyPageButtonVisible()
      expect(isVisible).toBe(true)

      // Assert - マイページに遷移している
      expect(page.url()).toContain('/mypage')
    })

    test('未認証ユーザーがマイページにアクセスするとログインページにリダイレクトされる', async ({ page }) => {
      // Act
      await page.goto('/mypage')

      // Assert - ログインページにリダイレクトされる
      await page.waitForURL('/login')
      expect(page.url()).toContain('/login')
    })
  })

  // ========================================
  // シナリオ2: ダッシュボード情報表示
  // ========================================
  test.describe('シナリオ2: ダッシュボード情報表示', () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)
    })

    test('ダッシュボードにプラン概要が表示される', async ({ page }) => {
      // Arrange
      const dashboard = new MyPageDashboard(page)

      // Assert
      const title = await dashboard.getPageTitle()
      expect(title).toBe('マイページ')
      expect(await dashboard.hasPlanInfo()).toBe(true)
    })

    test('ダッシュボードにデータ使用量が表示される', async ({ page }) => {
      // Arrange
      const dashboard = new MyPageDashboard(page)

      // Assert
      expect(await dashboard.hasDataUsageInfo()).toBe(true)
      expect(await dashboard.hasProgressBar()).toBe(true)
    })

    test('ダッシュボードに請求見積もりが表示される', async ({ page }) => {
      // Arrange
      const dashboard = new MyPageDashboard(page)

      // Assert
      expect(await dashboard.hasBillingInfo()).toBe(true)
    })

    test('ダッシュボードに端末情報が表示される', async ({ page }) => {
      // Arrange
      const dashboard = new MyPageDashboard(page)

      // Assert
      expect(await dashboard.hasDeviceInfo()).toBe(true)
    })

    test('ダッシュボードにユーザー挨拶が表示される', async ({ page }) => {
      // Arrange
      const dashboard = new MyPageDashboard(page)

      // Assert
      expect(await dashboard.hasUserGreeting()).toBe(true)
    })
  })

  // ========================================
  // シナリオ3: 契約詳細への遷移
  // ========================================
  test.describe('シナリオ3: 契約詳細', () => {
    test('ダッシュボードから契約詳細ページに遷移できる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickContract()

      // Assert
      await page.waitForURL('/mypage/contract')
      await expect(page.locator('h1')).toHaveText('契約内容')
      await expect(page.locator('text=契約番号')).toBeVisible()
    })
  })

  // ========================================
  // シナリオ4: データ使用量詳細への遷移
  // ========================================
  test.describe('シナリオ4: データ使用量詳細', () => {
    test('ダッシュボードからデータ使用量ページに遷移できる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickDataUsage()

      // Assert
      await page.waitForURL('/mypage/data-usage')
      await expect(page.locator('h1')).toHaveText('データ使用量')
      await expect(page.locator('[role="progressbar"]')).toBeVisible()
    })
  })

  // ========================================
  // シナリオ5: 請求情報への遷移
  // ========================================
  test.describe('シナリオ5: 請求情報', () => {
    test('ダッシュボードから請求ページに遷移できる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickBilling()

      // Assert
      await page.waitForURL('/mypage/billing')
      await expect(page.locator('h1')).toHaveText('請求・支払い')
    })
  })

  // ========================================
  // シナリオ6: アカウント設定変更
  // ========================================
  test.describe('シナリオ6: アカウント設定', () => {
    test('アカウント設定ページに遷移できる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickSettings()

      // Assert
      await page.waitForURL('/mypage/settings')
      await expect(page.locator('h1')).toHaveText('アカウント設定')
      // プロフィールタブが表示されている
      await expect(page.locator('[role="tab"][aria-selected="true"]')).toContainText('プロフィール')
    })

    test('パスワード変更タブに切り替えできる', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)
      await sideNav.clickSettings()
      await page.waitForURL('/mypage/settings')

      // Act
      await page.locator('text=パスワード変更').click()

      // Assert
      await expect(page.locator('#currentPassword')).toBeVisible()
      await expect(page.locator('#newPassword')).toBeVisible()
      await expect(page.locator('#confirmPassword')).toBeVisible()
    })
  })

  // ========================================
  // シナリオ7: プラン変更
  // ========================================
  test.describe('シナリオ7: プラン変更', () => {
    test('プラン変更ページに遷移し、プラン一覧が表示される', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickPlan()

      // Assert
      await page.waitForURL('/mypage/plan')
      await expect(page.locator('h1')).toHaveText('プラン変更')
      // 現在のプラン表示
      await expect(page.locator('text=現在のプラン')).toBeVisible()
      // プランカードが表示される
      await expect(page.locator('[role="radio"]').first()).toBeVisible()
    })
  })

  // ========================================
  // シナリオ8: オプション管理
  // ========================================
  test.describe('シナリオ8: オプション管理', () => {
    test('オプション管理ページに遷移し、オプション一覧が表示される', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const sideNav = new SideNavigation(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Act
      await sideNav.clickOptions()

      // Assert
      await page.waitForURL('/mypage/options')
      await expect(page.locator('h1')).toHaveText('オプション管理')
      // 利用中のオプションセクション
      await expect(page.locator('text=利用中のオプション')).toBeVisible()
      // 追加可能なオプションセクション
      await expect(page.locator('text=追加可能なオプション')).toBeVisible()
    })
  })

  // ========================================
  // シナリオ9: 各種手続きアクセス
  // ========================================
  test.describe('シナリオ9: 各種手続きアクセス', () => {
    test('ダッシュボードにクイックアクセスリンクが表示される', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const dashboard = new MyPageDashboard(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert
      expect(await dashboard.hasQuickLinks()).toBe(true)
    })
  })

  // ========================================
  // シナリオ10: サポート機能アクセス
  // ========================================
  test.describe('シナリオ10: サポート機能アクセス', () => {
    test('ダッシュボードにサポートオプションが表示される', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page)
      const dashboard = new MyPageDashboard(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert
      expect(await dashboard.hasSupportSection()).toBe(true)
      expect(await dashboard.hasChatSupport()).toBe(true)
      expect(await dashboard.hasFaqLink()).toBe(true)
      expect(await dashboard.hasContactForm()).toBe(true)
      expect(await dashboard.hasPhoneSupport()).toBe(true)
    })
  })

  // ========================================
  // シナリオ11: レスポンシブデザイン検証
  // ========================================
  test.describe('シナリオ11: レスポンシブデザイン', () => {
    test('モバイルサイズでダッシュボードが正しく表示される', async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 375, height: 667 })
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert
      const dashboard = new MyPageDashboard(page)
      const title = await dashboard.getPageTitle()
      expect(title).toBe('マイページ')
      expect(await dashboard.hasPlanInfo()).toBe(true)
      expect(await dashboard.hasDataUsageInfo()).toBe(true)
    })

    test('タブレットサイズでダッシュボードが正しく表示される', async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 768, height: 1024 })
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert
      const dashboard = new MyPageDashboard(page)
      const title = await dashboard.getPageTitle()
      expect(title).toBe('マイページ')
      expect(await dashboard.hasPlanInfo()).toBe(true)
      expect(await dashboard.hasSupportSection()).toBe(true)
    })

    test('モバイルサイズでサイドナビゲーションが表示される', async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 375, height: 667 })
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_EMAIL, TEST_PASSWORD)

      // Assert
      const sideNav = new SideNavigation(page)
      // モバイルでもナビゲーションは表示される（縦並び）
      expect(await sideNav.isVisible()).toBe(true)
    })
  })
})
