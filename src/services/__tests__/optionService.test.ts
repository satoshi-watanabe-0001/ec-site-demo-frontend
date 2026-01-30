/**
 * @fileoverview optionServiceのユニットテスト
 * @module services/__tests__/optionService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { OptionsResponse, SubscribeOptionResponse, UnsubscribeOptionResponse } from '@/types'
import { getOptions, subscribeOption, unsubscribeOption } from '@/services/optionService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('optionService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getOptions', () => {
    test('getOptions_WithValidResponse_ShouldReturnOptions', async () => {
      // Arrange
      const mockResponse: OptionsResponse = {
        availableOptions: [
          {
            optionId: 'opt-001',
            optionName: 'かけ放題オプション',
            description: '国内通話かけ放題',
            monthlyFee: 1100,
            category: 'call',
            features: ['国内通話無制限'],
            status: 'available',
            isCancellable: true,
          },
        ],
        subscribedOptions: [
          {
            optionId: 'opt-002',
            optionName: '大盛りオプション',
            description: '+80GB追加',
            monthlyFee: 1980,
            category: 'data',
            features: ['80GB追加'],
            status: 'subscribed',
            isCancellable: true,
          },
        ],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getOptions()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getOptions_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(getOptions()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getOptions_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getOptions()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('subscribeOption', () => {
    test('subscribeOption_WithValidRequest_ShouldReturnSuccess', async () => {
      // Arrange
      const request = { optionId: 'opt-002' }
      const mockResponse: SubscribeOptionResponse = {
        success: true,
        message: 'オプションに加入しました',
        startDate: '2026-02-01',
        option: {
          optionId: 'opt-002',
          optionName: '大盛りオプション',
          description: '+80GB追加',
          monthlyFee: 1980,
          category: 'data',
          features: ['80GB追加'],
          status: 'subscribed',
          isCancellable: true,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await subscribeOption(request)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('subscribeOption_WithValidRequest_ShouldCallFetchWithCorrectParams', async () => {
      // Arrange
      const request = { optionId: 'opt-002' }
      const mockResponse: SubscribeOptionResponse = {
        success: true,
        message: 'オプションに加入しました',
        startDate: '2026-02-01',
        option: {
          optionId: 'opt-002',
          optionName: '大盛りオプション',
          description: '+80GB追加',
          monthlyFee: 1980,
          category: 'data',
          features: ['80GB追加'],
          status: 'subscribed',
          isCancellable: true,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await subscribeOption(request)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/options/opt-002/subscribe',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      )
    })

    test('subscribeOption_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const request = { optionId: 'opt-002' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(subscribeOption(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  describe('unsubscribeOption', () => {
    test('unsubscribeOption_WithValidRequest_ShouldReturnSuccess', async () => {
      // Arrange
      const request = { optionId: 'opt-001' }
      const mockResponse: UnsubscribeOptionResponse = {
        success: true,
        message: 'オプションを解約しました',
        endDate: '2026-01-31',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await unsubscribeOption(request)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('unsubscribeOption_WithValidRequest_ShouldCallFetchWithCorrectParams', async () => {
      // Arrange
      const request = { optionId: 'opt-001' }
      const mockResponse: UnsubscribeOptionResponse = {
        success: true,
        message: 'オプションを解約しました',
        endDate: '2026-01-31',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await unsubscribeOption(request)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/options/opt-001/subscribe',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      )
    })

    test('unsubscribeOption_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const request = { optionId: 'opt-001' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(unsubscribeOption(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })
})
