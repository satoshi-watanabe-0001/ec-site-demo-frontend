/**
 * @fileoverview マイページのE2Eテスト
 * @module e2e/mypage.spec
 *
 * EC-278: アカウント管理（マイページ）機能
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * 認証状態をlocalStorageに設定するヘルパー
 * Zustandのauth-storageキーにユーザー情報を書き込む
 */
async function setupAuthState(page: Page) {
  await page.addInitScript(() => {
    const authState = {
      state: {
        user: {
          id: 'user-001',
          name: '山田太郎',
          email: 'test@docomo.ne.jp',
        },
        isAuthenticated: true,
        isLoading: false,
      },
      version: 0,
    }
    localStorage.setItem('auth-storage', JSON.stringify(authState))
  })
}

/**
 * マイページダッシュボードのPage Object
 */
class MypageDashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async getWelcomeMessage() {
    return this.page.locator('text=のダッシュボード').textContent()
  }

  async isContractSectionVisible() {
    return this.page.locator('text=契約情報').first().isVisible()
  }

  async isDataUsageSectionVisible() {
    return this.page.locator('text=データ使用量').first().isVisible()
  }

  async isBillingSectionVisible() {
    return this.page.locator('text=請求予定額').first().isVisible()
  }

  async isDeviceSectionVisible() {
    return this.page.locator('text=契約中端末').first().isVisible()
  }

  async isNotificationSectionVisible() {
    return this.page.locator('text=通知・お知らせ').first().isVisible()
  }

  async isSettingsSectionVisible() {
    return this.page.locator('text=アカウント設定').first().isVisible()
  }

  async clickContractLink() {
    await this.page.locator('a[href="/mypage/contract"]').click()
  }

  async clickDataUsageLink() {
    await this.page.locator('a[href="/mypage/data-usage"]').click()
  }

  async clickBillingLink() {
    await this.page.locator('a[href="/mypage/billing"]').click()
  }

  async clickSettingsLink() {
    await this.page.locator('a[href="/mypage/settings"]').click()
  }

  async getDashboardCardCount() {
    return this.page.locator('.rounded-xl.bg-slate-800').count()
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

  async isContractorInfoVisible() {
    return this.page.locator('text=契約者情報').isVisible()
  }

  async isContractDetailsVisible() {
    return this.page.locator('text=契約内容').isVisible()
  }

  async isOptionsSectionVisible() {
    return this.page.locator('text=オプションサービス').isVisible()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }

  async clickBackLink() {
    await this.page.locator('a[href="/mypage"]').click()
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

  async isCurrentUsageVisible() {
    return this.page.locator('text=今月の使用状況').isVisible()
  }

  async isUsageChartVisible() {
    return this.page.locator('text=使用量推移').isVisible()
  }

  async isChargeHistoryVisible() {
    return this.page.locator('text=データチャージ履歴').isVisible()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }
}

/**
 * 請求・支払い情報ページのPage Object
 */
class BillingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/billing')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isBillingSummaryVisible() {
    return this.page.locator('text=今月の請求予定額').isVisible()
  }

  async isBillingHistoryVisible() {
    return this.page.locator('text=請求履歴').isVisible()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }
}

/**
 * アカウント設定ページのPage Object
 */
class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/settings')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isContactInfoVisible() {
    return this.page.locator('text=連絡先情報').isVisible()
  }

  async isPasswordSectionVisible() {
    return this.page.locator('text=パスワード変更').isVisible()
  }

  async isNotificationSettingsVisible() {
    return this.page.locator('text=通知設定').isVisible()
  }

  async getEmailValue() {
    return this.page.locator('#email').inputValue()
  }

  async getPhoneValue() {
    return this.page.locator('#phoneNumber').inputValue()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }
}

/**
 * プラン変更ページのPage Object
 */
class PlanPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/plan')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
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

  async isCurrentOptionsVisible() {
    return this.page.locator('text=契約中のオプション').isVisible()
  }

  async isAvailableOptionsVisible() {
    return this.page.locator('text=追加可能なオプション').isVisible()
  }

  async hasBackLink() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }
}

