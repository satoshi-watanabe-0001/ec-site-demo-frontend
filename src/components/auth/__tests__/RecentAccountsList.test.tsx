/**
 * @fileoverview RecentAccountsListのユニットテスト
 * @module components/auth/__tests__/RecentAccountsList.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RecentAccountsList } from '../RecentAccountsList'
import { useRecentAccountsStore } from '@/store/recent-accounts-store'
import { act } from '@testing-library/react'

describe('RecentAccountsList', () => {
  const mockOnSelectAccount = jest.fn()

  beforeEach(() => {
    mockOnSelectAccount.mockClear()
    act(() => {
      useRecentAccountsStore.getState().clearAccounts()
    })
  })

  describe('レンダリング', () => {
    test('RecentAccountsList_WithNoAccounts_ShouldReturnNull', () => {
      const { container } = render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)
      expect(container.innerHTML).toBe('')
    })

    test('RecentAccountsList_WithAccounts_ShouldDisplayAccountList', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('testuser@docomo.ne.jp')
      })

      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      expect(screen.getByText('過去にログインしたアカウント')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('testuser@docomo.ne.jp')).toBeInTheDocument()
    })

    test('RecentAccountsList_WithTodayLogin_ShouldDisplayToday', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })

      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      expect(screen.getByText('今日')).toBeInTheDocument()
    })
  })

  describe('インタラクション', () => {
    test('RecentAccountsList_OnClick_ShouldCallOnSelectAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })
      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      fireEvent.click(screen.getByRole('button', { name: 'test@docomo.ne.jpでログイン' }))

      expect(mockOnSelectAccount).toHaveBeenCalledWith('test@docomo.ne.jp')
    })

    test('RecentAccountsList_OnEnterKey_ShouldCallOnSelectAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })
      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      fireEvent.keyDown(screen.getByRole('button', { name: 'test@docomo.ne.jpでログイン' }), {
        key: 'Enter',
      })

      expect(mockOnSelectAccount).toHaveBeenCalledWith('test@docomo.ne.jp')
    })

    test('RecentAccountsList_OnSpaceKey_ShouldCallOnSelectAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })
      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      fireEvent.keyDown(screen.getByRole('button', { name: 'test@docomo.ne.jpでログイン' }), {
        key: ' ',
      })

      expect(mockOnSelectAccount).toHaveBeenCalledWith('test@docomo.ne.jp')
    })

    test('RecentAccountsList_OnRemoveClick_ShouldRemoveAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })
      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      fireEvent.click(screen.getByRole('button', { name: 'test@docomo.ne.jpを履歴から削除' }))

      expect(mockOnSelectAccount).not.toHaveBeenCalled()
      expect(useRecentAccountsStore.getState().accounts).toHaveLength(0)
    })

    test('RecentAccountsList_OnOtherKey_ShouldNotCallOnSelectAccount', () => {
      act(() => {
        useRecentAccountsStore.getState().addAccount('test@docomo.ne.jp')
      })
      render(<RecentAccountsList onSelectAccount={mockOnSelectAccount} />)

      fireEvent.keyDown(screen.getByRole('button', { name: 'test@docomo.ne.jpでログイン' }), {
        key: 'Tab',
      })

      expect(mockOnSelectAccount).not.toHaveBeenCalled()
    })
  })
})
