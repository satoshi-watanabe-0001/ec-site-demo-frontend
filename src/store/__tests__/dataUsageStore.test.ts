/**
 * @fileoverview dataUsageStoreのユニットテスト
 * @module store/__tests__/dataUsageStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useDataUsageStore } from '../dataUsageStore'
import { act } from '@testing-library/react'
import type { CurrentDataUsage, DailyDataUsage, MonthlyDataUsage } from '@/types'

describe('useDataUsageStore', () => {
  beforeEach(() => {
    act(() => {
      useDataUsageStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useDataUsageStore_InitialState_ShouldHaveNullCurrentUsage', () => {
      const state = useDataUsageStore.getState()
      expect(state.currentUsage).toBeNull()
    })

    test('useDataUsageStore_InitialState_ShouldHaveEmptyDailyUsage', () => {
      const state = useDataUsageStore.getState()
      expect(state.dailyUsage).toEqual([])
    })

    test('useDataUsageStore_InitialState_ShouldHaveEmptyMonthlyUsage', () => {
      const state = useDataUsageStore.getState()
      expect(state.monthlyUsage).toEqual([])
    })

    test('useDataUsageStore_InitialState_ShouldNotBeLoading', () => {
      const state = useDataUsageStore.getState()
      expect(state.isLoading).toBe(false)
    })

    test('useDataUsageStore_InitialState_ShouldHaveNullError', () => {
      const state = useDataUsageStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setCurrentUsage', () => {
    test('setCurrentUsage_WithValidUsage_ShouldSetCurrentUsage', () => {
      // Arrange
      const usage: CurrentDataUsage = {
        dataCapacity: 20,
        usedData: 12.5,
        remainingData: 7.5,
        usagePercentage: 62.5,
        periodStartDate: '2025-01-01',
        periodEndDate: '2025-01-31',
        resetDate: '2025-02-01',
        additionalData: 0,
        carryOverData: 0,
      }

      // Act
      act(() => {
        useDataUsageStore.getState().setCurrentUsage(usage)
      })

      // Assert
      const state = useDataUsageStore.getState()
      expect(state.currentUsage).toEqual(usage)
    })

    test('setCurrentUsage_WithValidUsage_ShouldClearError', () => {
      // Arrange
      act(() => {
        useDataUsageStore.getState().setError('テストエラー')
      })
      const usage: CurrentDataUsage = {
        dataCapacity: 20,
        usedData: 12.5,
        remainingData: 7.5,
        usagePercentage: 62.5,
        periodStartDate: '2025-01-01',
        periodEndDate: '2025-01-31',
        resetDate: '2025-02-01',
        additionalData: 0,
        carryOverData: 0,
      }

      // Act
      act(() => {
        useDataUsageStore.getState().setCurrentUsage(usage)
      })

      // Assert
      const state = useDataUsageStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setDailyUsage', () => {
    test('setDailyUsage_WithValidUsage_ShouldSetDailyUsage', () => {
      // Arrange
      const dailyUsage: DailyDataUsage[] = [
        { date: '2026-01-01', usedData: 0.26 },
        { date: '2026-01-02', usedData: 0.99 },
      ]

      // Act
      act(() => {
        useDataUsageStore.getState().setDailyUsage(dailyUsage)
      })

      // Assert
      const state = useDataUsageStore.getState()
      expect(state.dailyUsage).toEqual(dailyUsage)
    })
  })

  describe('setMonthlyUsage', () => {
    test('setMonthlyUsage_WithValidUsage_ShouldSetMonthlyUsage', () => {
      // Arrange
      const monthlyUsage: MonthlyDataUsage[] = [
        { month: '2025-02', usedData: 16.9, dataCapacity: 20, additionalData: 0 },
        { month: '2025-03', usedData: 18.0, dataCapacity: 20, additionalData: 0 },
      ]

      // Act
      act(() => {
        useDataUsageStore.getState().setMonthlyUsage(monthlyUsage)
      })

      // Assert
      const state = useDataUsageStore.getState()
      expect(state.monthlyUsage).toEqual(monthlyUsage)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        useDataUsageStore.getState().setLoading(true)
      })
      expect(useDataUsageStore.getState().isLoading).toBe(true)
    })

    test('setLoading_WithFalse_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useDataUsageStore.getState().setLoading(true)
      })
      act(() => {
        useDataUsageStore.getState().setLoading(false)
      })
      expect(useDataUsageStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      act(() => {
        useDataUsageStore.getState().setError('テストエラー')
      })
      expect(useDataUsageStore.getState().error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useDataUsageStore.getState().setLoading(true)
      })
      act(() => {
        useDataUsageStore.getState().setError('テストエラー')
      })
      expect(useDataUsageStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const usage: CurrentDataUsage = {
        dataCapacity: 20,
        usedData: 12.5,
        remainingData: 7.5,
        usagePercentage: 62.5,
        periodStartDate: '2025-01-01',
        periodEndDate: '2025-01-31',
        resetDate: '2025-02-01',
        additionalData: 0,
        carryOverData: 0,
      }
      act(() => {
        useDataUsageStore.getState().setCurrentUsage(usage)
        useDataUsageStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useDataUsageStore.getState().reset()
      })

      // Assert
      const state = useDataUsageStore.getState()
      expect(state.currentUsage).toBeNull()
      expect(state.dailyUsage).toEqual([])
      expect(state.monthlyUsage).toEqual([])
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
