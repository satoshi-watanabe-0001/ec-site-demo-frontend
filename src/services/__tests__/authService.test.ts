/**
 * @fileoverview authServiceのユニットテスト
 * @module services/__tests__/authService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

// Mock @lib/env before importing the service
jest.mock('@/lib/env', () => ({
  config: {
    api: {
      baseURL: 'http://localhost:8080',
    },
  },
}))

import { login } from '../authService'
import type { LoginRequest, LoginResponse } from '@/types'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('authService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('login', () => {
    test('login_WithValidCredentials_ShouldReturnLoginResponse', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      }
      const mockResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'bearer',
        expiresIn: 900,
        user: {
          id: 'user-001',
          email: 'test@example.com',
          roles: ['user'],
          mfaEnabled: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await login(credentials)

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      expect(result).toEqual(mockResponse)
    })

    test('login_WithRememberMe_ShouldIncludeRememberMeInRequest', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      }
      const mockResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'bearer',
        expiresIn: 900,
        user: {
          id: 'user-001',
          email: 'test@example.com',
          roles: ['user'],
          mfaEnabled: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await login(credentials)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(credentials),
        })
      )
    })

    test('login_WhenUnauthorized_ShouldThrowErrorWithMessage', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            message: 'メールアドレスまたはパスワードが正しくありません',
          }),
      })

      // Act & Assert
      await expect(login(credentials)).rejects.toThrow(
        'メールアドレスまたはパスワードが正しくありません'
      )
    })

    test('login_WhenServerError_ShouldThrowDefaultErrorMessage', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('JSON parse error')),
      })

      // Act & Assert
      await expect(login(credentials)).rejects.toThrow('ログインに失敗しました')
    })

    test('login_WhenErrorResponseHasNoMessage_ShouldThrowDefaultErrorMessage', async () => {
      // Arrange
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(login(credentials)).rejects.toThrow('ログインに失敗しました')
    })
  })
})
