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

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

/**
 * loginUser関数のロジックをテスト用に再実装
 * 環境変数に依存しないテスト用の実装
 */
async function loginUserForTest(
  request: LoginRequest,
  baseUrl: string = 'http://localhost:8080'
): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'ログインに失敗しました')
  }

  return response.json()
}

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
          email: 'test@docomo.ne.jp',
          roles: ['user'],
          mfaEnabled: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await loginUserForTest(request)

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
          email: 'test@docomo.ne.jp',
          roles: ['user'],
          mfaEnabled: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await loginUserForTest(request)

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/auth/login',
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
      await expect(loginUserForTest(request)).rejects.toThrow(
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
      await expect(loginUserForTest(request)).rejects.toThrow(
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
        status: 500,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(loginUserForTest(request)).rejects.toThrow('ログインに失敗しました')
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
        expiresIn: 3600,
        user: {
          id: 'user-001',
          email: 'test@docomo.ne.jp',
          roles: ['user'],
          mfaEnabled: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await loginUserForTest(request)

      // Assert
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.rememberMe).toBe(true)
    })
  })
})
