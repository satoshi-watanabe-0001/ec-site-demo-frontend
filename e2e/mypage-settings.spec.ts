/**
 * @fileoverview アカウント設定ページのE2Eテスト
 * @module e2e/mypage-settings.spec
 *
 * EC-278: アカウント管理 - アカウント設定テスト（シナリオ6）
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

class SettingsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/mypage/settings')
  }

  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  async isBackLinkVisible() {
    return this.page.locator('text=マイページに戻る').isVisible()
  }

  async isBasicInfoVisible() {
    return this.page.locator('text=基本情報').isVisible()
  }

  async isNameVisible() {
    return this.page.locator('text=お名前').isVisible()
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

  async clickEditContact() {
    await this.page.locator('text=編集する').click()
  }

  async isEditFormVisible() {
    return this.page.locator('#edit-email').isVisible()
  }

  async fillEmail(email: string) {
    await this.page.locator('#edit-email').fill(email)
  }

  async clickSaveContact() {
    await this.page.locator('text=保存する').click()
  }

  async clickCancelContact() {
    await this.page.locator('button:has-text("キャンセル")').first().click()
  }

  async clickChangePassword() {
    await this.page.locator('text=変更する').click()
  }

  async isPasswordFormVisible() {
    return this.page.locator('#current-password').isVisible()
  }

  async fillCurrentPassword(password: string) {
    await this.page.locator('#current-password').fill(password)
  }

  async fillNewPassword(password: string) {
    await this.page.locator('#new-password').fill(password)
  }

  async fillConfirmPassword(password: string) {
    await this.page.locator('#confirm-password').fill(password)
  }

  async clickSubmitPassword() {
    await this.page.locator('text=パスワードを変更').click()
  }

  async getPasswordError() {
    return this.page.locator('.text-red-400').textContent()
  }

  async isSuccessMessageVisible() {
    return this.page.locator('.text-green-400').isVisible()
  }

  async isEmailToggleVisible() {
    return this.page.locator('button[aria-label="メール通知"]').isVisible()
  }

  async clickBackLink() {
    await this.page.locator('text=マイページに戻る').click()
  }
}

test.describe('アカウント設定ページ (EC-278)', () => {
  let loginPage: LoginPage
  let settingsPage: SettingsPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    settingsPage = new SettingsPage(page)
  })

  test.describe('シナリオ6: アカウント設定表示', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('アカウント設定ページが正しく表示される', async () => {
      await settingsPage.goto()
      const title = await settingsPage.getPageTitle()
      expect(title).toBe('アカウント設定')
    })

    test('マイページに戻るリンクが表示される', async () => {
      await settingsPage.goto()
      const isVisible = await settingsPage.isBackLinkVisible()
      expect(isVisible).toBe(true)
    })

    test('基本情報セクションが表示される', async () => {
      await settingsPage.goto()
      const isVisible = await settingsPage.isBasicInfoVisible()
      expect(isVisible).toBe(true)
    })

    test('お名前が表示される', async () => {
      await settingsPage.goto()
      const isVisible = await settingsPage.isNameVisible()
      expect(isVisible).toBe(true)
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

    test('通知トグルが表示される', async () => {
      await settingsPage.goto()
      const isVisible = await settingsPage.isEmailToggleVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('連絡先情報の編集', () => {
    test.beforeEach(async () => {
      await loginPage.login()
      await settingsPage.goto()
    })

    test('編集ボタンをクリックすると編集フォームが表示される', async () => {
      await settingsPage.clickEditContact()
      const isVisible = await settingsPage.isEditFormVisible()
      expect(isVisible).toBe(true)
    })

    test('キャンセルボタンをクリックすると編集モードが解除される', async () => {
      await settingsPage.clickEditContact()
      await settingsPage.clickCancelContact()
      const isVisible = await settingsPage.isEditFormVisible()
      expect(isVisible).toBe(false)
    })

    test('連絡先情報を保存すると成功メッセージが表示される', async () => {
      await settingsPage.clickEditContact()
      await settingsPage.fillEmail('new@docomo.ne.jp')
      await settingsPage.clickSaveContact()
      const isVisible = await settingsPage.isSuccessMessageVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('パスワード変更', () => {
    test.beforeEach(async () => {
      await loginPage.login()
      await settingsPage.goto()
    })

    test('変更するボタンをクリックするとパスワードフォームが表示される', async () => {
      await settingsPage.clickChangePassword()
      const isVisible = await settingsPage.isPasswordFormVisible()
      expect(isVisible).toBe(true)
    })

    test('パスワード不一致時にエラーメッセージが表示される', async () => {
      await settingsPage.clickChangePassword()
      await settingsPage.fillCurrentPassword('password123')
      await settingsPage.fillNewPassword('newpassword1')
      await settingsPage.fillConfirmPassword('newpassword2')
      await settingsPage.clickSubmitPassword()

      const error = await settingsPage.getPasswordError()
      expect(error).toContain('一致しません')
    })

    test('パスワードが短すぎる場合にエラーメッセージが表示される', async () => {
      await settingsPage.clickChangePassword()
      await settingsPage.fillCurrentPassword('password123')
      await settingsPage.fillNewPassword('short')
      await settingsPage.fillConfirmPassword('short')
      await settingsPage.clickSubmitPassword()

      const error = await settingsPage.getPasswordError()
      expect(error).toContain('8文字以上')
    })
  })

  test.describe('ナビゲーション', () => {
    test.beforeEach(async () => {
      await loginPage.login()
    })

    test('マイページに戻るリンクをクリックするとダッシュボードに遷移する', async ({ page }) => {
      await settingsPage.goto()
      await settingsPage.clickBackLink()
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })
  })
})
