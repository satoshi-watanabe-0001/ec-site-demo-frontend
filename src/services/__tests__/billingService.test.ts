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
        billingId: 'bill-001',
        billingMonth: '2025-01',
        status: 'pending',
        baseFee: 2970,
        callFee: 0,
        dataAdditionalFee: 0,
        optionFee: 1100,
        deviceInstallment: 4987,
        discount: 0,
        subtotal: 9057,
        tax: 906,
        total: 9963,
        dueDate: '2025-02-28',
        paymentMethod: 'credit_card',
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
          billingId: 'bill-001',
          billingMonth: '2024-12',
          status: 'paid',
          baseFee: 2970,
          optionFee: 1100,
          callCharges: 0,
          dataOverageCharges: 0,
          deviceInstallment: 4987,
          total: 9963,
          paidDate: '2024-12-27',
          paymentMethod: 'credit_card',
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
        type: 'credit_card',
        isDefault: true,
        cardInfo: {
          cardId: 'card-001',
          brand: 'VISA',
          lastFourDigits: '4242',
          expiryDate: '12/26',
          holderName: 'TARO YAMADA',
        },
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
