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
  getContractDetail,
  getDataUsageDetail,
  getBillingDetail,
  getAccountSettings,
  updateAccountSettings,
  changePassword,
  getAvailablePlans,
  changePlan,
  getAvailableOptions,
  enrollOption,
  cancelOption,
} from '@/services/accountService'
import type {
  DashboardResponse,
  ContractDetailResponse,
  DataUsageDetailResponse,
  BillingDetailResponse,
  AccountSettingsResponse,
  PlansResponse,
  OptionsResponse,
  ApiSuccessResponse,
} from '@/types/account'

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
  UNAUTHORIZED: '認証が必要です。再度ログインしてください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

/**
 * モックダッシュボードレスポンス
 */
const mockDashboardResponse: DashboardResponse = {
  plan: {
    planId: 'ahamo-20',
    planName: 'ahamo',
    monthlyPrice: 2970,
    dataCapacity: 20,
    contractStartDate: '2023-04-01',
    status: 'active',
  },
  dataUsage: {
    usedData: 12.5,
    remainingData: 7.5,
    totalData: 20,
    updatedAt: '2024-03-01T10:00:00Z',
  },
  billing: {
    currentMonth: 3470,
    billingDate: '2024-03-25',
    paymentMethod: 'クレジットカード（VISA **** 1234）',
    paymentStatus: 'paid',
  },
  device: {
    deviceId: 'dev-001',
    deviceName: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    purchaseDate: '2024-03-15',
    imei: '123456789012345',
    installmentRemaining: 20,
    installmentMonthly: 3520,
  },
  notifications: [
    {
      id: 'n1',
      title: 'テスト通知',
      message: 'テストメッセージ',
      type: 'info',
      isRead: false,
      createdAt: '2024-03-01T10:00:00Z',
    },
  ],
}

const mockSuccessResponse: ApiSuccessResponse = {
  status: 'success',
  message: '正常に更新されました',
}

