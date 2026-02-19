/**
 * @fileoverview ContractApiServiceのユニットテスト
 * @module services/__tests__/ContractApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { getDashboard, getContractDetail, getNotifications } from '@/services/ContractApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ContractApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getDashboard', () => {
    test('getDashboard_WithSuccessfulResponse_ShouldReturnDashboardData', async () => {
      const mockData = {
        plan: { planName: 'ahamo', monthlyFee: 2970 },
        dataUsage: { usedGB: 10, totalGB: 20 },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getDashboard()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/dashboard')
    })

    test('getDashboard_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(getDashboard()).rejects.toThrow(
        'ダッシュボード情報の取得に失敗しました: 500'
      )
    })
  })

  describe('getContractDetail', () => {
    test('getContractDetail_WithSuccessfulResponse_ShouldReturnContractData', async () => {
      const mockData = { contractId: 'C001', planName: 'ahamo' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getContractDetail()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/contract')
    })

    test('getContractDetail_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

      await expect(getContractDetail()).rejects.toThrow(
        '契約情報の取得に失敗しました: 404'
      )
    })
  })

  describe('getNotifications', () => {
    test('getNotifications_WithSuccessfulResponse_ShouldReturnNotificationsData', async () => {
      const mockData = { notifications: [], unreadCount: 0 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getNotifications()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/notifications')
    })

    test('getNotifications_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

      await expect(getNotifications()).rejects.toThrow('通知の取得に失敗しました: 403')
    })
  })
})
