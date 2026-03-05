/**
 * @fileoverview accountServiceのユニットテスト
 * @module services/__tests__/accountService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getDashboard,
  getContract,
  getDataUsage,
  getBilling,
  updateProfile,
  changePassword,
  getPlans,
  changePlan,
  getOptions,
  subscribeOption,
  unsubscribeOption,
} from '@/services/accountService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

/**
 * エラーメッセージの定数（accountService.tsと同じ）
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  UNAUTHORIZED: '認証が必要です。再度ログインしてください。',
} as const

/**
 * テスト用のlocalStorage認証状態をセットアップ
 */
function setupAuth(): void {
  const authState = {
    state: {
      isAuthenticated: true,
      user: { id: 'user-001', name: 'テストユーザー', email: 'test@docomo.ne.jp' },
    },
  }
  localStorage.setItem('auth-storage', JSON.stringify(authState))
}

/**
 * テスト用のlocalStorage認証状態をクリア
 */
function clearAuth(): void {
  localStorage.removeItem('auth-storage')
}

describe('accountService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    clearAuth()
  })

  describe('getDashboard', () => {
    test('getDashboard_WithAuth_ShouldReturnDashboardData', async () => {
      // Arrange
      setupAuth()
      const mockData = {
        currentPlan: { name: 'ahamo', price: 2970, dataCapacity: 20 },
        dataUsageSummary: { usedGb: 8.5, totalGb: 20 },
        billingSummary: { currentMonthTotal: 2970, lastMonthTotal: 2970, difference: 0 },
        notifications: [],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getDashboard()

      // Assert
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('getDashboard_WithAuth_ShouldSendAuthorizationHeader', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ status: 'success', data: { currentPlan: {}, notifications: [] } }),
      })

      // Act
      await getDashboard()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/dashboard',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      )
    })

    test('getDashboard_WithoutAuth_ShouldThrowUnauthorizedError', async () => {
      // Arrange - no auth setup

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    test('getDashboard_WithServerError_ShouldThrowServerError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal Server Error' }),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow('Internal Server Error')
    })

    test('getDashboard_WithNetworkError_ShouldThrowNetworkError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('getDashboard_WithServerErrorAndNoJson_ShouldThrowServerError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDashboard_WithClientErrorAndNoJson_ShouldThrowUnexpectedError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNEXPECTED_ERROR)
    })
  })

  describe('getContract', () => {
    test('getContract_WithAuth_ShouldReturnContractInfo', async () => {
      // Arrange
      setupAuth()
      const mockData = {
        name: '山田太郎',
        phoneNumber: '090-1234-5678',
        email: 'test@docomo.ne.jp',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getContract()

      // Assert
      expect(result).toEqual(mockData)
    })

    test('getContract_WithoutAuth_ShouldThrowUnauthorizedError', async () => {
      // Act & Assert
      await expect(getContract()).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED)
    })
  })

  describe('getDataUsage', () => {
    test('getDataUsage_WithAuth_ShouldReturnDataUsage', async () => {
      // Arrange
      setupAuth()
      const mockData = { usedGb: 12.5, totalGb: 20, dailyUsage: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getDataUsage()

      // Assert
      expect(result).toEqual(mockData)
    })
  })

  describe('getBilling', () => {
    test('getBilling_WithAuth_ShouldReturnBillingInfo', async () => {
      // Arrange
      setupAuth()
      const mockData = { totalAmount: 2970, paymentMethod: { type: 'credit_card' } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getBilling()

      // Assert
      expect(result).toEqual(mockData)
    })
  })

  describe('updateProfile', () => {
    test('updateProfile_WithValidData_ShouldReturnSuccessMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'プロフィールを更新しました。' }),
      })

      // Act
      const result = await updateProfile({ email: 'new@docomo.ne.jp' })

      // Assert
      expect(result).toBe('プロフィールを更新しました。')
    })

    test('updateProfile_WithValidData_ShouldSendPatchRequest', async () => {
      // Arrange
      setupAuth()
      const data = { email: 'new@docomo.ne.jp', phone: '090-9876-5432' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'プロフィールを更新しました。' }),
      })

      // Act
      await updateProfile(data)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/profile',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      )
    })

    test('updateProfile_WithServerError_ShouldThrowError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ status: 'error', message: 'バリデーションエラー' }),
      })

      // Act & Assert
      await expect(updateProfile({ email: 'invalid' })).rejects.toThrow('バリデーションエラー')
    })

    test('updateProfile_WithNoMessage_ShouldReturnDefaultMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })

      // Act
      const result = await updateProfile({ email: 'new@docomo.ne.jp' })

      // Assert
      expect(result).toBe('プロフィールを更新しました。')
    })
  })

  describe('changePassword', () => {
    test('changePassword_WithValidData_ShouldReturnSuccessMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'パスワードを変更しました。' }),
      })

      // Act
      const result = await changePassword({
        currentPassword: 'old123',
        newPassword: 'new456',
        confirmPassword: 'new456',
      })

      // Assert
      expect(result).toBe('パスワードを変更しました。')
    })

    test('changePassword_WithServerError_ShouldThrowError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({ status: 'error', message: '現在のパスワードが正しくありません' }),
      })

      // Act & Assert
      await expect(
        changePassword({
          currentPassword: 'wrong',
          newPassword: 'new456',
          confirmPassword: 'new456',
        })
      ).rejects.toThrow('現在のパスワードが正しくありません')
    })

    test('changePassword_WithNoMessage_ShouldReturnDefaultMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })

      // Act
      const result = await changePassword({
        currentPassword: 'old123',
        newPassword: 'new456',
        confirmPassword: 'new456',
      })

      // Assert
      expect(result).toBe('パスワードを変更しました。')
    })
  })

  describe('getPlans', () => {
    test('getPlans_WithAuth_ShouldReturnPlansList', async () => {
      // Arrange
      setupAuth()
      const mockData = [
        { id: 'ahamo', name: 'ahamo', price: 2970, dataCapacity: 20, isCurrent: true },
        {
          id: 'ahamo-large',
          name: 'ahamo大盛り',
          price: 4950,
          dataCapacity: 100,
          isCurrent: false,
        },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getPlans()

      // Assert
      expect(result).toEqual(mockData)
      expect(result).toHaveLength(2)
    })
  })

  describe('changePlan', () => {
    test('changePlan_WithValidData_ShouldReturnSuccessMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'プラン変更を受け付けました。' }),
      })

      // Act
      const result = await changePlan({ planId: 'ahamo-large', timing: 'next-month' })

      // Assert
      expect(result).toBe('プラン変更を受け付けました。')
    })

    test('changePlan_WithServerError_ShouldThrowError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ status: 'error', message: 'プラン変更に失敗しました' }),
      })

      // Act & Assert
      await expect(changePlan({ planId: 'invalid', timing: 'next-month' })).rejects.toThrow(
        'プラン変更に失敗しました'
      )
    })

    test('changePlan_WithNoMessage_ShouldReturnDefaultMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })

      // Act
      const result = await changePlan({ planId: 'ahamo-large', timing: 'next-month' })

      // Assert
      expect(result).toBe('プラン変更を受け付けました。')
    })
  })

  describe('getOptions', () => {
    test('getOptions_WithAuth_ShouldReturnOptionsList', async () => {
      // Arrange
      setupAuth()
      const mockData = [
        { id: 'opt-1', name: 'かけ放題オプション', monthlyFee: 1100, isSubscribed: true },
        { id: 'opt-2', name: '端末補償', monthlyFee: 825, isSubscribed: false },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', data: mockData }),
      })

      // Act
      const result = await getOptions()

      // Assert
      expect(result).toEqual(mockData)
      expect(result).toHaveLength(2)
    })
  })

  describe('subscribeOption', () => {
    test('subscribeOption_WithValidId_ShouldReturnSuccessMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'オプションを追加しました。' }),
      })

      // Act
      const result = await subscribeOption('opt-2')

      // Assert
      expect(result).toBe('オプションを追加しました。')
    })

    test('subscribeOption_WithValidId_ShouldCallCorrectEndpoint', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'オプションを追加しました。' }),
      })

      // Act
      await subscribeOption('opt-2')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-2/subscribe',
        expect.objectContaining({ method: 'POST' })
      )
    })

    test('subscribeOption_WithServerError_ShouldThrowError', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ status: 'error', message: 'オプション追加に失敗しました' }),
      })

      // Act & Assert
      await expect(subscribeOption('invalid')).rejects.toThrow('オプション追加に失敗しました')
    })

    test('subscribeOption_WithNoMessage_ShouldReturnDefaultMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })

      // Act
      const result = await subscribeOption('opt-2')

      // Assert
      expect(result).toBe('オプションを追加しました。')
    })
  })

  describe('unsubscribeOption', () => {
    test('unsubscribeOption_WithValidId_ShouldReturnSuccessMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'オプションを解除しました。' }),
      })

      // Act
      const result = await unsubscribeOption('opt-1')

      // Assert
      expect(result).toBe('オプションを解除しました。')
    })

    test('unsubscribeOption_WithValidId_ShouldCallCorrectEndpoint', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success', message: 'オプションを解除しました。' }),
      })

      // Act
      await unsubscribeOption('opt-1')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-1/unsubscribe',
        expect.objectContaining({ method: 'POST' })
      )
    })

    test('unsubscribeOption_WithNoMessage_ShouldReturnDefaultMessage', async () => {
      // Arrange
      setupAuth()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      })

      // Act
      const result = await unsubscribeOption('opt-1')

      // Assert
      expect(result).toBe('オプションを解除しました。')
    })
  })

  describe('getAuthToken edge cases', () => {
    test('getDashboard_WithInvalidAuthStorage_ShouldThrowUnauthorized', async () => {
      // Arrange
      localStorage.setItem('auth-storage', 'invalid-json{{{')

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED)
    })

    test('getDashboard_WithUnauthenticatedState_ShouldThrowUnauthorized', async () => {
      // Arrange
      localStorage.setItem('auth-storage', JSON.stringify({ state: { isAuthenticated: false } }))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED)
    })
  })
})
