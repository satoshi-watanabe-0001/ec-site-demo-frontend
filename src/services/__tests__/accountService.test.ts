/**
 * @fileoverview accountServiceのユニットテスト
 * @module services/__tests__/accountService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getDashboardData,
  getContractInfo,
  getDataUsage,
  getBillingInfo,
} from '@/services/accountService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  FETCH_FAILED: 'データの取得に失敗しました。',
} as const

describe('accountService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getDashboardData', () => {
    test('getDashboardData_WithValidUserId_ShouldReturnDashboardData', async () => {
      // Arrange
      const mockData = { contract: {}, dataUsage: {}, billing: {}, device: {}, notifications: {} }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      // Act
      const result = await getDashboardData('user-001')

      // Assert
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/dashboard?userId=user-001',
        { cache: 'no-store' }
      )
    })

    test('getDashboardData_WithServerError_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      // Act & Assert
      await expect(getDashboardData('user-001')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDashboardData_WithClientError_ShouldThrowFetchFailed', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      // Act & Assert
      await expect(getDashboardData('user-001')).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED)
    })

    test('getDashboardData_WithNetworkError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDashboardData('user-001')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getContractInfo', () => {
    test('getContractInfo_WithValidContractId_ShouldReturnContractInfo', async () => {
      // Arrange
      const mockContract = { id: 'contract-001', planName: 'ahamo' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContract),
      })

      // Act
      const result = await getContractInfo('contract-001')

      // Assert
      expect(result).toEqual(mockContract)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/contracts/contract-001',
        { cache: 'no-store' }
      )
    })

    test('getContractInfo_WithServerError_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 })

      // Act & Assert
      await expect(getContractInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getContractInfo_WithClientError_ShouldThrowFetchFailed', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

      // Act & Assert
      await expect(getContractInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED)
    })

    test('getContractInfo_WithNetworkError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getContractInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getDataUsage', () => {
    test('getDataUsage_WithValidContractId_ShouldReturnDataUsage', async () => {
      // Arrange
      const mockUsage = { contractId: 'contract-001', currentMonth: { used: 12800, total: 30720 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsage),
      })

      // Act
      const result = await getDataUsage('contract-001')

      // Assert
      expect(result).toEqual(mockUsage)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/data-usage/contract-001',
        { cache: 'no-store' }
      )
    })

    test('getDataUsage_WithServerError_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      // Act & Assert
      await expect(getDataUsage('contract-001')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDataUsage_WithNetworkError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDataUsage('contract-001')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getBillingInfo', () => {
    test('getBillingInfo_WithValidContractId_ShouldReturnBillingInfo', async () => {
      // Arrange
      const mockBilling = { contractId: 'contract-001', currentBill: { total: 2970 } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBilling),
      })

      // Act
      const result = await getBillingInfo('contract-001')

      // Assert
      expect(result).toEqual(mockBilling)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/billing/contract-001', {
        cache: 'no-store',
      })
    })

    test('getBillingInfo_WithServerError_ShouldThrowServerError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      // Act & Assert
      await expect(getBillingInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getBillingInfo_WithClientError_ShouldThrowFetchFailed', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

      // Act & Assert
      await expect(getBillingInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.FETCH_FAILED)
    })

    test('getBillingInfo_WithNetworkError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getBillingInfo('contract-001')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
