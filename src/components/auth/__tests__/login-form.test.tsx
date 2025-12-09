/**
 * @fileoverview LoginFormコンポーネントのユニットテスト
 * @module components/auth/__tests__/login-form.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../login-form'

// モック設定
const mockPush = jest.fn()
const mockLogin = jest.fn()
const mockApiLogin = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    login: mockLogin,
  }),
}))

jest.mock('@/services/authService', () => ({
  login: (...args: unknown[]) => mockApiLogin(...args),
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
    })

    test('LoginForm_WhenRendered_ShouldDisplaySignupLink', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      expect(screen.getByText('新規登録')).toBeInTheDocument()
      expect(screen.getByText('新規登録').closest('a')).toHaveAttribute('href', '/signup')
    })

    test('LoginForm_WhenRendered_ShouldHaveCorrectInputTypes', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText('パスワード')).toHaveAttribute('type', 'password')
    })
  })

  describe('パスワード表示トグル', () => {
    test('LoginForm_WhenToggleClicked_ShouldShowPassword', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)
      const toggleButton = screen.getByRole('button', { name: 'パスワードを表示' })

      // Act
      await user.click(toggleButton)

      // Assert
      expect(screen.getByLabelText('パスワード')).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: 'パスワードを隠す' })).toBeInTheDocument()
    })

    test('LoginForm_WhenToggleClickedTwice_ShouldHidePassword', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)
      const toggleButton = screen.getByRole('button', { name: 'パスワードを表示' })

      // Act
      await user.click(toggleButton)
      await user.click(screen.getByRole('button', { name: 'パスワードを隠す' }))

      // Assert
      expect(screen.getByLabelText('パスワード')).toHaveAttribute('type', 'password')
    })
  })

  describe('バリデーション', () => {
    test('LoginForm_WithEmptyEmail_ShouldShowValidationError', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
      })
    })

    test('LoginForm_WithEmptyPassword_ShouldShowValidationError', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument()
      })
    })
  })

  describe('フォーム送信', () => {
    test('LoginForm_WithValidCredentials_ShouldCallApi', async () => {
      // Arrange
      const user = userEvent.setup()
      mockApiLogin.mockResolvedValueOnce({
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        tokenType: 'bearer',
        expiresIn: 900,
        user: {
          id: 'user-1',
          email: 'test@example.com',
          roles: ['user'],
          mfaEnabled: false,
        },
      })
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(mockApiLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        })
      })
    })

    test('LoginForm_WithRememberMeChecked_ShouldIncludeRememberMeInRequest', async () => {
      // Arrange
      const user = userEvent.setup()
      mockApiLogin.mockResolvedValueOnce({
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        tokenType: 'bearer',
        expiresIn: 900,
        user: {
          id: 'user-1',
          email: 'test@example.com',
          roles: ['user'],
          mfaEnabled: false,
        },
      })
      render(<LoginForm />)

      // Act
      await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
      await user.type(screen.getByLabelText('パスワード'), 'password123')
      await user.click(screen.getByLabelText('ログイン状態を保持する'))
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(mockApiLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: true,
        })
      })
    })
  })

  describe('アクセシビリティ', () => {
    test('LoginForm_WithValidationError_ShouldHaveAriaInvalid', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<LoginForm />)

      // Act
      await user.click(screen.getByRole('button', { name: 'ログイン' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByLabelText('メールアドレス')).toHaveAttribute('aria-invalid', 'true')
      })
    })

    test('LoginForm_SubmitButton_ShouldHaveCorrectType', () => {
      // Arrange & Act
      render(<LoginForm />)

      // Assert
      expect(screen.getByRole('button', { name: 'ログイン' })).toHaveAttribute('type', 'submit')
    })
  })
})
