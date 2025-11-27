/**
 * @fileoverview auth-storeのユニットテスト
 * @module store/__tests__/auth-store.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useAuthStore, User } from '../auth-store'
import { act } from '@testing-library/react'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  describe('初期状態', () => {
    test('useAuthStore_InitialState_ShouldHaveNullUser', () => {
      // Arrange & Act
      const state = useAuthStore.getState()

      // Assert
      expect(state.user).toBeNull()
    })

    test('useAuthStore_InitialState_ShouldNotBeAuthenticated', () => {
      // Arrange & Act
      const state = useAuthStore.getState()

      // Assert
      expect(state.isAuthenticated).toBe(false)
    })

    test('useAuthStore_InitialState_ShouldNotBeLoading', () => {
      // Arrange & Act
      const state = useAuthStore.getState()

      // Assert
      expect(state.isLoading).toBe(false)
    })
  })

  describe('login', () => {
    test('login_WithValidUser_ShouldSetUser', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }

      // Act
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
    })

    test('login_WithValidUser_ShouldSetIsAuthenticatedTrue', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }

      // Act
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
    })

    test('login_WithValidUser_ShouldSetIsLoadingFalse', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }

      // Act
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    test('logout_WhenLoggedIn_ShouldClearUser', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Act
      act(() => {
        useAuthStore.getState().logout()
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
    })

    test('logout_WhenLoggedIn_ShouldSetIsAuthenticatedFalse', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Act
      act(() => {
        useAuthStore.getState().logout()
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })

    test('logout_WhenLoggedIn_ShouldSetIsLoadingFalse', () => {
      // Arrange
      const user: User = {
        id: 'user-001',
        name: 'テストユーザー',
        email: 'test@example.com',
      }
      act(() => {
        useAuthStore.getState().login(user)
      })

      // Act
      act(() => {
        useAuthStore.getState().logout()
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('setLoading', () => {
    test('setLoading_WithTrue_ShouldSetIsLoadingTrue', () => {
      // Arrange & Act
      act(() => {
        useAuthStore.getState().setLoading(true)
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(true)
    })

    test('setLoading_WithFalse_ShouldSetIsLoadingFalse', () => {
      // Arrange
      act(() => {
        useAuthStore.getState().setLoading(true)
      })

      // Act
      act(() => {
        useAuthStore.getState().setLoading(false)
      })

      // Assert
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })
})
