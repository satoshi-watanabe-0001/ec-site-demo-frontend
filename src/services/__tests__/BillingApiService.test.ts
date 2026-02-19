/**
 * @fileoverview 請求情報APIサービスのユニットテスト
 * @module services/__tests__/BillingApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { getBilling, getBillingHistory } from '../BillingApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('BillingApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getBilling', () => {
    test('getBilling_WhenSuccess_ShouldReturnBillingData', async () => {
      const mockData = {
        billing: {
          billingMonth: '2026年2月',
          breakdown: { baseFee: 2970, total: 3200 },
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getBilling()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/billing'))
    })

    test('getBilling_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getBilling()).rejects.toThrow('請求情報の取得に失敗しました: 500')
    })
  })

  describe('getBillingHistory', () => {
    test('getBillingHistory_WhenSuccess_ShouldReturnHistory', async () => {
      const mockData = { history: [], totalCount: 0 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getBillingHistory()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/billing/history')
      )
    })

    test('getBillingHistory_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getBillingHistory()).rejects.toThrow('請求履歴の取得に失敗しました: 500')
    })
  })
})
