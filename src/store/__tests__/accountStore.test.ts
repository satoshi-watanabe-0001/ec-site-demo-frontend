/**
 * @fileoverview accountStoreのユニットテスト
 * @module store/__tests__/accountStore.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useAccountStore } from '../accountStore'
import { act } from '@testing-library/react'
import type { AccountProfile, NotificationSettings } from '@/types'

describe('useAccountStore', () => {
  beforeEach(() => {
    act(() => {
      useAccountStore.getState().reset()
    })
  })

  describe('初期状態', () => {
    test('useAccountStore_InitialState_ShouldHaveNullProfile', () => {
      const state = useAccountStore.getState()
      expect(state.profile).toBeNull()
    })

    test('useAccountStore_InitialState_ShouldHaveNullNotificationSettings', () => {
      const state = useAccountStore.getState()
      expect(state.notificationSettings).toBeNull()
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

  describe('setProfile', () => {
    test('setProfile_WithValidProfile_ShouldSetProfile', () => {
      // Arrange
      const profile: AccountProfile = {
        userId: 'user-001',
        email: 'test@docomo.ne.jp',
        phone: '090-1234-5678',
        address: {
          postalCode: '100-0001',
          prefecture: '東京都',
          city: '千代田区',
          street: '千代田1-1-1',
        },
      }

      // Act
      act(() => {
        useAccountStore.getState().setProfile(profile)
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.profile).toEqual(profile)
    })

    test('setProfile_WithValidProfile_ShouldClearError', () => {
      // Arrange
      act(() => {
        useAccountStore.getState().setError('テストエラー')
      })
      const profile: AccountProfile = {
        userId: 'user-001',
        email: 'test@docomo.ne.jp',
        phone: '090-1234-5678',
        address: {
          postalCode: '100-0001',
          prefecture: '東京都',
          city: '千代田区',
          street: '千代田1-1-1',
        },
      }

      // Act
      act(() => {
        useAccountStore.getState().setProfile(profile)
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('setNotificationSettings', () => {
    test('setNotificationSettings_WithValidSettings_ShouldSetNotificationSettings', () => {
      // Arrange
      const settings: NotificationSettings = {
        email: {
          billing: true,
          campaign: true,
          service: true,
          maintenance: false,
        },
        push: {
          billing: true,
          campaign: false,
          dataUsage: true,
        },
        sms: {
          security: true,
          billing: false,
        },
      }

      // Act
      act(() => {
        useAccountStore.getState().setNotificationSettings(settings)
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.notificationSettings).toEqual(settings)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      act(() => {
        useAccountStore.getState().setLoading(true)
      })
      expect(useAccountStore.getState().isLoading).toBe(true)
    })
  })

  describe('setError', () => {
    test('setError_WithErrorMessage_ShouldSetError', () => {
      act(() => {
        useAccountStore.getState().setError('テストエラー')
      })
      expect(useAccountStore.getState().error).toBe('テストエラー')
    })

    test('setError_WithErrorMessage_ShouldSetIsLoadingFalse', () => {
      act(() => {
        useAccountStore.getState().setLoading(true)
      })
      act(() => {
        useAccountStore.getState().setError('テストエラー')
      })
      expect(useAccountStore.getState().isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    test('reset_WhenCalled_ShouldResetAllState', () => {
      // Arrange
      const profile: AccountProfile = {
        userId: 'user-001',
        email: 'test@docomo.ne.jp',
        phone: '090-1234-5678',
        address: {
          postalCode: '100-0001',
          prefecture: '東京都',
          city: '千代田区',
          street: '千代田1-1-1',
        },
      }
      act(() => {
        useAccountStore.getState().setProfile(profile)
        useAccountStore.getState().setError('テストエラー')
      })

      // Act
      act(() => {
        useAccountStore.getState().reset()
      })

      // Assert
      const state = useAccountStore.getState()
      expect(state.profile).toBeNull()
      expect(state.notificationSettings).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })
})
