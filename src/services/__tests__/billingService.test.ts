/**
 * @fileoverview billingServiceのユニットテスト
 * @module services/__tests__/billingService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getCurrentBilling,
  getBillingHistory,
  getPaymentMethod,
  updatePaymentMethod,
} from '@/services/billingService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

/**
 * エラーメッセージの定数（billingService.tsと同じ）
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('billingService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  // ========================================
  // getCurrentBilling
  // ========================================
  describe('getCurrentBilling', () => {
    test('getCurrentBilling_WithSuccessfulResponse_ShouldReturnCurrentBilling', async () => {
      // Arrange
      const mockBilling = {
        billingMonth: '2026-03',
        totalAmount: 4950,
        taxAmount: 450,
        isConfirmed: false,
        details: [
          { name: 'ahamo基本料金', amount: 2970, category: 'plan' },
          { name: 'かけ放題オプション', amount: 1980, category: 'option' },
        ],
        dueDate: '2026-04-25',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBilling),
      })

      // Act
      const result = await getCurrentBilling()

      // Assert
      expect(result).toEqual(mockBilling)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/billing/current',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    test('getCurrentBilling_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
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

  // ========================================
  // getBillingHistory
  // ========================================
  describe('getBillingHistory', () => {
    test('getBillingHistory_WithSuccessfulResponse_ShouldReturnHistory', async () => {
      // Arrange
      const mockHistory = {
        history: [
          {
            billingMonth: '2026-02',
            totalAmount: 2970,
            paymentStatus: 'paid',
            paidAt: '2026-03-25',
          },
        ],
        totalCount: 1,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      })

      // Act
      const result = await getBillingHistory()

      // Assert
      expect(result).toEqual(mockHistory)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/billing/history',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })

  // ========================================
  // getPaymentMethod
  // ========================================
  describe('getPaymentMethod', () => {
    test('getPaymentMethod_WithSuccessfulResponse_ShouldReturnPaymentMethod', async () => {
      // Arrange
      const mockPayment = {
        paymentType: 'credit_card',
        cardInfo: {
          brand: 'Visa',
          last4: '4242',
          expiryDate: '12/28',
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPayment),
      })

      // Act
      const result = await getPaymentMethod()

      // Assert
      expect(result).toEqual(mockPayment)
    })
  })

  // ========================================
  // updatePaymentMethod
  // ========================================
  describe('updatePaymentMethod', () => {
    test('updatePaymentMethod_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      // Arrange
      const request = {
        type: 'credit_card' as const,
        cardToken: 'tok_test_4242424242424242',
      }
      const mockResponse = { status: 'success', message: '支払い方法を更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updatePaymentMethod(request)

      // Assert
      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/account/payment-method',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(request),
        })
      )
    })

    test('updatePaymentMethod_WithErrorResponse_ShouldThrowErrorMessage', async () => {
      // Arrange
      const request = {
        type: 'credit_card' as const,
        cardToken: 'tok_invalid',
      }
      const errorResponse = { message: 'カード番号が不正です' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      })

      // Act & Assert
      await expect(updatePaymentMethod(request)).rejects.toThrow('カード番号が不正です')
    })
  })

  // ========================================
  // エラーハンドリング共通テスト
  // ========================================
  describe('エラーハンドリング', () => {
    test('fetchWithErrorHandling_WithCORSError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('CORS error'))

      // Act & Assert
      await expect(getCurrentBilling()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })

    test('fetchWithErrorHandling_WithTimeoutError_ShouldThrowNetworkError', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      // Act & Assert
      await expect(getCurrentBilling()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })
})