describe('accountService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  // ============================================================
  // getDashboard
  // ============================================================

  describe('getDashboard', () => {
    test('getDashboard_WithValidAuth_ShouldReturnDashboardData', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockDashboardResponse),
      })

      // Act
      const result = await getDashboard()

      // Assert
      expect(result).toEqual(mockDashboardResponse)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    test('getDashboard_WithValidAuth_ShouldCallCorrectEndpoint', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockDashboardResponse),
      })

      // Act
      await getDashboard()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/dashboard',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          }),
        })
      )
    })

    test('getDashboard_With401Response_ShouldThrowUnauthorizedError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED)
    })

    test('getDashboard_With500Response_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDashboard_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('getDashboard_WithCORSError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('getDashboard_WithTimeoutError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ============================================================
  // getContractDetail
  // ============================================================

  describe('getContractDetail', () => {
    const mockContract: ContractDetailResponse = {
      plan: {
        planId: 'ahamo-20',
        planName: 'ahamo',
        monthlyPrice: 2970,
        dataCapacity: 20,
        contractStartDate: '2023-04-01',
        status: 'active',
      },
      phoneNumber: '090-1234-5678',
      device: {
        deviceId: 'dev-001',
        deviceName: 'iPhone 15 Pro',
        manufacturer: 'Apple',
        purchaseDate: '2024-03-15',
        imei: '123456789012345',
        installmentRemaining: 20,
        installmentMonthly: 3520,
      },
      sim: { simType: 'eSIM', iccid: '8981100000000000001' },
      options: [
        {
          optionId: 'opt-1',
          optionName: 'かけ放題',
          monthlyPrice: 1100,
          enrolledDate: '2023-04-01',
        },
      ],
    }

    test('getContractDetail_WithValidAuth_ShouldReturnContractData', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockContract),
      })

      // Act
      const result = await getContractDetail()

      // Assert
      expect(result).toEqual(mockContract)
    })

    test('getContractDetail_WithValidAuth_ShouldCallCorrectEndpoint', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockContract),
      })

      // Act
      await getContractDetail()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/contract',
        expect.anything()
      )
    })
  })

  // ============================================================
  // getDataUsageDetail
  // ============================================================

  describe('getDataUsageDetail', () => {
    const mockDataUsage: DataUsageDetailResponse = {
      current: {
        usedData: 12.5,
        remainingData: 7.5,
        totalData: 20,
        updatedAt: '2024-03-01T10:00:00Z',
      },
      dailyHistory: [],
      monthlyHistory: [],
    }

    test('getDataUsageDetail_WithValidAuth_ShouldReturnDataUsage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockDataUsage),
      })

      // Act
      const result = await getDataUsageDetail()

      // Assert
      expect(result).toEqual(mockDataUsage)
    })
  })

  // ============================================================
  // getBillingDetail
  // ============================================================

  describe('getBillingDetail', () => {
    const mockBilling: BillingDetailResponse = {
      summary: {
        currentMonth: 3470,
        billingDate: '2024-03-25',
        paymentMethod: 'クレジットカード',
        paymentStatus: 'paid',
      },
      breakdown: [],
      history: [],
    }

    test('getBillingDetail_WithValidAuth_ShouldReturnBillingData', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBilling),
      })

      // Act
      const result = await getBillingDetail()

      // Assert
      expect(result).toEqual(mockBilling)
    })
  })

  // ============================================================
  // getAccountSettings
  // ============================================================

  describe('getAccountSettings', () => {
    const mockSettings: AccountSettingsResponse = {
      email: 'test@docomo.ne.jp',
      name: 'テストユーザー',
      phoneNumber: '090-1234-5678',
      notifications: {
        email: true,
        sms: true,
        dataWarning: true,
        billing: true,
      },
    }

    test('getAccountSettings_WithValidAuth_ShouldReturnSettings', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSettings),
      })

      // Act
      const result = await getAccountSettings()

      // Assert
      expect(result).toEqual(mockSettings)
    })
  })

  // ============================================================
  // updateAccountSettings
  // ============================================================

  describe('updateAccountSettings', () => {
    test('updateAccountSettings_WithValidData_ShouldCallPutEndpoint', async () => {
      // Arrange
      const updateData = {
        name: '新しい名前',
        email: 'new@docomo.ne.jp',
        notifications: { email: true, sms: false, dataWarning: true, billing: true },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      await updateAccountSettings(updateData)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/settings',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      )
    })

    test('updateAccountSettings_WithValidData_ShouldReturnSuccess', async () => {
      // Arrange
      const updateData = {
        name: '新しい名前',
        email: 'test@docomo.ne.jp',
        notifications: { email: true, sms: true, dataWarning: true, billing: true },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      const result = await updateAccountSettings(updateData)

      // Assert
      expect(result.status).toBe('success')
    })
  })

  // ============================================================
  // changePassword
  // ============================================================

  describe('changePassword', () => {
    test('changePassword_WithValidData_ShouldCallPutEndpoint', async () => {
      // Arrange
      const passwordData = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass456',
        confirmPassword: 'newpass456',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      await changePassword(passwordData)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/password',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(passwordData),
        })
      )
    })
  })

  // ============================================================
  // getAvailablePlans
  // ============================================================

  describe('getAvailablePlans', () => {
    const mockPlans: PlansResponse = {
      currentPlanId: 'ahamo-20',
      plans: [
        {
          planId: 'ahamo-20',
          planName: 'ahamo',
          monthlyPrice: 2970,
          dataCapacity: 20,
          description: '20GBプラン',
          features: ['5分間通話無料'],
          isCurrent: true,
        },
      ],
    }

    test('getAvailablePlans_WithValidAuth_ShouldReturnPlans', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPlans),
      })

      // Act
      const result = await getAvailablePlans()

      // Assert
      expect(result).toEqual(mockPlans)
    })
  })

  // ============================================================
  // changePlan
  // ============================================================

  describe('changePlan', () => {
    test('changePlan_WithValidPlanId_ShouldCallPutEndpoint', async () => {
      // Arrange
      const planData = { planId: 'ahamo-100' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      await changePlan(planData)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/plan',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(planData),
        })
      )
    })
  })

  // ============================================================
  // getAvailableOptions
  // ============================================================

  describe('getAvailableOptions', () => {
    const mockOptions: OptionsResponse = {
      options: [
        {
          optionId: 'opt-1',
          optionName: 'かけ放題',
          monthlyPrice: 1100,
          description: '国内通話が24時間かけ放題',
          category: '通話',
          isEnrolled: true,
        },
      ],
    }

    test('getAvailableOptions_WithValidAuth_ShouldReturnOptions', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockOptions),
      })

      // Act
      const result = await getAvailableOptions()

      // Assert
      expect(result).toEqual(mockOptions)
    })
  })

  // ============================================================
  // enrollOption
  // ============================================================

  describe('enrollOption', () => {
    test('enrollOption_WithValidOptionId_ShouldCallPostEndpoint', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      await enrollOption('opt-2')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-2',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  // ============================================================
  // cancelOption
  // ============================================================

  describe('cancelOption', () => {
    test('cancelOption_WithValidOptionId_ShouldCallDeleteEndpoint', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockSuccessResponse),
      })

      // Act
      await cancelOption('opt-1')

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/opt-1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  // ============================================================
  // エラーハンドリング共通テスト
  // ============================================================

  describe('エラーハンドリング', () => {
    test('apiRequest_With400Response_ShouldThrowErrorWithMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'バリデーションエラー' }),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow('バリデーションエラー')
    })

    test('apiRequest_With400ResponseNoMessage_ShouldThrowUnexpectedError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNEXPECTED_ERROR)
    })

    test('apiRequest_With400ResponseInvalidJson_ShouldThrowUnexpectedError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNEXPECTED_ERROR)
    })

    test('apiRequest_WithUnknownError_ShouldThrowUnexpectedError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce('文字列エラー')

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.UNEXPECTED_ERROR)
    })
  })
})
