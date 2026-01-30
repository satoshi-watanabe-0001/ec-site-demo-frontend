/**
 * @fileoverview planStoreのユニットテスト
 * @module store/__tests__/planStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { usePlanStore } from '../planStore'
import { act } from '@testing-library/react'
import type { Plan } from '@/types'

describe('usePlanStore', () => {
  beforeEach(() => {
    act(() => {
      usePlanStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('usePlanStore_InitialState_ShouldHaveEmptyAvailablePlans', () => {
      const state = usePlanStore.getState()
      expect(state.availablePlans).toEqual([])
    })

    test('usePlanStore_InitialState_ShouldHaveNullCurrentPlan', () => {
      const state = usePlanStore.getState()
      expect(state.currentPlan).toBeNull()
    })

    test('usePlanStore_InitialState_ShouldNotBeLoading', () => {
      const state = usePlanStore.getState()
      expect(state.isLoading).toBe(false)
    })

    test('usePlanStore_InitialState_ShouldHaveNullError', () => {
      const state = usePlanStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setAvailablePlans', () => {
    test('setAvailablePlans_WithValidPlans_ShouldSetAvailablePlans', () => {
      // Arrange
      const plans: Plan[] = [
        {
          id: 'plan-001',
          name: 'ahamo',
          dataCapacity: 20,
          monthlyFee: 2970,
          description: '基本プラン',
          features: ['5分かけ放題', '20GB'],
        },
        {
          id: 'plan-002',
          name: 'ahamo大盛り',
          dataCapacity: 100,
          monthlyFee: 4950,
          description: '大容量プラン',
          features: ['5分かけ放題', '100GB'],
        },
      ]

      // Act
      act(() => {
        usePlanStore.getState().setAvailablePlans(plans)
      })

      // Assert
      const state = usePlanStore.getState()
      expect(state.availablePlans).toEqual(plans)
    })

    test('setAvailablePlans_WithValidPlans_ShouldClearError', () => {
      // Arrange
      act(() => {
        usePlanStore.getState().setError('テストエラー')
      })
      const plans: Plan[] = [
        {
          id: 'plan-001',
          name: 'ahamo',
          dataCapacity: 20,
          monthlyFee: 2970,
          description: '基本プラン',
          features: ['5分かけ放題', '20GB'],
        },
      ]

      // Act
      act(() => {
        usePlanStore.getState().setAvailablePlans(plans)
      })

      // Assert
      const state = usePlanStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setCurrentPlan', () => {
    test('setCurrentPlan_WithValidPlan_ShouldSetCurrentPlan', () => {
      // Arrange
      const plan: Plan = {
        id: 'plan-001',
        name: 'ahamo',
        dataCapacity: 20,
        monthlyFee: 2970,
        description: '基本プラン',
        features: ['5分かけ放題', '20GB'],
      }

      // Act
      act(() => {
        usePlanStore.getState().setCurrentPlan(plan)
      })

      // Assert
      const state = usePlanStore.getState()
      expect(state.currentPlan).toEqual(plan)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        usePlanStore.getState().setLoading(true)
      })
      expect(usePlanStore.getState().isLoading).toBe(true)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      act(() => {
        usePlanStore.getState().setError('テストエラー')
      })
      expect(usePlanStore.getState().error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      act(() => {
        usePlanStore.getState().setLoading(true)
      })
      act(() => {
        usePlanStore.getState().setError('テストエラー')
      })
      expect(usePlanStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const plan: Plan = {
        id: 'plan-001',
        name: 'ahamo',
        dataCapacity: 20,
        monthlyFee: 2970,
        description: '基本プラン',
        features: ['5分かけ放題', '20GB'],
      }
      act(() => {
        usePlanStore.getState().setAvailablePlans([plan])
        usePlanStore.getState().setCurrentPlan(plan)
        usePlanStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        usePlanStore.getState().reset()
      })

      // Assert
      const state = usePlanStore.getState()
      expect(state.availablePlans).toEqual([])
      expect(state.currentPlan).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
