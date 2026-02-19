/**
 * @fileoverview BillingApiServiceのユニットテスト
 * @module services/__tests__/BillingApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { getBillingDetail, getBillingHistory } from '@/services/BillingApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('BillingApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getBillingDetail', () => {
    test('getBillingDetail_WithSuccessfulResponse_ShouldReturnBillingData', async () => {
      const mockData = { billingMonth: '2026年2月', totalAmount: 2970 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getBillingDetail()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/billing')
    })

    test('getBillingDetail_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getBillingDetail()).rejects.toThrow('請求情報の取得に失敗しました: 500')
    })
  })

  describe('getBillingHistory', () => {
    test('getBillingHistory_WithSuccessfulResponse_ShouldReturnHistoryData', async () => {
      const mockData = { history: [{ month: '2026年1月', amount: 2970 }] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getBillingHistory()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/billing/history')
    })

    test('getBillingHistory_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

      await expect(getBillingHistory()).rejects.toThrow('請求履歴の取得に失敗しました: 404')
    })
  })
})
