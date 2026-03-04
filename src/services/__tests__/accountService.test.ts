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
  getContractInfo,
  getDataUsageDetail,
  getBillingDetail,
  updateProfile,
  changePassword,
  getNotificationSettings,
  updateNotificationSettings,
  changePlan,
  getOptions,
  addOption,
  cancelOption,
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

  // ========== getDashboard ==========
  describe('getDashboard', () => {
    test('getDashboard_正常時_ダッシュボードデータを返す', async () => {
      // Arrange
      const mockResponse = {
        contract: { planName: 'ahamo', monthlyFee: 2970, dataCapacity: 20 },
        dataUsage: {
          usedAmount: 12.5,
          remainingAmount: 7.5,
          totalCapacity: 20,
          lastUpdated: '2024-01-15T10:00:00Z',
          usagePercentage: 62.5,
        },
        billing: {
          billingMonth: '2024-01',
          basicFee: 2970,
          callCharges: 0,
          optionCharges: 0,
          totalAmount: 2970,
          previousMonthDiff: 0,
          paymentStatus: 'pending',
        },
        device: {
          deviceName: 'iPhone 15',
          imageUrl: '/images/iphone15.png',
          purchaseDate: '2023-09-22',
          paymentStatus: '分割払い中（残り18回）',
          remainingPayment: 54000,
        },
        notifications: { unreadCount: 2, items: [] },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getDashboard()

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/account/dashboard', {
        cache: 'no-store',
      })
    })

    test('getDashboard_APIエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      const errorResponse = { message: 'ダッシュボードデータの取得に失敗しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow('ダッシュボードデータの取得に失敗しました。')
    })

    test('getDashboard_ネットワークエラー時_ネットワークエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ========== getContractInfo ==========
  describe('getContractInfo', () => {
    test('getContractInfo_正常時_契約情報を返す', async () => {
      // Arrange
      const mockResponse = {
        userId: 'user-001',
        name: '田中 太郎',
        nameKana: 'タナカ タロウ',
        dateOfBirth: '1990-01-15',
        postalCode: '100-0001',
        address: '東京都千代田区千代田1-1-1',
        phoneNumber: '090-1234-5678',
        email: 'test@docomo.ne.jp',
        contractPhoneNumber: '090-1234-5678',
        contractDate: '2021-03-26',
        currentPlanId: 'ahamo-basic',
        currentPlanName: 'ahamo',
        activeOptions: ['かけ放題オプション'],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getContractInfo()

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/account/contract', {
        cache: 'no-store',
      })
    })

    test('getContractInfo_サーバーエラー時_サーバーエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getContractInfo()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  // ========== getDataUsageDetail ==========
  describe('getDataUsageDetail', () => {
    test('getDataUsageDetail_正常時_データ使用量詳細を返す', async () => {
      // Arrange
      const mockResponse = {
        summary: {
          usedAmount: 12.5,
          remainingAmount: 7.5,
          totalCapacity: 20,
          lastUpdated: '2024-01-15T10:00:00Z',
          usagePercentage: 62.5,
        },
        dailyUsage: [{ date: '2024-01-01', amount: 0.5 }],
        monthlyUsage: [{ month: '2024-01', amount: 12.5, capacity: 20 }],
        chargeHistory: [],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getDataUsageDetail()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getDataUsageDetail_APIエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'データ使用量の取得に失敗しました。' }),
      })

      // Act & Assert
      await expect(getDataUsageDetail()).rejects.toThrow('データ使用量の取得に失敗しました。')
    })
  })

  // ========== getBillingDetail ==========
  describe('getBillingDetail', () => {
    test('getBillingDetail_正常時_請求情報を返す', async () => {
      // Arrange
      const mockResponse = {
        currentBilling: {
          billingMonth: '2024-01',
          basicFee: 2970,
          callCharges: 0,
          optionCharges: 0,
          totalAmount: 2970,
          previousMonthDiff: 0,
          paymentStatus: 'pending',
        },
        billingHistory: [],
        paymentMethods: [],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getBillingDetail()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getBillingDetail_ネットワークエラー時_エラーをスロー', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('network error'))

      // Act & Assert
      await expect(getBillingDetail()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ========== updateProfile ==========
  describe('updateProfile', () => {
    test('updateProfile_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const request = { email: 'new@docomo.ne.jp', phoneNumber: '090-9876-5432' }
      const mockResponse = { status: 'success', message: '連絡先情報を更新しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updateProfile(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    })

    test('updateProfile_APIエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      const request = { email: 'invalid' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '連絡先情報の更新に失敗しました。' }),
      })

      // Act & Assert
      await expect(updateProfile(request)).rejects.toThrow('連絡先情報の更新に失敗しました。')
    })
  })

  // ========== changePassword ==========
  describe('changePassword', () => {
    test('changePassword_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const request = {
        currentPassword: 'password123',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456',
      }
      const mockResponse = { status: 'success', message: 'パスワードを変更しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await changePassword(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    })

    test('changePassword_サーバーエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      const request = {
        currentPassword: 'wrong',
        newPassword: 'new',
        confirmPassword: 'new',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: '' }),
      })

      // Act & Assert
      await expect(changePassword(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  // ========== getNotificationSettings ==========
  describe('getNotificationSettings', () => {
    test('getNotificationSettings_正常時_通知設定を返す', async () => {
      // Arrange
      const mockResponse = {
        emailEnabled: true,
        smsEnabled: false,
        categories: [
          { categoryId: 'billing', name: '請求・料金', enabled: true },
          { categoryId: 'campaign', name: 'キャンペーン', enabled: false },
        ],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getNotificationSettings()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getNotificationSettings_エラー時_エラーをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ message: '通知設定の取得に失敗しました。' }),
      })

      // Act & Assert
      await expect(getNotificationSettings()).rejects.toThrow('通知設定の取得に失敗しました。')
    })
  })

  // ========== updateNotificationSettings ==========
  describe('updateNotificationSettings', () => {
    test('updateNotificationSettings_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const settings = {
        emailEnabled: true,
        smsEnabled: true,
        categories: [{ categoryId: 'billing', name: '請求・料金', enabled: true }],
      }
      const mockResponse = { status: 'success', message: '通知設定を更新しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updateNotificationSettings(settings)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/notifications/settings',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        }
      )
    })
  })

  // ========== changePlan ==========
  describe('changePlan', () => {
    test('changePlan_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const request = { newPlanId: 'ahamo-large', applyTiming: 'next_month' as const }
      const mockResponse = { status: 'success', message: 'プラン変更を受け付けました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await changePlan(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/account/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    })

    test('changePlan_APIエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      const request = { newPlanId: 'invalid', applyTiming: 'immediate' as const }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'プランの変更に失敗しました。' }),
      })

      // Act & Assert
      await expect(changePlan(request)).rejects.toThrow('プランの変更に失敗しました。')
    })
  })

  // ========== getOptions ==========
  describe('getOptions', () => {
    test('getOptions_正常時_オプション一覧を返す', async () => {
      // Arrange
      const mockResponse = [
        {
          optionId: 'kakehoudai',
          name: 'かけ放題オプション',
          monthlyFee: 1100,
          description: '国内通話かけ放題',
          status: 'active',
          category: '通話',
        },
        {
          optionId: 'data-add-1gb',
          name: 'データ追加1GB',
          monthlyFee: 550,
          description: '1GBデータ追加',
          status: 'available',
          category: 'データ',
        },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getOptions()

      // Assert
      expect(result).toEqual(mockResponse)
      expect(result).toHaveLength(2)
    })

    test('getOptions_サーバーエラー時_サーバーエラーをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ message: '' }),
      })

      // Act & Assert
      await expect(getOptions()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  // ========== addOption ==========
  describe('addOption', () => {
    test('addOption_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const mockResponse = { status: 'success', message: 'オプションを追加しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await addOption('kakehoudai')

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/kakehoudai',
        { method: 'POST' }
      )
    })

    test('addOption_APIエラー時_エラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: 'オプションの追加に失敗しました。' }),
      })

      // Act & Assert
      await expect(addOption('kakehoudai')).rejects.toThrow('オプションの追加に失敗しました。')
    })
  })

  // ========== cancelOption ==========
  describe('cancelOption', () => {
    test('cancelOption_正常時_成功レスポンスを返す', async () => {
      // Arrange
      const mockResponse = { status: 'success', message: 'オプションを解約しました。' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await cancelOption('kakehoudai')

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/options/kakehoudai',
        { method: 'DELETE' }
      )
    })

    test('cancelOption_ネットワークエラー時_エラーをスロー', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(cancelOption('test')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ========== 共通エラーハンドリング ==========
  describe('共通エラーハンドリング', () => {
    test('サーバーエラー_JSONパース失敗_サーバーエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDashboard()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('サーバーエラー_空メッセージ_サーバーエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: '' }),
      })

      // Act & Assert
      await expect(getContractInfo()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('CORSエラー_ネットワークエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(getDataUsageDetail()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('タイムアウトエラー_ネットワークエラーメッセージをスロー', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(getBillingDetail()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
