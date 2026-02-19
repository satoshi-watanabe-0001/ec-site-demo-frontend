/**
 * @fileoverview PlanApiServiceのユニットテスト
 * @module services/__tests__/PlanApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getCurrentPlan,
  getAvailablePlans,
  changePlan,
  getOptions,
  subscribeOption,
} from '@/services/PlanApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('PlanApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCurrentPlan', () => {
    test('getCurrentPlan_WithSuccessfulResponse_ShouldReturnPlanData', async () => {
      const mockData = { planId: 'ahamo', planName: 'ahamo', monthlyFee: 2970 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getCurrentPlan()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/plans/current')
    })

    test('getCurrentPlan_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getCurrentPlan()).rejects.toThrow('現在のプラン情報の取得に失敗しました: 500')
    })
  })

  describe('getAvailablePlans', () => {
    test('getAvailablePlans_WithSuccessfulResponse_ShouldReturnPlansData', async () => {
      const mockData = { plans: [{ planId: 'ahamo-large', planName: 'ahamo大盛り' }] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getAvailablePlans()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/plans/available')
    })

    test('getAvailablePlans_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })

      await expect(getAvailablePlans()).rejects.toThrow(
        '利用可能なプラン一覧の取得に失敗しました: 503'
      )
    })
  })

  describe('changePlan', () => {
    test('changePlan_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      const request = { newPlanId: 'ahamo-large', effectiveDate: 'next_month' as const }
      const mockResponse = { success: true, message: 'プラン変更を受け付けました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await changePlan(request)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/plans/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
    })

    test('changePlan_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      await expect(
        changePlan({ newPlanId: 'invalid', effectiveDate: 'immediate' as const })
      ).rejects.toThrow('プラン変更に失敗しました: 400')
    })
  })

  describe('getOptions', () => {
    test('getOptions_WithSuccessfulResponse_ShouldReturnOptionsData', async () => {
      const mockData = { options: [{ optionId: 'opt1', name: 'かけ放題' }] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getOptions()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/options')
    })

    test('getOptions_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getOptions()).rejects.toThrow('オプションサービス一覧の取得に失敗しました: 500')
    })
  })

  describe('subscribeOption', () => {
    test('subscribeOption_WithValidOptionId_ShouldReturnSuccessResponse', async () => {
      const mockResponse = { success: true, message: 'オプションを申込みました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await subscribeOption('opt1')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/options/opt1/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )
    })

    test('subscribeOption_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 409 })

      await expect(subscribeOption('opt1')).rejects.toThrow('オプションの申込に失敗しました: 409')
    })
  })
})
