/**
 * @fileoverview BillingHistoryTableコンポーネントのユニットテスト
 * @module components/mypage/__tests__/BillingHistoryTable.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingHistoryTable } from '../BillingHistoryTable'
import type { BillingHistoryItem } from '@/types/account'

const mockHistory: BillingHistoryItem[] = [
  { month: '2024年3月', amount: 3470, status: 'paid', paidAt: '2024-03-25' },
  { month: '2024年2月', amount: 2970, status: 'pending', paidAt: null },
  { month: '2024年1月', amount: 4500, status: 'overdue', paidAt: null },
]

describe('BillingHistoryTable', () => {
  describe('レンダリング', () => {
    test('BillingHistoryTable_WithHistory_ShouldRenderTableHeaders', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={mockHistory} />)

      // Assert
      expect(screen.getByText('請求月')).toBeInTheDocument()
      expect(screen.getByText('請求額')).toBeInTheDocument()
      expect(screen.getByText('ステータス')).toBeInTheDocument()
      expect(screen.getByText('支払日')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithHistory_ShouldRenderMonths', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={mockHistory} />)

      // Assert
      expect(screen.getByText('2024年3月')).toBeInTheDocument()
      expect(screen.getByText('2024年2月')).toBeInTheDocument()
      expect(screen.getByText('2024年1月')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithHistory_ShouldRenderAmounts', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={mockHistory} />)

      // Assert
      expect(screen.getByText(/3,470/)).toBeInTheDocument()
      expect(screen.getByText(/2,970/)).toBeInTheDocument()
      expect(screen.getByText(/4,500/)).toBeInTheDocument()
    })
  })

  describe('ステータス表示', () => {
    test('BillingHistoryTable_WithPaidStatus_ShouldShowPaidLabel', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[0]]} />)

      // Assert
      expect(screen.getByText('支払済')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithPendingStatus_ShouldShowPendingLabel', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[1]]} />)

      // Assert
      expect(screen.getByText('未払い')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithOverdueStatus_ShouldShowOverdueLabel', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[2]]} />)

      // Assert
      expect(screen.getByText('延滞')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithPaidStatus_ShouldApplyGreenColor', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[0]]} />)

      // Assert
      const statusBadge = screen.getByText('支払済')
      expect(statusBadge).toHaveClass('bg-green-500/20', 'text-green-400')
    })

    test('BillingHistoryTable_WithPendingStatus_ShouldApplyYellowColor', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[1]]} />)

      // Assert
      const statusBadge = screen.getByText('未払い')
      expect(statusBadge).toHaveClass('bg-yellow-500/20', 'text-yellow-400')
    })

    test('BillingHistoryTable_WithOverdueStatus_ShouldApplyRedColor', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[2]]} />)

      // Assert
      const statusBadge = screen.getByText('延滞')
      expect(statusBadge).toHaveClass('bg-red-500/20', 'text-red-400')
    })
  })

  describe('支払日表示', () => {
    test('BillingHistoryTable_WithPaidAt_ShouldShowPaymentDate', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[0]]} />)

      // Assert
      expect(screen.getByText('2024-03-25')).toBeInTheDocument()
    })

    test('BillingHistoryTable_WithNoPaidAt_ShouldShowDash', () => {
      // Arrange & Act
      render(<BillingHistoryTable history={[mockHistory[1]]} />)

      // Assert
      expect(screen.getByText('-')).toBeInTheDocument()
    })
  })
})
