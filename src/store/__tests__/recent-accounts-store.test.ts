/**
 * @fileoverview recent-accounts-storeのユニットテスト
 * @module store/__tests__/recent-accounts-store.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { useRecentAccountsStore } from '../recent-accounts-store'
import { act } from '@testing-library/react'

describe('useRecentAccountsStore', () => {
  beforeEach(() => {
    act(() => {
      useRecentAccountsStore.getState().clearAccounts()
    })
  })

  describe('初期状態', () => {
    test('useRecentAccountsStore_InitialState_ShouldHaveEmptyAccounts', () => {
      const state = useRecentAccountsStore.getState()

      expect(state.accounts).toEqual([])
    })
  })

  describe('addAccount', () => {
    test('addAccount_WithValidEmail_ShouldAddAccount', () => {
      const email = 'test@example.com'

      act(() => {
        useRecentAccountsStore.getState().addAccount(email)
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toHaveLength(1)
      expect(state.accounts[0].email).toBe(email)
      expect(state.accounts[0].displayName).toBe('test')
    })

    test('addAccount_WithValidEmail_ShouldSetLastLoginAt', () => {
      const email = 'test@example.com'
      const beforeAdd = new Date().toISOString()

      act(() => {
        useRecentAccountsStore.getState().addAccount(email)
      })

      const state = useRecentAccountsStore.getState()
      const afterAdd = new Date().toISOString()
      expect(state.accounts[0].lastLoginAt >= beforeAdd).toBe(true)
      expect(state.accounts[0].lastLoginAt <= afterAdd).toBe(true)
    })

    test('addAccount_WithExistingEmail_ShouldMoveToTop', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('first@example.com')
        useRecentAccountsStore.getState().addAccount('second@example.com')
        useRecentAccountsStore.getState().addAccount('first@example.com')
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toHaveLength(2)
      expect(state.accounts[0].email).toBe('first@example.com')
      expect(state.accounts[1].email).toBe('second@example.com')
    })

    test('addAccount_WithMoreThanFiveAccounts_ShouldLimitToFive', () => {
      act(() => {
        for (let i = 1; i <= 6; i++) {
          useRecentAccountsStore.getState().addAccount(`user${i}@example.com`)
        }
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toHaveLength(5)
      expect(state.accounts[0].email).toBe('user6@example.com')
      expect(state.accounts[4].email).toBe('user2@example.com')
    })
  })

  describe('removeAccount', () => {
    test('removeAccount_WithExistingEmail_ShouldRemoveAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@example.com')
        useRecentAccountsStore.getState().addAccount('other@example.com')
      })

      act(() => {
        useRecentAccountsStore.getState().removeAccount('test@example.com')
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toHaveLength(1)
      expect(state.accounts[0].email).toBe('other@example.com')
    })

    test('removeAccount_WithNonExistingEmail_ShouldNotChangeAccounts', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@example.com')
      })

      act(() => {
        useRecentAccountsStore.getState().removeAccount('nonexistent@example.com')
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toHaveLength(1)
      expect(state.accounts[0].email).toBe('test@example.com')
    })
  })

  describe('clearAccounts', () => {
    test('clearAccounts_WithExistingAccounts_ShouldRemoveAllAccounts', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test1@example.com')
        useRecentAccountsStore.getState().addAccount('test2@example.com')
        useRecentAccountsStore.getState().addAccount('test3@example.com')
      })

      act(() => {
        useRecentAccountsStore.getState().clearAccounts()
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toEqual([])
    })

    test('clearAccounts_WithEmptyAccounts_ShouldRemainEmpty', () => {
      act(() => {
        useRecentAccountsStore.getState().clearAccounts()
      })

      const state = useRecentAccountsStore.getState()
      expect(state.accounts).toEqual([])
    })
  })
})
