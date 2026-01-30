/**
 * @fileoverview contractServiceのユニットテスト
 * @module services/__tests__/contractService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { ContractSummary, ContractDetails, DeviceInfo } from '@/types'
import { getContractSummary, getContractDetails, getDeviceInfo } from '@/services/contractService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('contractService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getContractSummary', () => {
    test('getContractSummary_WithValidResponse_ShouldReturnContractSummary', async () => {
      // Arrange
      const mockResponse: ContractSummary = {
        contractId: 'CNT-001',
        status: 'active',
        planName: 'ahamo',
        startDate: '2023-04-01',
        phoneNumber: '090-1234-5678',
        monthlyBaseFee: 2970,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getContractSummary()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getContractSummary_WithValidResponse_ShouldCallFetchWithCorrectParams', async () => {
      // Arrange
      const mockResponse: ContractSummary = {
        contractId: 'CNT-001',
        status: 'active',
        planName: 'ahamo',
        startDate: '2023-04-01',
        phoneNumber: '090-1234-5678',
        monthlyBaseFee: 2970,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getContractSummary()

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/contract/summary',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    test('getContractSummary_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getContractSummary()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getContractSummary_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getContractSummary()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getContractDetails', () => {
    test('getContractDetails_WithValidResponse_ShouldReturnContractDetails', async () => {
      // Arrange
      const mockResponse: ContractDetails = {
        contractId: 'CNT-001',
        contractNumber: 'CNT-2023-001234',
        status: 'active',
        startDate: '2023-04-01',
        phoneNumber: '090-1234-5678',
        plan: {
          planId: 'plan-001',
          planName: 'ahamo',
          dataCapacity: 20,
          monthlyFee: 2970,
        },
        options: [],
        simInfo: {
          simType: 'eSIM',
          iccid: '8981100012345678901',
          activationDate: '2023-04-01',
        },
        contractor: {
          name: '山田 太郎',
          nameKana: 'ヤマダ タロウ',
          dateOfBirth: '1990-01-15',
          postalCode: '100-0001',
          address: '東京都千代田区千代田1-1-1',
          email: 'test@docomo.ne.jp',
          contactPhone: '090-1234-5678',
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getContractDetails()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getContractDetails_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getContractDetails()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getContractDetails_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getContractDetails()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getDeviceInfo', () => {
    test('getDeviceInfo_WithValidResponse_ShouldReturnDeviceInfo', async () => {
      // Arrange
      const mockResponse: DeviceInfo = {
        deviceId: 'device-001',
        deviceName: 'iPhone 16 Pro',
        manufacturer: 'Apple',
        modelNumber: 'A3293',
        imei: '35912345678901*',
        purchaseDate: '2024-09-20',
        warrantyEndDate: '2025-09-19',
        installmentBalance: 89760,
        installmentRemainingCount: 18,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getDeviceInfo()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getDeviceInfo_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getDeviceInfo()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getDeviceInfo_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getDeviceInfo()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
