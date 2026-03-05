/**
 * @fileoverview account-storeのユニットテスト
 * @module store/__tests__/account-store.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useAccountStore } from '../account-store'
import { act } from '@testing-library/react'
import type { DashboardData, ContractInfo, DataUsage, BillingInfo } from '@/types'

describe('useAccountStore', () => {
  beforeEach(() => {
    act(() => {
      useAccountStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useAccountStore_InitialState_ShouldHaveNullDashboard', () => {
      const state = useAccountStore.getState()
      expect(state.dashboard).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldHaveNullContract', () => {
      const state = useAccountStore.getState()
      expect(state.contract).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldHaveNullDataUsage', () => {
      const state = useAccountStore.getState()
      expect(state.dataUsage).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldHaveNullBilling', () => {
      const state = useAccountStore.getState()
      expect(state.billing).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldHaveEmptyOptions', () => {
      const state = useAccountStore.getState()
      expect(state.options).toEqual([])
    })

    test('useAccountStore_InitialState_ShouldHaveEmptyPlans', () => {
      const state = useAccountStore.getState()
      expect(state.plans).toEqual([])
    })

    test('useAccountStore_InitialState_ShouldNotBeLoading', () => {
      const state = useAccountStore.getState()
      expect(state.isLoading).toBe(false)
    })

    test('useAccountStore_InitialState_ShouldHaveNullError', () => {
      const state = useAccountStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setDashboard', () => {
    test('setDashboard_WithData_ShouldSetDashboard', () => {
      // Arrange
      const data = {
        currentPlan: { name: 'ahamo', price: 2970, dataCapacity: 20 },
        dataUsageSummary: { usedGb: 8.5, totalGb: 20 },
        billingSummary: { currentMonthTotal: 2970, lastMonthTotal: 2970, difference: 0 },
        notifications: [],
      } as unknown as DashboardData

      // Act
      act(() => {
        useAccountStore.getState().setDashboard(data)
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.dashboard).toEqual(data)
    })

    test('setDashboard_WithData_ShouldClearError', () => {
      // Arrange
      act(() => {
        useAccountStore.getState().setError('some error')
      })

      // Act
      act(() => {
        useAccountStore.getState().setDashboard({} as DashboardData)
      })

      // Assert
      expect(useAccountStore.getState().error).toBeNull()
    })
  })

  describe('setContract', () => {
    test('setContract_WithData_ShouldSetContract', () => {
      const data = { name: '山田太郎', phoneNumber: '090-1234-5678' } as unknown as ContractInfo

      act(() => {
        useAccountStore.getState().setContract(data)
      })

      expect(useAccountStore.getState().contract).toEqual(data)
    })

    test('setContract_WithData_ShouldClearError', () => {
      act(() => {
        useAccountStore.getState().setError('error')
      })
      act(() => {
        useAccountStore.getState().setContract({} as ContractInfo)
      })
      expect(useAccountStore.getState().error).toBeNull()
    })
  })

  describe('setDataUsage', () => {
    test('setDataUsage_WithData_ShouldSetDataUsage', () => {
      const data = { usedGb: 12.5, totalGb: 20 } as unknown as DataUsage

      act(() => {
        useAccountStore.getState().setDataUsage(data)
      })

      expect(useAccountStore.getState().dataUsage).toEqual(data)
    })
  })

  describe('setBilling', () => {
    test('setBilling_WithData_ShouldSetBilling', () => {
      const data = { totalAmount: 2970 } as unknown as BillingInfo

      act(() => {
        useAccountStore.getState().setBilling(data)
      })

      expect(useAccountStore.getState().billing).toEqual(data)
    })
  })

  describe('setOptions', () => {
    test('setOptions_WithData_ShouldSetOptions', () => {
      const data = [
        { id: 'opt-1', name: 'かけ放題', monthlyFee: 1100, isSubscribed: true },
      ] as never[]

      act(() => {
        useAccountStore.getState().setOptions(data)
      })

      expect(useAccountStore.getState().options).toEqual(data)
    })
  })

  describe('setPlans', () => {
    test('setPlans_WithData_ShouldSetPlans', () => {
      const data = [
        { id: 'ahamo', name: 'ahamo', price: 2970, dataCapacity: 20, isCurrent: true },
      ] as never[]

      act(() => {
        useAccountStore.getState().setPlans(data)
      })

      expect(useAccountStore.getState().plans).toEqual(data)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        useAccountStore.getState().setLoading(true)
      })
      expect(useAccountStore.getState().isLoading).toBe(true)
    })

    test('setLoading_WithFalse_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useAccountStore.getState().setLoading(true)
      })
      act(() => {
        useAccountStore.getState().setLoading(false)
      })
      expect(useAccountStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    test('setError_WithMessage_ShouldSetError', () => {
      act(() => {
        useAccountStore.getState().setError('エラーが発生しました')
      })
      expect(useAccountStore.getState().error).toBe('エラーが発生しました')
    })

    test('setError_WithNull_ShouldClearError', () => {
      act(() => {
        useAccountStore.getState().setError('エラー')
      })
      act(() => {
        useAccountStore.getState().setError(null)
      })
      expect(useAccountStore.getState().error).toBeNull()
    })
  })

  describe('reset', () => {
    test('reset_WithPopulatedState_ShouldResetToInitialState', () => {
      // Arrange - populate state
      act(() => {
        useAccountStore.getState().setDashboard({} as DashboardData)
        useAccountStore.getState().setContract({} as ContractInfo)
        useAccountStore.getState().setLoading(true)
        useAccountStore.getState().setError('some error')
      })

      // Act
      act(() => {
        useAccountStore.getState().reset()
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.dashboard).toBeNull()
      expect(state.contract).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.options).toEqual([])
      expect(state.plans).toEqual([])
    })
  })
})