test.describe('マイページダッシュボード (EC-278)', () => {
  let dashboardPage: MypageDashboardPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    dashboardPage = new MypageDashboardPage(page)
  })

  test.describe('ページ表示', () => {
    test('マイページにアクセスするとダッシュボードが表示される', async () => {
      await dashboardPage.goto()

      const title = await dashboardPage.getPageTitle()
      expect(title).toBe('マイページ')
    })

    test('ダッシュボードにウェルカムメッセージが表示される', async () => {
      await dashboardPage.goto()

      const message = await dashboardPage.getWelcomeMessage()
      expect(message).toContain('のダッシュボード')
    })

    test('契約情報セクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isContractSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('データ使用量セクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isDataUsageSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('請求予定額セクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isBillingSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('契約中端末セクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isDeviceSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('通知・お知らせセクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isNotificationSectionVisible()
      expect(isVisible).toBe(true)
    })

    test('アカウント設定セクションが表示される', async () => {
      await dashboardPage.goto()

      const isVisible = await dashboardPage.isSettingsSectionVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ナビゲーション', () => {
    test('契約情報リンクから契約情報ページに遷移できる', async ({ page }) => {
      await dashboardPage.goto()
      await dashboardPage.clickContractLink()

      await page.waitForURL('/mypage/contract')
      expect(page.url()).toContain('/mypage/contract')
    })

    test('データ使用量リンクからデータ使用量ページに遷移できる', async ({ page }) => {
      await dashboardPage.goto()
      await dashboardPage.clickDataUsageLink()

      await page.waitForURL('/mypage/data-usage')
      expect(page.url()).toContain('/mypage/data-usage')
    })

    test('請求予定額リンクから請求情報ページに遷移できる', async ({ page }) => {
      await dashboardPage.goto()
      await dashboardPage.clickBillingLink()

      await page.waitForURL('/mypage/billing')
      expect(page.url()).toContain('/mypage/billing')
    })

    test('アカウント設定リンクからアカウント設定ページに遷移できる', async ({ page }) => {
      await dashboardPage.goto()
      await dashboardPage.clickSettingsLink()

      await page.waitForURL('/mypage/settings')
      expect(page.url()).toContain('/mypage/settings')
    })
  })
})

test.describe('契約情報ページ (EC-278)', () => {
  let contractPage: ContractPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    contractPage = new ContractPage(page)
  })

  test('契約情報ページにアクセスするとタイトルが表示される', async () => {
    await contractPage.goto()

    const title = await contractPage.getPageTitle()
    expect(title).toBe('契約情報')
  })

  test('契約者情報セクションが表示される', async () => {
    await contractPage.goto()

    const isVisible = await contractPage.isContractorInfoVisible()
    expect(isVisible).toBe(true)
  })

  test('契約内容セクションが表示される', async () => {
    await contractPage.goto()

    const isVisible = await contractPage.isContractDetailsVisible()
    expect(isVisible).toBe(true)
  })

  test('オプションサービスセクションが表示される', async () => {
    await contractPage.goto()

    const isVisible = await contractPage.isOptionsSectionVisible()
    expect(isVisible).toBe(true)
  })

  test('マイページに戻るリンクが表示される', async () => {
    await contractPage.goto()

    const hasLink = await contractPage.hasBackLink()
    expect(hasLink).toBe(true)
  })

  test('マイページに戻るリンクをクリックするとマイページに遷移する', async ({ page }) => {
    await contractPage.goto()
    await contractPage.clickBackLink()

    await page.waitForURL('/mypage')
    expect(page.url()).toContain('/mypage')
  })
})

test.describe('データ使用量ページ (EC-278)', () => {
  let dataUsagePage: DataUsagePage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    dataUsagePage = new DataUsagePage(page)
  })

  test('データ使用量ページにアクセスするとタイトルが表示される', async () => {
    await dataUsagePage.goto()

    const title = await dataUsagePage.getPageTitle()
    expect(title).toBe('データ使用量')
  })

  test('今月の使用状況セクションが表示される', async () => {
    await dataUsagePage.goto()

    const isVisible = await dataUsagePage.isCurrentUsageVisible()
    expect(isVisible).toBe(true)
  })

  test('使用量推移セクションが表示される', async () => {
    await dataUsagePage.goto()

    const isVisible = await dataUsagePage.isUsageChartVisible()
    expect(isVisible).toBe(true)
  })

  test('データチャージ履歴セクションが表示される', async () => {
    await dataUsagePage.goto()

    const isVisible = await dataUsagePage.isChargeHistoryVisible()
    expect(isVisible).toBe(true)
  })

  test('マイページに戻るリンクが表示される', async () => {
    await dataUsagePage.goto()

    const hasLink = await dataUsagePage.hasBackLink()
    expect(hasLink).toBe(true)
  })
})

test.describe('請求・支払い情報ページ (EC-278)', () => {
  let billingPage: BillingPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    billingPage = new BillingPage(page)
  })

  test('請求・支払い情報ページにアクセスするとタイトルが表示される', async () => {
    await billingPage.goto()

    const title = await billingPage.getPageTitle()
    expect(title).toBe('請求・支払い情報')
  })

  test('今月の請求予定額セクションが表示される', async () => {
    await billingPage.goto()

    const isVisible = await billingPage.isBillingSummaryVisible()
    expect(isVisible).toBe(true)
  })

  test('請求履歴セクションが表示される', async () => {
    await billingPage.goto()

    const isVisible = await billingPage.isBillingHistoryVisible()
    expect(isVisible).toBe(true)
  })

  test('マイページに戻るリンクが表示される', async () => {
    await billingPage.goto()

    const hasLink = await billingPage.hasBackLink()
    expect(hasLink).toBe(true)
  })
})

