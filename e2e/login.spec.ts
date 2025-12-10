/**
 * @fileoverview ログインページのE2Eテスト
 * @module e2e/login.spec
 *
 * EC-273: ログイン画面機能
 *
 * organization-standards準拠:
 * - Page Object Modelパターン
 * - 明示的待機（sleepではなく要素の出現を待つ）
 * - テストの独立性
 * - 失敗時のスクリーンショット（Playwright設定で自動）
 */

import { test, expect, type Page } from '@playwright/test'

/**
 * ログインページのPage Object
 * UIの変更に強い構造を提供
 */
class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /** ページに移動 */
  async goto() {
    await this.page.goto('/login')
  }

  /** ページタイトルを取得 */
  async getPageTitle() {
    return this.page.locator('h1').textContent()
  }

  /** メールアドレスを入力 */
  async fillEmail(email: string) {
    await this.page.locator('#email').fill(email)
  }

  /** パスワードを入力 */
  async fillPassword(password: string) {
    await this.page.locator('#password').fill(password)
  }

  /** ログイン状態を保持するチェックボックスをクリック */
  async checkRememberMe() {
    await this.page.locator('#rememberMe').check()
  }

  /** ログインボタンをクリック */
  async clickLoginButton() {
    await this.page.locator('button[type="submit"]').click()
  }

  /** ログインボタンが有効かどうか */
  async isLoginButtonEnabled() {
    return this.page.locator('button[type="submit"]').isEnabled()
  }

  /** パスワード表示/非表示ボタンをクリック */
  async clickPasswordToggle() {
    await this.page.locator('button[aria-label*="パスワード"]').click()
  }

  /** パスワードフィールドのタイプを取得 */
  async getPasswordFieldType() {
    return this.page.locator('#password').getAttribute('type')
  }

  /** エラーメッセージを取得 */
  async getErrorMessage() {
    return this.page.locator('[role="alert"]').first().textContent()
  }

  /** エラーメッセージが表示されているか */
  async isErrorMessageVisible() {
    return this.page.locator('[role="alert"]').first().isVisible()
  }

  /** メールアドレスのバリデーションエラーを取得 */
  async getEmailValidationError() {
    return this.page.locator('#email-error').textContent()
  }

  /** パスワードのバリデーションエラーを取得 */
  async getPasswordValidationError() {
    return this.page.locator('#password-error').textContent()
  }

  /** パスワードを忘れた方リンクが表示されているか */
  async hasForgotPasswordLink() {
    return this.page.locator('a:has-text("パスワードを忘れた方")').isVisible()
  }

  /** 新規登録リンクが表示されているか */
  async hasSignupLink() {
    return this.page.locator('a:has-text("新規登録")').isVisible()
  }

  /** ログイン状態を保持するチェックボックスがチェックされているか */
  async isRememberMeChecked() {
    return this.page.locator('#rememberMe').isChecked()
  }

  /** メールアドレスフィールドの値を取得 */
  async getEmailValue() {
    return this.page.locator('#email').inputValue()
  }

  /** パスワードフィールドの値を取得 */
  async getPasswordValue() {
    return this.page.locator('#password').inputValue()
  }

  /** 過去ログインアカウント一覧が表示されているか */
  async isRecentAccountsListVisible() {
    return this.page.locator('text=過去にログインしたアカウント').isVisible()
  }

  /** 過去ログインアカウントの数を取得 */
  async getRecentAccountsCount() {
    return this.page.locator('[aria-label$="でログイン"]').count()
  }

  /** 指定したメールアドレスの過去ログインアカウントをクリック */
  async clickRecentAccount(email: string) {
    await this.page.locator(`[aria-label="${email}でログイン"]`).click()
  }

  /** 指定したメールアドレスの過去ログインアカウントの削除ボタンをクリック */
  async removeRecentAccount(email: string) {
    const accountItem = this.page.locator(`[aria-label="${email}でログイン"]`)
    await accountItem.hover()
    await this.page.locator(`[aria-label="${email}を履歴から削除"]`).click()
  }

  /** 指定したメールアドレスの過去ログインアカウントが存在するか */
  async hasRecentAccount(email: string) {
    return this.page.locator(`[aria-label="${email}でログイン"]`).isVisible()
  }
}

/**
 * ヘッダーのPage Object
 */
class HeaderPage {
  constructor(private page: Page) {}

  /** ログインボタンをクリック */
  async clickLoginButton() {
    await this.page.locator('a[href="/login"]').click()
  }

  /** マイページボタンが表示されているか */
  async isMyPageButtonVisible() {
    return this.page.locator('a[href="/mypage"]').isVisible()
  }

  /** ログインボタンが表示されているか */
  async isLoginButtonVisible() {
    return this.page.locator('a[href="/login"]').isVisible()
  }
}

