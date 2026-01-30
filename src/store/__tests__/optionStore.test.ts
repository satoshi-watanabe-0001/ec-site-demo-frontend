/**
 * @fileoverview optionStoreのユニットテスト
 * @module store/__tests__/optionStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useOptionStore } from '../optionStore'
import { act } from '@testing-library/react'
import type { OptionService } from '@/types'

describe('useOptionStore', () => {
  beforeEach(() => {
    act(() => {
      useOptionStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useOptionStore_InitialState_ShouldHaveEmptyAvailableOptions', () => {
      const state = useOptionStore.getState()
      expect(state.availableOptions).toEqual([])
    })

    test('useOptionStore_InitialState_ShouldHaveEmptySubscribedOptions', () => {
      const state = useOptionStore.getState()
      expect(state.subscribedOptions).toEqual([])
    })

    test('useOptionStore_InitialState_ShouldNotBeLoading', () => {
      const state = useOptionStore.getState()
      expect(state.isLoading).toBe(false)
    })

    test('useOptionStore_InitialState_ShouldHaveNullError', () => {
      const state = useOptionStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setAvailableOptions', () => {
    test('setAvailableOptions_WithValidOptions_ShouldSetAvailableOptions', () => {
      // Arrange
      const options: OptionService[] = [
        {
          optionId: 'opt-001',
          optionName: 'かけ放題オプション',
          description: '国内通話かけ放題',
          monthlyFee: 1100,
          category: 'call',
          features: ['国内通話無制限'],
          status: 'available',
          isCancellable: true,
        },
        {
          optionId: 'opt-002',
          optionName: '大盛りオプション',
          description: '+80GB追加',
          monthlyFee: 1980,
          category: 'data',
          features: ['80GB追加'],
          status: 'available',
          isCancellable: true,
        },
      ]

      // Act
      act(() => {
        useOptionStore.getState().setAvailableOptions(options)
      })

      // Assert
      const state = useOptionStore.getState()
      expect(state.availableOptions).toEqual(options)
    })

    test('setAvailableOptions_WithValidOptions_ShouldClearError', () => {
      // Arrange
      act(() => {
        useOptionStore.getState().setError('テストエラー')
      })
      const options: OptionService[] = [
        {
          optionId: 'opt-001',
          optionName: 'かけ放題オプション',
          description: '国内通話かけ放題',
          monthlyFee: 1100,
          category: 'call',
          features: ['国内通話無制限'],
          status: 'available',
          isCancellable: true,
        },
      ]

      // Act
      act(() => {
        useOptionStore.getState().setAvailableOptions(options)
      })

      // Assert
      const state = useOptionStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setSubscribedOptions', () => {
    test('setSubscribedOptions_WithValidOptions_ShouldSetSubscribedOptions', () => {
      // Arrange
      const subscribedOptions: OptionService[] = [
        {
          optionId: 'opt-001',
          optionName: 'かけ放題オプション',
          description: '国内通話かけ放題',
          monthlyFee: 1100,
          category: 'call',
          features: ['国内通話無制限'],
          status: 'subscribed',
          isCancellable: true,
        },
      ]

      // Act
      act(() => {
        useOptionStore.getState().setSubscribedOptions(subscribedOptions)
      })

      // Assert
      const state = useOptionStore.getState()
      expect(state.subscribedOptions).toEqual(subscribedOptions)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        useOptionStore.getState().setLoading(true)
      })
      expect(useOptionStore.getState().isLoading).toBe(true)
    })

    test('setLoading_WithFalse_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useOptionStore.getState().setLoading(true)
      })
      act(() => {
        useOptionStore.getState().setLoading(false)
      })
      expect(useOptionStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      act(() => {
        useOptionStore.getState().setError('テストエラー')
      })
      expect(useOptionStore.getState().error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useOptionStore.getState().setLoading(true)
      })
      act(() => {
        useOptionStore.getState().setError('テストエラー')
      })
      expect(useOptionStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const options: OptionService[] = [
        {
          optionId: 'opt-001',
          optionName: 'かけ放題オプション',
          description: '国内通話かけ放題',
          monthlyFee: 1100,
          category: 'call',
          features: ['国内通話無制限'],
          status: 'available',
          isCancellable: true,
        },
      ]
      act(() => {
        useOptionStore.getState().setAvailableOptions(options)
        useOptionStore.getState().setSubscribedOptions(options)
        useOptionStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useOptionStore.getState().reset()
      })

      // Assert
      const state = useOptionStore.getState()
      expect(state.availableOptions).toEqual([])
      expect(state.subscribedOptions).toEqual([])
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
