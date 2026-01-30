/**
 * @fileoverview アカウント設定ページのE2Eテスト
 * @module e2e/mypage/settings.spec
 *
 * EC-278: アカウント管理機能
 * シナリオ6: アカウント設定変更
 * シナリオ9: 通知設定管理
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * アカウント設定ページのPage Object
 */
class SettingsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /** アカウント設定ページに移動 */
  async goto() {
    await this.page.goto('/mypage/settings')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** 連絡先情報セクションが表示されているか */
  async isContactInfoVisible() {
    return this.page.locator('text=連絡先情報').isVisible()
  }

  /** パスワード変更セクションが表示されているか */
  async isPasswordChangeVisible() {
    return this.page.locator('text=パスワード変更').isVisible()
  }

  /** 通知設定セクションが表示されているか */
  async isNotificationSettingsVisible() {
    return this.page.locator('text=通知設定').isVisible()
  }

  /** メールアドレス入力フィールドが表示されているか */
  async isEmailFieldVisible() {
    return this.page.locator('input[type="email"]').isVisible()
  }

  /** 電話番号入力フィールドが表示されているか */
  async isPhoneFieldVisible() {
    return this.page.locator('input[type="tel"]').isVisible()
  }

  /** パスワード変更フォームを展開 */
  async expandPasswordChangeForm() {
    await this.page.locator('button:has-text("パスワードを変更する")').click()
  }

  /** 現在のパスワードを入力 */
  async fillCurrentPassword(password: string) {
    await this.page.locator('input[placeholder="現在のパスワード"]').fill(password)
  }

  /** 新しいパスワードを入力 */
  async fillNewPassword(password: string) {
    await this.page.locator('input[placeholder="新しいパスワード"]').fill(password)
  }

  /** パスワード確認を入力 */
  async fillConfirmPassword(password: string) {
    await this.page.locator('input[placeholder="新しいパスワード（確認）"]').fill(password)
  }

  /** パスワード変更ボタンをクリック */
  async clickChangePasswordButton() {
    await this.page.locator('button:has-text("変更する")').click()
  }

  /** 連絡先情報保存ボタンをクリック */
  async clickSaveContactInfoButton() {
    await this.page.locator('button:has-text("保存")').first().click()
  }

  /** 通知設定保存ボタンをクリック */
  async clickSaveNotificationSettingsButton() {
    await this.page.locator('button:has-text("設定を保存")').click()
  }

  /** メール通知トグルが表示されているか */
  async isEmailNotificationToggleVisible() {
    return this.page.locator('text=メール通知').isVisible()
  }

  /** プッシュ通知トグルが表示されているか */
  async isPushNotificationToggleVisible() {
    return this.page.locator('text=プッシュ通知').isVisible()
  }

  /** SMS通知トグルが表示されているか */
  async isSmsNotificationToggleVisible() {
    return this.page.locator('text=SMS通知').isVisible()
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

test.describe('アカウント設定ページ (EC-278)', () => {
  let settingsPage: SettingsPage

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page)
    await loginAsTestUser(page)
    await settingsPage.goto()
  })

  test.describe('ページ表示', () => {
    test('アカウント設定ページにアクセスするとページタイトルが表示される', async () => {
      // Assert
      const title = await settingsPage.getPageTitle()
      expect(title).toBe('アカウント設定')
    })

    test('連絡先情報セクションが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isContactInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('パスワード変更セクションが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isPasswordChangeVisible()
      expect(isVisible).toBe(true)
    })

    test('通知設定セクションが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isNotificationSettingsVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('連絡先情報', () => {
    test('メールアドレス入力フィールドが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isEmailFieldVisible()
      expect(isVisible).toBe(true)
    })

    test('電話番号入力フィールドが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isPhoneFieldVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('通知設定', () => {
    test('メール通知トグルが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isEmailNotificationToggleVisible()
      expect(isVisible).toBe(true)
    })

    test('プッシュ通知トグルが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isPushNotificationToggleVisible()
      expect(isVisible).toBe(true)
    })

    test('SMS通知トグルが表示される', async () => {
      // Assert
      const isVisible = await settingsPage.isSmsNotificationToggleVisible()
      expect(isVisible).toBe(true)
    })
  })
})