test.describe('ログインページ (EC-273)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test.describe('ページ表示', () => {
    test('ログインページにアクセスするとページタイトルが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const title = await loginPage.getPageTitle()
      expect(title).toBe('ログイン')
    })

    test('パスワードを忘れた方リンクが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const hasLink = await loginPage.hasForgotPasswordLink()
      expect(hasLink).toBe(true)
    })

    test('新規登録リンクが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const hasLink = await loginPage.hasSignupLink()
      expect(hasLink).toBe(true)
    })
  })

  test.describe('フォームバリデーション', () => {
    test('空のフォームではログインボタンが無効', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled()
      expect(isEnabled).toBe(false)
    })

    test('メールアドレスのみ入力してもログインボタンが無効', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.fillEmail('test@docomo.ne.jp')

      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled()
      expect(isEnabled).toBe(false)
    })

    test('パスワードのみ入力してもログインボタンが無効', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.fillPassword('password123')

      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled()
      expect(isEnabled).toBe(false)
    })

    test('有効なメールアドレスとパスワードを入力するとログインボタンが有効', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.fillEmail('test@docomo.ne.jp')
      await loginPage.fillPassword('password123')

      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled()
      expect(isEnabled).toBe(true)
    })

    test('無効なメールアドレス形式ではログインボタンが無効', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.fillEmail('invalid-email')
      await loginPage.fillPassword('password123')

      // Assert
      const isEnabled = await loginPage.isLoginButtonEnabled()
      expect(isEnabled).toBe(false)
    })
  })

  test.describe('パスワード表示/非表示', () => {
    test('初期状態ではパスワードが非表示', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const type = await loginPage.getPasswordFieldType()
      expect(type).toBe('password')
    })

    test('トグルボタンをクリックするとパスワードが表示される', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.clickPasswordToggle()

      // Assert
      const type = await loginPage.getPasswordFieldType()
      expect(type).toBe('text')
    })

    test('トグルボタンを再度クリックするとパスワードが非表示になる', async () => {
      // Arrange
      await loginPage.goto()
      await loginPage.clickPasswordToggle()

      // Act
      await loginPage.clickPasswordToggle()

      // Assert
      const type = await loginPage.getPasswordFieldType()
      expect(type).toBe('password')
    })
  })

  test.describe('ログイン状態を保持する', () => {
    test('初期状態ではチェックボックスが未チェック', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const isChecked = await loginPage.isRememberMeChecked()
      expect(isChecked).toBe(false)
    })

    test('チェックボックスをクリックするとチェックされる', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.checkRememberMe()

      // Assert
      const isChecked = await loginPage.isRememberMeChecked()
      expect(isChecked).toBe(true)
    })
  })

  test.describe('ログイン成功フロー', () => {
    test('有効な認証情報でログインするとマイページにリダイレクトされる', async ({ page }) => {
      // Arrange
      await loginPage.goto()
      await loginPage.fillEmail('test@docomo.ne.jp')
      await loginPage.fillPassword('password123')

      // Act
      await loginPage.clickLoginButton()

      // Assert
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })

    test('ログイン成功後、ヘッダーにマイページボタンが表示される', async ({ page }) => {
      // Arrange
      const headerPage = new HeaderPage(page)
      await loginPage.goto()
      await loginPage.fillEmail('test@docomo.ne.jp')
      await loginPage.fillPassword('password123')

      // Act
      await loginPage.clickLoginButton()
      await page.waitForURL('/mypage')

      // Assert
      const isVisible = await headerPage.isMyPageButtonVisible()
      expect(isVisible).toBe(true)
    })
  })

  test.describe('ログイン失敗フロー', () => {
    test('無効な認証情報でログインするとエラーメッセージが表示される', async () => {
      // Arrange
      await loginPage.goto()
      await loginPage.fillEmail('wrong@docomo.ne.jp')
      await loginPage.fillPassword('wrongpassword')

      // Act
      await loginPage.clickLoginButton()

      // Assert
      await expect(loginPage.page.locator('[role="alert"]').first()).toBeVisible()
      const errorMessage = await loginPage.getErrorMessage()
      expect(errorMessage).toContain('メールアドレスまたはパスワードが正しくありません')
    })

    test('ログイン失敗後もフォームフィールドの値が保持される', async () => {
      // Arrange
      const email = 'wrong@docomo.ne.jp'
      const password = 'wrongpassword'
      await loginPage.goto()
      await loginPage.fillEmail(email)
      await loginPage.fillPassword(password)

      // Act
      await loginPage.clickLoginButton()
      await expect(loginPage.page.locator('[role="alert"]').first()).toBeVisible()

      // Assert
      const emailValue = await loginPage.getEmailValue()
      const passwordValue = await loginPage.getPasswordValue()
      expect(emailValue).toBe(email)
      expect(passwordValue).toBe(password)
    })

    test('アカウントロック時に適切なエラーメッセージが表示される', async () => {
      // Arrange
      await loginPage.goto()
      await loginPage.fillEmail('locked@docomo.ne.jp')
      await loginPage.fillPassword('password123')

      // Act
      await loginPage.clickLoginButton()

      // Assert
      await expect(loginPage.page.locator('[role="alert"]').first()).toBeVisible()
      const errorMessage = await loginPage.getErrorMessage()
      expect(errorMessage).toContain('アカウントがロックされています')
    })
  })
})

