/**
 * @fileoverview mypageServiceのユニットテスト
 * @module services/__tests__/mypageService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  AvailableOption,
  NotificationPreferences,
  SettingsUpdateResponse,
  PlanChangeResponse,
  OptionChangeResponse,
} from '@/types'
import {
  getDashboardData,
  getContractDetails,
  getDataUsage,
  getBillingInfo,
  getAvailableOptions,
  getNotificationPreferences,
  updateProfile,
  changePassword,
  updateNotificationPreferences,
  changePlan,
  manageOption,
} from '@/services/mypageService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  FETCH_FAILED: 'データの取得に失敗しました。',
  UPDATE_FAILED: '更新に失敗しました。',
} as const

const mockContractInfo: ContractInfo = {
  userId: 'user-001',
  phoneNumber: '090-1234-5678',
  contractDate: '2023-01-15',
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    freeCallIncluded: true,
  },
  options: [],
  contractorName: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  simType: 'eSIM',
}

const mockDataUsage: DataUsage = {
  currentUsage: 8.5,
  remaining: 11.5,
  totalCapacity: 20,
  lastUpdated: '2024-01-15T10:00:00Z',
  dailyUsage: [],
  monthlyHistory: [],
}

const mockBillingInfo: BillingInfo = {
  currentMonthEstimate: {
    month: '2024-01',
    basicFee: 2970,
    callFee: 0,
    optionFee: 0,
    discount: 0,
    totalAmount: 2970,
    items: [{ itemName: '基本料金', amount: 2970 }],
    isConfirmed: false,
  },
  history: [],
  paymentMethod: {
    type: 'credit_card',
    displayName: 'VISA ****1234',
    expiryDate: '12/25',
  },
}

const mockDashboardData: DashboardData = {
  contract: mockContractInfo,
  dataUsage: mockDataUsage,
  billing: mockBillingInfo,
  device: null,
  notifications: [],
}

const mockAvailableOptions: AvailableOption[] = [
  {
    optionId: 'opt-001',
    optionName: 'かけ放題オプション',
    monthlyFee: 1100,
    description: '国内通話かけ放題',
    category: 'call',
    isSubscribed: false,
  },
]

const mockNotificationPreferences: NotificationPreferences = {
  emailNotification: true,
  campaignNotification: true,
  billingNotification: true,
  dataUsageAlert: true,
  dataUsageAlertThreshold: 80,
}

const mockSettingsResponse: SettingsUpdateResponse = {
  success: true,
  message: '更新が完了しました。',
}

const mockPlanChangeResponse: PlanChangeResponse = {
  success: true,
  message: 'プラン変更が完了しました。',
  effectiveDate: '2024-02-01',
}

const mockOptionChangeResponse: OptionChangeResponse = {
  success: true,
  message: 'オプションを追加しました。',
}

describe('mypageService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getDashboardData', () => {
    test('getDashboardData_WithSuccessResponse_ShouldReturnDashboardData', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDashboardData),
      })

      const result = await getDashboardData()

      expect(result).toEqual(mockDashboardData)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/dashboard',
        expect.objectContaining({ cache: 'no-store' })
      )
    })

    test('getDashboardData_WithServerError_ShouldThrowServerError', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(getDashboardData()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDashboardData_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(getDashboardData()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('getDashboardData_WithApiErrorMessage_ShouldThrowApiMessage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '認証エラーが発生しました' }),
      })

      await expect(getDashboardData()).rejects.toThrow('認証エラーが発生しました')
    })

    test('getDashboardData_WithEmptyErrorMessage_ShouldThrowFetchFailed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '' }),
      })

      await expect(getDashboardData()).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED)
    })
  })

  describe('getContractDetails', () => {
    test('getContractDetails_WithSuccessResponse_ShouldReturnContractInfo', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContractInfo),
      })

      const result = await getContractDetails()

      expect(result).toEqual(mockContractInfo)
    })

    test('getContractDetails_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(getContractDetails()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getDataUsage', () => {
    test('getDataUsage_WithSuccessResponse_ShouldReturnDataUsage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDataUsage),
      })

      const result = await getDataUsage()

      expect(result).toEqual(mockDataUsage)
    })

    test('getDataUsage_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getBillingInfo', () => {
    test('getBillingInfo_WithSuccessResponse_ShouldReturnBillingInfo', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBillingInfo),
      })

      const result = await getBillingInfo()

      expect(result).toEqual(mockBillingInfo)
    })

    test('getBillingInfo_WithServerError_ShouldThrowServerError', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ message: '' }),
      })

      await expect(getBillingInfo()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  describe('getAvailableOptions', () => {
    test('getAvailableOptions_WithSuccessResponse_ShouldReturnOptions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAvailableOptions),
      })

      const result = await getAvailableOptions()

      expect(result).toEqual(mockAvailableOptions)
    })

    test('getAvailableOptions_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new Error('network error'))

      await expect(getAvailableOptions()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getNotificationPreferences', () => {
    test('getNotificationPreferences_WithSuccessResponse_ShouldReturnPreferences', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNotificationPreferences),
      })

      const result = await getNotificationPreferences()

      expect(result).toEqual(mockNotificationPreferences)
    })

    test('getNotificationPreferences_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(getNotificationPreferences()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('updateProfile', () => {
    test('updateProfile_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSettingsResponse),
      })

      const result = await updateProfile({ name: 'テスト太郎', email: 'new@docomo.ne.jp' })

      expect(result).toEqual(mockSettingsResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/settings/profile',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'テスト太郎', email: 'new@docomo.ne.jp' }),
        })
      )
    })

    test('updateProfile_WithServerError_ShouldThrowServerError', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('parse error')),
      })

      await expect(updateProfile({ name: 'テスト太郎' })).rejects.toThrow(
        ERROR_MESSAGES.SERVER_ERROR
      )
    })

    test('updateProfile_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(updateProfile({ name: 'テスト太郎' })).rejects.toThrow(
        ERROR_MESSAGES.NETWORK_ERROR
      )
    })
  })

  describe('changePassword', () => {
    test('changePassword_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSettingsResponse),
      })

      const result = await changePassword({
        currentPassword: 'old123',
        newPassword: 'new123',
      })

      expect(result).toEqual(mockSettingsResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/settings/password',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('changePassword_WithApiError_ShouldThrowApiMessage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '現在のパスワードが正しくありません' }),
      })

      await expect(
        changePassword({ currentPassword: 'wrong', newPassword: 'new123' })
      ).rejects.toThrow('現在のパスワードが正しくありません')
    })
  })

  describe('updateNotificationPreferences', () => {
    test('updateNotificationPreferences_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSettingsResponse),
      })

      const result = await updateNotificationPreferences(mockNotificationPreferences)

      expect(result).toEqual(mockSettingsResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/settings/notifications',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('updateNotificationPreferences_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(updateNotificationPreferences(mockNotificationPreferences)).rejects.toThrow(
        ERROR_MESSAGES.NETWORK_ERROR
      )
    })
  })

  describe('changePlan', () => {
    test('changePlan_WithValidRequest_ShouldReturnPlanChangeResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPlanChangeResponse),
      })

      const result = await changePlan({ newPlanId: 'ahamo-large' })

      expect(result).toEqual(mockPlanChangeResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/plan',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPlanId: 'ahamo-large' }),
        })
      )
    })

    test('changePlan_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(changePlan({ newPlanId: 'ahamo-large' })).rejects.toThrow(
        ERROR_MESSAGES.NETWORK_ERROR
      )
    })
  })

  describe('manageOption', () => {
    test('manageOption_WithAddAction_ShouldReturnSuccessResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOptionChangeResponse),
      })

      const result = await manageOption({ optionId: 'opt-001', action: 'add' })

      expect(result).toEqual(mockOptionChangeResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/options',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ optionId: 'opt-001', action: 'add' }),
        })
      )
    })

    test('manageOption_WithRemoveAction_ShouldReturnSuccessResponse', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'オプションを解除しました。' }),
      })

      const result = await manageOption({ optionId: 'opt-001', action: 'remove' })

      expect(result.success).toBe(true)
    })

    test('manageOption_WithNetworkError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(manageOption({ optionId: 'opt-001', action: 'add' })).rejects.toThrow(
        ERROR_MESSAGES.NETWORK_ERROR
      )
    })

    test('manageOption_WithCORSError_ShouldThrowNetworkError', async () => {
      mockFetch.mockRejectedValueOnce(new Error('cors error'))

      await expect(manageOption({ optionId: 'opt-001', action: 'add' })).rejects.toThrow(
        ERROR_MESSAGES.NETWORK_ERROR
      )
    })
  })
})
