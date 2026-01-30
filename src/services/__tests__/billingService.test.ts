/**
 * @fileoverview billingServiceのユニットテスト
 * @module services/__tests__/billingService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { CurrentBilling, BillingHistoryItem, PaymentMethod } from '@/types'
import {
  getCurrentBilling,
  getBillingHistory,
  getPaymentMethod,
} from '@/services/billingService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('billingService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCurrentBilling', () => {
    test('getCurrentBilling_WithValidResponse_ShouldReturnCurrentBilling', async () => {
      // Arrange
      const mockResponse: CurrentBilling = {
        billingMonth: '2025-01',
        totalAmount: 9963,
        taxIncluded: true,
        dueDate: '2025-02-28',
        status: 'pending',
        breakdown: {
          basicFee: 2970,
          optionFees: 1100,
          deviceInstallment: 4987,
          discounts: 0,
          taxes: 906,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getCurrentBilling()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getCurrentBilling_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getCurrentBilling()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getCurrentBilling_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getCurrentBilling()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('getBillingHistory', () => {
    test('getBillingHistory_WithValidResponse_ShouldReturnBillingHistory', async () => {
      // Arrange
      const mockResponse: BillingHistoryItem[] = [
        {
          billingMonth: '2024-12',
          totalAmount: 9963,
          status: 'paid',
          paidDate: '2024-12-27',
          breakdown: {
            basicFee: 2970,
            optionFees: 1100,
            deviceInstallment: 4987,
            discounts: 0,
            taxes: 906,
          },
        },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getBillingHistory()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getBillingHistory_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getBillingHistory()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  describe('getPaymentMethod', () => {
    test('getPaymentMethod_WithValidResponse_ShouldReturnPaymentMethod', async () => {
      // Arrange
      const mockResponse: PaymentMethod = {
        id: 'pm-001',
        type: 'credit_card',
        cardBrand: 'VISA',
        lastFourDigits: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        holderName: 'TARO YAMADA',
        isDefault: true,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getPaymentMethod()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getPaymentMethod_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getPaymentMethod()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })
})
