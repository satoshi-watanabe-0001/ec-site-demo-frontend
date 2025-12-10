/**
 * @fileoverview authServiceのユニットテスト
 * @module services/__tests__/authService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { LoginRequest, LoginResponse } from '@/types'
import { loginUser } from '@/services/authService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

/**
 * エラーメッセージの定数（authService.tsと同じ）
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  LOGIN_FAILED: 'ログインに失敗しました。',
} as const

describe('authService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('loginUser', () => {
    test('loginUser_WithValidCredentials_ShouldReturnLoginResponse', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      const mockResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-001',
          name: 'テストユーザー',
          email: 'test@docomo.ne.jp',
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await loginUser(request)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('loginUser_WithValidCredentials_ShouldCallFetchWithCorrectParams', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: true,
      }
      const mockResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'user-001',
          name: 'テストユーザー',
          email: 'test@docomo.ne.jp',
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await loginUser(request)

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      )
    })

    test('loginUser_WithInvalidCredentials_ShouldThrowError', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'wrongpassword',
        rememberMe: false,
      }
      const errorResponse = {
        status: 'error',
        message: 'メールアドレスまたはパスワードが正しくありません',
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(
        'メールアドレスまたはパスワードが正しくありません'
      )
    })

    test('loginUser_WithLockedAccount_ShouldThrowError', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'locked@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      const errorResponse = {
        status: 'error',
        message: 'アカウントがロックされています。しばらく経ってから再度お試しください',
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(
        'アカウントがロックされています。しばらく経ってから再度お試しください'
      )
    })

    test('loginUser_WithEmptyErrorMessage_ShouldThrowDefaultError', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      const errorResponse = {
        status: 'error',
        message: '',
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.LOGIN_FAILED)
    })

    test('loginUser_WithRememberMeTrue_ShouldIncludeRememberMeInRequest', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: true,
      }
      const mockResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 25200,
        user: {
          id: 'user-001',
          name: 'テストユーザー',
          email: 'test@docomo.ne.jp',
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await loginUser(request)

      // Assert
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.rememberMe).toBe(true)
    })

    test('loginUser_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('loginUser_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('loginUser_WithServerErrorAndEmptyMessage_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      const errorResponse = {
        status: 'error',
        message: '',
        timestamp: '2024-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('loginUser_WithCORSError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('loginUser_WithTimeoutError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      const request: LoginRequest = {
        email: 'test@docomo.ne.jp',
        password: 'password123',
        rememberMe: false,
      }
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(loginUser(request)).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
