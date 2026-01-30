/**
 * @fileoverview planServiceのユニットテスト
 * @module services/__tests__/planService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { AvailablePlansResponse, ChangePlanResponse } from '@/types'
import { getAvailablePlans, changePlan } from '@/services/planService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('planService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAvailablePlans', () => {
    test('getAvailablePlans_WithValidResponse_ShouldReturnPlans', async () => {
      // Arrange
      const mockResponse: AvailablePlansResponse = {
        currentPlan: {
          id: 'plan-001',
          name: 'ahamo',
          dataCapacity: 20,
          monthlyFee: 2970,
          description: '基本プラン',
          features: ['5分かけ放題', '20GB'],
        },
        availablePlans: [
          {
            id: 'plan-002',
            name: 'ahamo大盛り',
            dataCapacity: 100,
            monthlyFee: 4950,
            description: '大容量プラン',
            features: ['5分かけ放題', '100GB'],
          },
        ],
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getAvailablePlans()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getAvailablePlans_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(getAvailablePlans()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getAvailablePlans_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getAvailablePlans()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('changePlan', () => {
    test('changePlan_WithValidRequest_ShouldReturnSuccess', async () => {
      // Arrange
      const request = { planId: 'plan-002' }
      const mockResponse: ChangePlanResponse = {
        success: true,
        message: 'プラン変更が完了しました',
        effectiveDate: '2026-02-01',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await changePlan(request)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('changePlan_WithValidRequest_ShouldCallFetchWithCorrectParams', async () => {
      // Arrange
      const request = { planId: 'plan-002' }
      const mockResponse: ChangePlanResponse = {
        success: true,
        message: 'プラン変更が完了しました',
        effectiveDate: '2026-02-01',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await changePlan(request)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/plans/change',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      )
    })

    test('changePlan_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const request = { planId: 'plan-002' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      // Act & Assert
      await expect(changePlan(request)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })
})
