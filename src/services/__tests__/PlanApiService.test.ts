/**
 * @fileoverview プラン管理APIサービスのユニットテスト
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
} from '../PlanApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('PlanApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCurrentPlan', () => {
    test('getCurrentPlan_WhenSuccess_ShouldReturnCurrentPlan', async () => {
      const mockData = { plan: { id: 'P001', name: 'ahamo' } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getCurrentPlan()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/plans/current')
      )
    })

    test('getCurrentPlan_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getCurrentPlan()).rejects.toThrow('現在のプラン情報の取得に失敗しました: 500')
    })
  })

  describe('getAvailablePlans', () => {
    test('getAvailablePlans_WhenSuccess_ShouldReturnPlans', async () => {
      const mockData = { plans: [{ id: 'P001', name: 'ahamo' }] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getAvailablePlans()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/plans/available')
      )
    })

    test('getAvailablePlans_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getAvailablePlans()).rejects.toThrow(
        '利用可能なプラン一覧の取得に失敗しました: 500'
      )
    })
  })

  describe('changePlan', () => {
    test('changePlan_WhenSuccess_ShouldReturnChangeResponse', async () => {
      const mockResponse = {
        success: true,
        message: 'プラン変更を受け付けました',
        effectiveDate: '2026-03-01',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await changePlan({
        planId: 'P002',
        effectiveDate: '2026-03-01',
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/plans/change'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    test('changePlan_WhenHttpError_ShouldThrowWithServerMessage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'プラン変更できません' }),
      })

      await expect(changePlan({ planId: 'P002', effectiveDate: '2026-03-01' })).rejects.toThrow(
        'プラン変更できません'
      )
    })
  })

  describe('getOptions', () => {
    test('getOptions_WhenSuccess_ShouldReturnOptions', async () => {
      const mockData = { options: [{ id: 'O001', name: 'かけ放題' }] }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getOptions()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/options'))
    })

    test('getOptions_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getOptions()).rejects.toThrow('オプションサービスの取得に失敗しました: 500')
    })
  })

  describe('subscribeOption', () => {
    test('subscribeOption_WhenSuccess_ShouldReturnSuccessResponse', async () => {
      const mockResponse = { success: true, message: '加入しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await subscribeOption('O001')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/options/O001/subscribe'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    test('subscribeOption_WhenHttpError_ShouldThrowWithServerMessage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '既に加入済みです' }),
      })

      await expect(subscribeOption('O001')).rejects.toThrow('既に加入済みです')
    })
  })
})