test.describe('ヘッダーからログインページへの遷移 (EC-273)', () => {
  test('ヘッダーのログインボタンからログインページに遷移できる', async ({ page }) => {
    // Arrange
    const headerPage = new HeaderPage(page)
    const loginPage = new LoginPage(page)

    // Act
    await page.goto('/')
    await headerPage.clickLoginButton()

    // Assert
    await page.waitForURL('/login')
    const title = await loginPage.getPageTitle()
    expect(title).toBe('ログイン')
  })
})

test.describe('レスポンシブデザイン (EC-273)', () => {
  test('モバイルサイズでログインフォームが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 })
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.goto()

    // Assert
    const title = await loginPage.getPageTitle()
    expect(title).toBe('ログイン')
    const hasSignupLink = await loginPage.hasSignupLink()
    expect(hasSignupLink).toBe(true)
  })

  test('タブレットサイズでログインフォームが正しく表示される', async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 768, height: 1024 })
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.goto()

    // Assert
    const title = await loginPage.getPageTitle()
    expect(title).toBe('ログイン')
    const hasSignupLink = await loginPage.hasSignupLink()
    expect(hasSignupLink).toBe(true)
  })
})

test.describe('過去ログインアカウント選択機能 (EC-273)', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test.describe('アカウント一覧表示', () => {
    test('ログインページに過去ログインアカウント一覧が表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const isVisible = await loginPage.isRecentAccountsListVisible()
      expect(isVisible).toBe(true)
    })

    test('開発環境では初期で2つのアカウントが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const count = await loginPage.getRecentAccountsCount()
      expect(count).toBe(2)
    })

    test('test@docomo.ne.jpアカウントが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const hasAccount = await loginPage.hasRecentAccount('test@docomo.ne.jp')
      expect(hasAccount).toBe(true)
    })

    test('demo@docomo.ne.jpアカウントが表示される', async () => {
      // Arrange & Act
      await loginPage.goto()

      // Assert
      const hasAccount = await loginPage.hasRecentAccount('demo@docomo.ne.jp')
      expect(hasAccount).toBe(true)
    })
  })

  test.describe('アカウント選択によるメールアドレス自動入力', () => {
    test('過去ログインアカウントをクリックするとメールアドレスが自動入力される', async () => {
      // Arrange
      await loginPage.goto()

      // Act
      await loginPage.clickRecentAccount('test@docomo.ne.jp')

      // Assert
      const emailValue = await loginPage.getEmailValue()
      expect(emailValue).toBe('test@docomo.ne.jp')
    })

    test('別のアカウントをクリックするとメールアドレスが更新される', async () => {
      // Arrange
      await loginPage.goto()
      await loginPage.clickRecentAccount('test@docomo.ne.jp')

      // Act
      await loginPage.clickRecentAccount('demo@docomo.ne.jp')

      // Assert
      const emailValue = await loginPage.getEmailValue()
      expect(emailValue).toBe('demo@docomo.ne.jp')
    })

    test('アカウント選択後にパスワードを入力してログインできる', async ({ page }) => {
      // Arrange
      await loginPage.goto()
      await loginPage.clickRecentAccount('test@docomo.ne.jp')

      // Act
      await loginPage.fillPassword('password123')
      await loginPage.clickLoginButton()

      // Assert
      await page.waitForURL('/mypage')
      expect(page.url()).toContain('/mypage')
    })
  })

  test.describe('アカウント削除', () => {
    test('アカウントの削除ボタンをクリックするとアカウントが削除される', async () => {
      // Arrange
      await loginPage.goto()
      const initialCount = await loginPage.getRecentAccountsCount()

      // Act
      await loginPage.removeRecentAccount('demo@docomo.ne.jp')

      // Assert
      const hasAccount = await loginPage.hasRecentAccount('demo@docomo.ne.jp')
      expect(hasAccount).toBe(false)
      const newCount = await loginPage.getRecentAccountsCount()
      expect(newCount).toBe(initialCount - 1)
    })
  })
})

test.describe('キーボードナビゲーション (EC-273)', () => {
  test('Tabキーでフォーム要素間を移動できる', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    // Act & Assert
    await page.keyboard.press('Tab')
    await expect(page.locator('#email')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('#password')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('button[aria-label*="パスワード"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('#rememberMe')).toBeFocused()
  })

  test('Enterキーでフォームを送信できる', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.fillEmail('test@docomo.ne.jp')
    await loginPage.fillPassword('password123')

    // Act
    await page.keyboard.press('Enter')

    // Assert
    await page.waitForURL('/mypage')
    expect(page.url()).toContain('/mypage')
  })
})
