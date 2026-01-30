/**
 * @fileoverview billingStoreのユニットテスト
 * @module store/__tests__/billingStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useBillingStore } from '../billingStore'
import { act } from '@testing-library/react'
import type { CurrentBilling, BillingHistoryItem, PaymentMethod } from '@/types'

describe('useBillingStore', () => {
  beforeEach(() => {
    act(() => {
      useBillingStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useBillingStore_InitialState_ShouldHaveNullCurrentBilling', () => {
      const state = useBillingStore.getState()
      expect(state.currentBilling).toBeNull()
    })

    test('useBillingStore_InitialState_ShouldHaveEmptyBillingHistory', () => {
      const state = useBillingStore.getState()
      expect(state.billingHistory).toEqual([])
    })

    test('useBillingStore_InitialState_ShouldHaveNullPaymentMethod', () => {
      const state = useBillingStore.getState()
      expect(state.paymentMethod).toBeNull()
    })

    test('useBillingStore_InitialState_ShouldNotBeLoading', () => {
      const state = useBillingStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('setCurrentBilling', () => {
    test('setCurrentBilling_WithValidBilling_ShouldSetCurrentBilling', () => {
      // Arrange
      const billing: CurrentBilling = {
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

      // Act
      act(() => {
        useBillingStore.getState().setCurrentBilling(billing)
      })

      // Assert
      const state = useBillingStore.getState()
      expect(state.currentBilling).toEqual(billing)
    })
  })

  describe('setBillingHistory', () => {
    test('setBillingHistory_WithValidHistory_ShouldSetBillingHistory', () => {
      // Arrange
      const history: BillingHistoryItem[] = [
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

      // Act
      act(() => {
        useBillingStore.getState().setBillingHistory(history)
      })

      // Assert
      const state = useBillingStore.getState()
      expect(state.billingHistory).toEqual(history)
    })
  })

  describe('setPaymentMethod', () => {
    test('setPaymentMethod_WithValidPaymentMethod_ShouldSetPaymentMethod', () => {
      // Arrange
      const paymentMethod: PaymentMethod = {
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

      // Act
      act(() => {
        useBillingStore.getState().setPaymentMethod(paymentMethod)
      })

      // Assert
      const state = useBillingStore.getState()
      expect(state.paymentMethod).toEqual(paymentMethod)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        useBillingStore.getState().setLoading(true)
      })
      expect(useBillingStore.getState().isLoading).toBe(true)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      act(() => {
        useBillingStore.getState().setError('テストエラー')
      })
      expect(useBillingStore.getState().error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useBillingStore.getState().setLoading(true)
      })
      act(() => {
        useBillingStore.getState().setError('テストエラー')
      })
      expect(useBillingStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const billing: CurrentBilling = {
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
      act(() => {
        useBillingStore.getState().setCurrentBilling(billing)
        useBillingStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useBillingStore.getState().reset()
      })

      // Assert
      const state = useBillingStore.getState()
      expect(state.currentBilling).toBeNull()
      expect(state.billingHistory).toEqual([])
      expect(state.paymentMethod).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
