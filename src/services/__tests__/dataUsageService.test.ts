/**
 * @fileoverview dataUsageServiceのユニットテスト
 * @module services/__tests__/dataUsageService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { CurrentDataUsage, DataUsageHistory } from '@/types'
import { getCurrentDataUsage, getDataUsageHistory } from '@/services/dataUsageService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('dataUsageService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCurrentDataUsage', () => {
    test('getCurrentDataUsage_WithValidResponse_ShouldReturnCurrentDataUsage', async () => {
      // Arrange
      const mockResponse: CurrentDataUsage = {
        usedData: 12.5,
        totalData: 20,
        remainingData: 7.5,
        resetDate: '2025-02-01',
        unit: 'GB',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getCurrentDataUsage()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getCurrentDataUsage_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getCurrentDataUsage()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getCurrentDataUsage_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getCurrentDataUsage()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getDataUsageHistory', () => {
    test('getDataUsageHistory_WithValidResponse_ShouldReturnDataUsageHistory', async () => {
      // Arrange
      const mockResponse: DataUsageHistory = {
        daily: [
          { date: '2026-01-01', usedData: 0.26 },
          { date: '2026-01-02', usedData: 0.99 },
        ],
        monthly: [
          { month: '2025-02', usedData: 16.9, totalData: 20 },
          { month: '2025-03', usedData: 18.0, totalData: 20 },
        ],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getDataUsageHistory()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getDataUsageHistory_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getDataUsageHistory()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDataUsageHistory_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDataUsageHistory()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
