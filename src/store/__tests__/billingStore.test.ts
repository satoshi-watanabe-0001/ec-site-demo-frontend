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
        id: 'pm-001',
        type: 'credit_card',
        cardBrand: 'VISA',
        lastFourDigits: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        holderName: 'TARO YAMADA',
        isDefault: true,
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
