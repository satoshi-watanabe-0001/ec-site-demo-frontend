/**
 * @fileoverview dataUsageServiceのユニットテスト
 * @module services/__tests__/dataUsageService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getDataUsage,
  getDataUsageHistory,
  getDataChargeHistory,
} from '@/services/dataUsageService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

/**
 * エラーメッセージの定数（dataUsageService.tsと同じ）
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('dataUsageService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  // ========================================
  // getDataUsage
  // ========================================
  describe('getDataUsage', () => {
    test('getDataUsage_WithSuccessfulResponse_ShouldReturnDataUsage', async () => {
      // Arrange
      const mockUsage = {
        currentUsageGB: 12.5,
        totalCapacityGB: 20,
        usagePercentage: 62.5,
        billingPeriodStart: '2026-03-01',
        billingPeriodEnd: '2026-03-31',
        remainingGB: 7.5,
        lastUpdated: '2026-03-03T10:00:00Z',
        breakdown: [
          { category: 'アプリ通信', usageGB: 8.2 },
          { category: 'Webブラウジング', usageGB: 3.1 },
          { category: 'その他', usageGB: 1.2 },
        ],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      })

      // Act
      const result = await getDataUsage()

      // Assert
      expect(result).toEqual(mockUsage)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/data-usage',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('getDataUsage_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      // Act & Assert
      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDataUsage_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  // ========================================
  // getDataUsageHistory
  // ========================================
  describe('getDataUsageHistory', () => {
    test('getDataUsageHistory_WithSuccessfulResponse_ShouldReturnHistory', async () => {
      // Arrange
      const mockHistory = {
        history: [
          { month: '2026-02', usageGB: 15.3, capacityGB: 20 },
          { month: '2026-01', usageGB: 18.7, capacityGB: 20 },
        ],
        totalCount: 2,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      })

      // Act
      const result = await getDataUsageHistory()

      // Assert
      expect(result).toEqual(mockHistory)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/data-usage/history',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('getDataUsageHistory_WithErrorResponse_ShouldThrowErrorMessage', async () => {
      // Arrange
      const errorResponse = { message: 'データ取得に失敗しました' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(getDataUsageHistory()).rejects.toThrow('データ取得に失敗しました')
    })
  })

  // ========================================
  // getDataChargeHistory
  // ========================================
  describe('getDataChargeHistory', () => {
    test('getDataChargeHistory_WithSuccessfulResponse_ShouldReturnChargeHistory', async () => {
      // Arrange
      const mockChargeHistory = {
        charges: [
          {
            chargeId: 'chg-001',
            chargeDate: '2026-02-15',
            amountGB: 1.0,
            price: 550,
            type: '1GBチャージ',
          },
        ],
        totalCount: 1,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChargeHistory),
      })

      // Act
      const result = await getDataChargeHistory()

      // Assert
      expect(result).toEqual(mockChargeHistory)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/data-charge/history',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })

  // ========================================
  // エラーハンドリング共通テスト
  // ========================================
  describe('エラーハンドリング', () => {
    test('fetchWithErrorHandling_WithCORSError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('fetchWithErrorHandling_WithTimeoutError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('fetchWithErrorHandling_WithEmptyErrorResponse_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ status: 'error' }),
      })

      // Act & Assert
      await expect(getDataUsage()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })
})
