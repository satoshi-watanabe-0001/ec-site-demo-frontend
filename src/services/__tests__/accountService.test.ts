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
  getProfile,
  updateProfile,
  changePassword,
  getContract,
  getCurrentPlan,
  changePlan,
  getOptions,
  addOption,
  removeOption,
  getNotifications,
  getNotificationSettings,
  updateNotificationSettings,
  getDevices,
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
} as const

describe('accountService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  // ========================================
  // getProfile
  // ========================================
  describe('getProfile', () => {
    test('getProfile_WithSuccessfulResponse_ShouldReturnUserProfile', async () => {
      // Arrange
      const mockProfile = {
        userId: 'user-001',
        name: 'テストユーザー',
        email: 'test@docomo.ne.jp',
        phoneNumber: '090-1234-5678',
        dateOfBirth: '1990-01-15',
        address: {
          postalCode: '100-0001',
          prefecture: '東京都',
          city: '千代田区',
          street: '1-1-1',
          building: 'テストビル',
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-06-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      })

      // Act
      const result = await getProfile()

      // Assert
      expect(result).toEqual(mockProfile)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/profile',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('getProfile_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getProfile()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getProfile_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getProfile()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ========================================
  // updateProfile
  // ========================================
  describe('updateProfile', () => {
    test('updateProfile_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const request = {
        name: '更新ユーザー',
        email: 'updated@docomo.ne.jp',
        phoneNumber: '090-9999-8888',
      }
      const mockResponse = { status: 'success', message: 'プロフィールを更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updateProfile(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/profile',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(request),
        })
      )
    })

    test('updateProfile_WithErrorResponse_ShouldThrowErrorMessage', async () => {
      // Arrange
      const request = { name: 'test' }
      const errorResponse = { message: 'メールアドレスの形式が不正です' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(updateProfile(request)).rejects.toThrow('メールアドレスの形式が不正です')
    })
  })

  // ========================================
  // changePassword
  // ========================================
  describe('changePassword', () => {
    test('changePassword_WithValidPasswords_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const request = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass456',
        confirmPassword: 'newpass456',
      }
      const mockResponse = { status: 'success', message: 'パスワードを変更しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await changePassword(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/password',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(request),
        })
      )
    })
  })

  // ========================================
  // getContract
  // ========================================
  describe('getContract', () => {
    test('getContract_WithSuccessfulResponse_ShouldReturnContractDetail', async () => {
      // Arrange
      const mockContract = {
        contractId: 'CT-001',
        planName: 'ahamo',
        contractStartDate: '2024-01-01',
        status: 'active',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContract),
      })

      // Act
      const result = await getContract()

      // Assert
      expect(result).toEqual(mockContract)
    })
  })

  // ========================================
  // getCurrentPlan
  // ========================================
  describe('getCurrentPlan', () => {
    test('getCurrentPlan_WithSuccessfulResponse_ShouldReturnPlansResponse', async () => {
      // Arrange
      const mockPlans = { currentPlan: { planId: 'ahamo', planName: 'ahamo' }, availablePlans: [] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPlans),
      })

      // Act
      const result = await getCurrentPlan()

      // Assert
      expect(result).toEqual(mockPlans)
    })
  })

  // ========================================
  // changePlan
  // ========================================
  describe('changePlan', () => {
    test('changePlan_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const request = { planId: 'ahamo-large', effectiveDate: '2026-04-01' }
      const mockResponse = { status: 'success', message: 'プラン変更を受け付けました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await changePlan(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/plan',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(request),
        })
      )
    })
  })

  // ========================================
  // getOptions
  // ========================================
  describe('getOptions', () => {
    test('getOptions_WithSuccessfulResponse_ShouldReturnOptionsResponse', async () => {
      // Arrange
      const mockOptions = {
        subscribedOptions: [],
        availableOptions: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOptions),
      })

      // Act
      const result = await getOptions()

      // Assert
      expect(result).toEqual(mockOptions)
    })
  })

  // ========================================
  // addOption / removeOption
  // ========================================
  describe('addOption', () => {
    test('addOption_WithValidId_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const mockResponse = { status: 'success', message: 'オプションを追加しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await addOption('opt-001')

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-001',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  describe('removeOption', () => {
    test('removeOption_WithValidId_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const mockResponse = { status: 'success', message: 'オプションを解除しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await removeOption('opt-001')

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-001',
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  // ========================================
  // getNotifications
  // ========================================
  describe('getNotifications', () => {
    test('getNotifications_WithSuccessfulResponse_ShouldReturnNotificationsResponse', async () => {
      // Arrange
      const mockNotifications = {
        notifications: [],
        unreadCount: 0,
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNotifications),
      })

      // Act
      const result = await getNotifications()

      // Assert
      expect(result).toEqual(mockNotifications)
    })
  })

  // ========================================
  // getNotificationSettings
  // ========================================
  describe('getNotificationSettings', () => {
    test('getNotificationSettings_WithSuccessfulResponse_ShouldReturnSettings', async () => {
      // Arrange
      const mockSettings = {
        emailNotification: true,
        smsNotification: false,
        pushNotification: true,
        campaignInfo: true,
        billingNotification: true,
        dataUsageAlert: true,
        dataUsageAlertThreshold: 80,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSettings),
      })

      // Act
      const result = await getNotificationSettings()

      // Assert
      expect(result).toEqual(mockSettings)
    })
  })

  // ========================================
  // updateNotificationSettings
  // ========================================
  describe('updateNotificationSettings', () => {
    test('updateNotificationSettings_WithValidSettings_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const settings = {
        emailNotification: true,
        smsNotification: true,
        pushNotification: false,
        campaignInfo: false,
        billingNotification: true,
        dataUsageAlert: true,
        dataUsageAlertThreshold: 90,
      }
      const mockResponse = { status: 'success', message: '通知設定を更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updateNotificationSettings(settings)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/notification-settings',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(settings),
        })
      )
    })
  })

  // ========================================
  // getDevices
  // ========================================
  describe('getDevices', () => {
    test('getDevices_WithSuccessfulResponse_ShouldReturnDevicesResponse', async () => {
      // Arrange
      const mockDevices = {
        devices: [{ deviceId: 'dev-001', deviceName: 'iPhone 16 Pro' }],
        totalCount: 1,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDevices),
      })

      // Act
      const result = await getDevices()

      // Assert
      expect(result).toEqual(mockDevices)
    })
  })

  // ========================================
  // エラーハンドリング共通テスト
  // ========================================
  describe('エラーハンドリング', () => {
    test('fetchWithErrorHandling_WithErrorResponseMessage_ShouldThrowCustomMessage', async () => {
      // Arrange
      const errorResponse = { message: 'カスタムエラーメッセージ' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(getProfile()).rejects.toThrow('カスタムエラーメッセージ')
    })

    test('fetchWithErrorHandling_WithCORSError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(getProfile()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('fetchWithErrorHandling_WithTimeoutError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(getProfile()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('fetchWithErrorHandling_WithEmptyErrorResponse_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ status: 'error' }),
      })

      // Act & Assert
      await expect(getProfile()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })
})
