/**
 * @fileoverview 認証バリデーションスキーマのユニットテスト
 * @module lib/validations/__tests__/auth.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { loginSchema, type LoginFormValues } from '../auth'

describe('loginSchema', () => {
  describe('email', () => {
    test('loginSchema_WithValidEmail_ShouldPass', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(true)
    })

    test('loginSchema_WithEmptyEmail_ShouldFail', () => {
      // Arrange
      const input = {
        email: '',
        password: 'password123',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスを入力してください')
      }
    })

    test('loginSchema_WithInvalidEmail_ShouldFail', () => {
      // Arrange
      const input = {
        email: 'invalid-email',
        password: 'password123',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('有効なメールアドレスを入力してください')
      }
    })
  })

  describe('password', () => {
    test('loginSchema_WithValidPassword_ShouldPass', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(true)
    })

    test('loginSchema_WithEmptyPassword_ShouldFail', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: '',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('パスワードを入力してください')
      }
    })
  })

  describe('rememberMe', () => {
    test('loginSchema_WithRememberMeTrue_ShouldPass', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rememberMe).toBe(true)
      }
    })

    test('loginSchema_WithRememberMeFalse_ShouldPass', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rememberMe).toBe(false)
      }
    })

    test('loginSchema_WithoutRememberMe_ShouldDefaultToFalse', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
      }

      // Act
      const result = loginSchema.safeParse(input)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.rememberMe).toBe(false)
      }
    })
  })

  describe('型推論', () => {
    test('loginSchema_ParsedData_ShouldMatchLoginFormValuesType', () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      }

      // Act
      const result = loginSchema.parse(input)

      // Assert - 型チェックが通ることを確認
      const typedResult: LoginFormValues = result
      expect(typedResult.email).toBe('test@example.com')
      expect(typedResult.password).toBe('password123')
      expect(typedResult.rememberMe).toBe(true)
    })
  })
})
