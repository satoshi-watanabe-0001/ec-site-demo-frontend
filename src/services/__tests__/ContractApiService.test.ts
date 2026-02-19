/**
 * @fileoverview 契約情報APIサービスのユニットテスト
 * @module services/__tests__/ContractApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { getDashboard, getContract, getDataUsage, getNotifications } from '../ContractApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ContractApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getDashboard', () => {
    test('getDashboard_WhenSuccess_ShouldReturnDashboardData', async () => {
      const mockData = { dashboard: { plan: { name: 'ahamo' } } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getDashboard()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/dashboard'))
    })

    test('getDashboard_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getDashboard()).rejects.toThrow('ダッシュボード情報の取得に失敗しました: 500')
    })
  })

  describe('getContract', () => {
    test('getContract_WhenSuccess_ShouldReturnContractData', async () => {
      const mockData = { contract: { contractId: 'C001' } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getContract()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/contract'))
    })

    test('getContract_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

      await expect(getContract()).rejects.toThrow('契約情報の取得に失敗しました: 404')
    })
  })

  describe('getDataUsage', () => {
    test('getDataUsage_WhenSuccess_ShouldReturnDataUsage', async () => {
      const mockData = { dataUsage: { usedGB: 10 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getDataUsage()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/data-usage'))
    })

    test('getDataUsage_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getDataUsage()).rejects.toThrow('データ使用量の取得に失敗しました: 500')
    })
  })

  describe('getNotifications', () => {
    test('getNotifications_WhenSuccess_ShouldReturnNotifications', async () => {
      const mockData = { notifications: [], unreadCount: 0 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getNotifications()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/notifications')
      )
    })

    test('getNotifications_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

      await expect(getNotifications()).rejects.toThrow('通知の取得に失敗しました: 403')
    })
  })
})