test.describe('アカウント設定ページ (EC-278)', () => {
  let settingsPage: SettingsPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    settingsPage = new SettingsPage(page)
  })

  test('アカウント設定ページにアクセスするとタイトルが表示される', async () => {
    await settingsPage.goto()

    const title = await settingsPage.getPageTitle()
    expect(title).toBe('アカウント設定')
  })

  test('連絡先情報セクションが表示される', async () => {
    await settingsPage.goto()

    const isVisible = await settingsPage.isContactInfoVisible()
    expect(isVisible).toBe(true)
  })

  test('パスワード変更セクションが表示される', async () => {
    await settingsPage.goto()

    const isVisible = await settingsPage.isPasswordSectionVisible()
    expect(isVisible).toBe(true)
  })

  test('通知設定セクションが表示される', async () => {
    await settingsPage.goto()

    const isVisible = await settingsPage.isNotificationSettingsVisible()
    expect(isVisible).toBe(true)
  })

  test('メールアドレスがプリフィルされている', async () => {
    await settingsPage.goto()

    const email = await settingsPage.getEmailValue()
    expect(email).toBe('test@docomo.ne.jp')
  })

  test('電話番号がプリフィルされている', async () => {
    await settingsPage.goto()

    const phone = await settingsPage.getPhoneValue()
    expect(phone).toBe('090-1234-5678')
  })

  test('マイページに戻るリンクが表示される', async () => {
    await settingsPage.goto()

    const hasLink = await settingsPage.hasBackLink()
    expect(hasLink).toBe(true)
  })
})

test.describe('プラン変更ページ (EC-278)', () => {
  let planPage: PlanPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    planPage = new PlanPage(page)
  })

  test('プラン変更ページにアクセスするとタイトルが表示される', async () => {
    await planPage.goto()

    const title = await planPage.getPageTitle()
    expect(title).toBe('プラン変更')
  })

  test('マイページに戻るリンクが表示される', async () => {
    await planPage.goto()

    const hasLink = await planPage.hasBackLink()
    expect(hasLink).toBe(true)
  })
})

test.describe('オプション管理ページ (EC-278)', () => {
  let optionsPage: OptionsPage

  test.beforeEach(async ({ page }) => {
    await setupAuthState(page)
    optionsPage = new OptionsPage(page)
  })

  test('オプション管理ページにアクセスするとタイトルが表示される', async () => {
    await optionsPage.goto()

    const title = await optionsPage.getPageTitle()
    expect(title).toBe('オプション管理')
  })

  test('契約中のオプションセクションが表示される', async () => {
    await optionsPage.goto()

    const isVisible = await optionsPage.isCurrentOptionsVisible()
    expect(isVisible).toBe(true)
  })

  test('追加可能なオプションセクションが表示される', async () => {
    await optionsPage.goto()

    const isVisible = await optionsPage.isAvailableOptionsVisible()
    expect(isVisible).toBe(true)
  })

  test('マイページに戻るリンクが表示される', async () => {
    await optionsPage.goto()

    const hasLink = await optionsPage.hasBackLink()
    expect(hasLink).toBe(true)
  })
})

test.describe('未認証アクセス (EC-278)', () => {
  test('未認証でマイページにアクセスするとログインページにリダイレクトされる', async ({
    page,
  }) => {
    await page.goto('/mypage')

    await page.waitForURL('/login')
    expect(page.url()).toContain('/login')
  })
})

test.describe('レスポンシブデザイン (EC-278)', () => {
  test('モバイルサイズでダッシュボードが正しく表示される', async ({ page }) => {
    await setupAuthState(page)
    await page.setViewportSize({ width: 375, height: 667 })

    const dashboardPage = new MypageDashboardPage(page)
    await dashboardPage.goto()

    const title = await dashboardPage.getPageTitle()
    expect(title).toBe('マイページ')

    const isContractVisible = await dashboardPage.isContractSectionVisible()
    expect(isContractVisible).toBe(true)
  })

  test('タブレットサイズでダッシュボードが正しく表示される', async ({ page }) => {
    await setupAuthState(page)
    await page.setViewportSize({ width: 768, height: 1024 })

    const dashboardPage = new MypageDashboardPage(page)
    await dashboardPage.goto()

    const title = await dashboardPage.getPageTitle()
    expect(title).toBe('マイページ')

    const isContractVisible = await dashboardPage.isContractSectionVisible()
    expect(isContractVisible).toBe(true)
  })

  test('モバイルサイズで契約情報ページが正しく表示される', async ({ page }) => {
    await setupAuthState(page)
    await page.setViewportSize({ width: 375, height: 667 })

    const contractPage = new ContractPage(page)
    await contractPage.goto()

    const title = await contractPage.getPageTitle()
    expect(title).toBe('契約情報')

    const hasLink = await contractPage.hasBackLink()
    expect(hasLink).toBe(true)
  })

  test('モバイルサイズで請求情報ページが正しく表示される', async ({ page }) => {
    await setupAuthState(page)
    await page.setViewportSize({ width: 375, height: 667 })

    const billingPage = new BillingPage(page)
    await billingPage.goto()

    const title = await billingPage.getPageTitle()
    expect(title).toBe('請求・支払い情報')
  })
})
