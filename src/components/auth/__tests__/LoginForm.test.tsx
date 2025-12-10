/**
 * @fileoverview LoginFormコンポーネントのユニットテスト
 * @module components/auth/__tests__/LoginForm.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock auth store
const mockLogin = jest.fn()
jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

// Mock auth service
const mockLoginUser = jest.fn()
jest.mock('@/services/authService', () => ({
  loginUser: (...args: unknown[]) => mockLoginUser(...args),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('レンダリング', () => {
    test('LoginForm_WhenRendered_ShouldDisplayAllFormElements', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByLabelText('パスワード')).toBeInTheDocument()
      expect(screen.getByLabelText('ログイン状態を保持する')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
      expect(screen.getByText('パスワードを忘れた方')).toBeInTheDocument()
      expect(screen.getByText('新規登録')).toBeInTheDocument()
    })

    test('LoginForm_WhenRendered_ShouldHaveCorrectPlaceholders', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      expect(screen.getByPlaceholderText('例: example@docomo.ne.jp')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('パスワードを入力')).toBeInTheDocument()
    })

    test('LoginForm_WhenRendered_ShouldHaveDisabledSubmitButton', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      const submitButton = screen.getByRole('button', { name: 'ログイン' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('バリデーション', () => {
    test('LoginForm_WithEmptyEmail_ShouldShowEmailError', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act - 入力してから削除してバリデーションをトリガー
      const emailInput = screen.getByLabelText('メールアドレス')
      await user.type(emailInput, 'a')
      await user.clear(emailInput)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
      })
    })

    test('LoginForm_WithInvalidEmail_ShouldShowEmailFormatError', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      const emailInput = screen.getByLabelText('メールアドレス')
      await user.type(emailInput, 'invalid-email')

      // Assert
      await waitFor(() => {
        expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
      })
    })

    test('LoginForm_WithEmptyPassword_ShouldShowPasswordError', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act - 入力してから削除してバリデーションをトリガー
      const passwordInput = screen.getByLabelText('パスワード')
      await user.type(passwordInput, 'a')
      await user.clear(passwordInput)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
      })
    })

    test('LoginForm_WithValidInputs_ShouldEnableSubmitButton', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')

      // Assert
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: 'ログイン' })
        expect(submitButton).not.toBeDisabled()
      })
    })
  })

  describe('パスワード表示切替', () => {
    test('LoginForm_WhenToggleClicked_ShouldShowPassword', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      const passwordInput = screen.getByLabelText('パスワード')
      const toggleButton = screen.getByLabelText('パスワードを表示')
      await user.click(toggleButton)

      // Assert
      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    test('LoginForm_WhenToggleClickedTwice_ShouldHidePassword', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      const passwordInput = screen.getByLabelText('パスワード')
      const toggleButton = screen.getByLabelText('パスワードを表示')
      await user.click(toggleButton)
      const hideButton = screen.getByLabelText('パスワードを隠す')
      await user.click(hideButton)

      // Assert
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('ログイン処理', () => {
    test('LoginForm_WhenLoginSuccess_ShouldRedirectToMypage', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockResolvedValueOnce({
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-001',
          email: 'test@docomo.ne.jp',
          roles: ['user'],
          mfaEnabled: false,
        },
      })
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@docomo.ne.jp',
          password: 'password123',
          rememberMe: false,
        })
        expect(mockLogin).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/mypage')
      })
    })

    test('LoginForm_WhenLoginFails_ShouldShowErrorMessage', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockRejectedValueOnce(
        new Error('メールアドレスまたはパスワードが正しくありません')
      )
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText('メールアドレスまたはパスワードが正しくありません')
        ).toBeInTheDocument()
      })
    })

    test('LoginForm_WhenLoginFails_ShouldNotClearFormFields', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockRejectedValueOnce(new Error('ログインに失敗しました'))
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByLabelText('メールアドレス')).toHaveValue('test@docomo.ne.jp')
        expect(screen.getByLabelText('パスワード')).toHaveValue('password123')
      })
    })

    test('LoginForm_WhenSubmitting_ShouldShowLoadingState', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      expect(screen.getByRole('button', { name: 'ログイン中...' })).toBeInTheDocument()
    })

    test('LoginForm_WithRememberMeChecked_ShouldIncludeRememberMeInRequest', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockResolvedValueOnce({
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-001',
          email: 'test@docomo.ne.jp',
          roles: ['user'],
          mfaEnabled: false,
        },
      })
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByLabelText('ログイン状態を保持する'))
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          email: 'test@docomo.ne.jp',
          password: 'password123',
          rememberMe: true,
        })
      })
    })

    test('LoginForm_WhenNonErrorThrown_ShouldShowDefaultErrorMessage', async () => {
      // Arrange
      const user = userEvent.setup()
      mockLoginUser.mockRejectedValueOnce('Unknown error')
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@docomo.ne.jp')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument()
      })
    })
  })

  describe('リンク', () => {
    test('LoginForm_ForgotPasswordLink_ShouldHaveCorrectHref', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      const forgotPasswordLink = screen.getByText('パスワードを忘れた方')
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
    })

    test('LoginForm_SignupLink_ShouldHaveCorrectHref', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      const signupLink = screen.getByText('新規登録')
      expect(signupLink).toHaveAttribute('href', '/signup')
    })
  })
})
