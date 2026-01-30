/**
 * @fileoverview BillingHistoryコンポーネントのユニットテスト
 * @module components/mypage/billing/__tests__/BillingHistory.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingHistory } from '../BillingHistory'
import type { BillingHistoryItem } from '@/types'

describe('BillingHistory', () => {
  const mockHistory: BillingHistoryItem[] = [
    {
      billingId: 'bill-001',
      billingMonth: '2025年1月',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 4987,
      tax: 906,
      total: 9963,
      status: 'paid',
      paidDate: '2025-01-27',
    },
    {
      billingId: 'bill-002',
      billingMonth: '2024年12月',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 500,
      dataOverageCharges: 0,
      deviceInstallment: 4987,
      tax: 955,
      total: 10512,
      status: 'paid',
      paidDate: '2024-12-27',
    },
  ]

  describe('レンダリング', () => {
    test('BillingHistory_WithValidHistory_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      expect(screen.getByText('請求履歴')).toBeInTheDocument()
    })

    test('BillingHistory_WithValidHistory_ShouldRenderBillingMonths', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      expect(screen.getByText('2025年1月')).toBeInTheDocument()
      expect(screen.getByText('2024年12月')).toBeInTheDocument()
    })

    test('BillingHistory_WithValidHistory_ShouldRenderTotals', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      expect(screen.getByText('¥9,963')).toBeInTheDocument()
      expect(screen.getByText('¥10,512')).toBeInTheDocument()
    })
  })

  describe('ステータス表示', () => {
    test('BillingHistory_WithPaidStatus_ShouldShowPaidLabel', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      const paidLabels = screen.getAllByText('支払い済み')
      expect(paidLabels.length).toBe(2)
    })

    test('BillingHistory_WithPendingStatus_ShouldShowPendingLabel', () => {
      // Arrange
      const pendingHistory = [{ ...mockHistory[0], status: 'pending' as const }]

      // Act
      render(<BillingHistory history={pendingHistory} />)

      // Assert
      expect(screen.getByText('請求中')).toBeInTheDocument()
    })

    test('BillingHistory_WithOverdueStatus_ShouldShowOverdueLabel', () => {
      // Arrange
      const overdueHistory = [{ ...mockHistory[0], status: 'overdue' as const }]

      // Act
      render(<BillingHistory history={overdueHistory} />)

      // Assert
      expect(screen.getByText('支払い期限超過')).toBeInTheDocument()
    })
  })

  describe('オプション料金表示', () => {
    test('BillingHistory_WithOptionFee_ShouldShowOptionFee', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      expect(screen.getAllByText('オプション料金').length).toBeGreaterThan(0)
    })

    test('BillingHistory_WithCallCharges_ShouldShowCallCharges', () => {
      // Arrange & Act
      render(<BillingHistory history={mockHistory} />)

      // Assert
      expect(screen.getByText('通話料')).toBeInTheDocument()
    })
  })

  describe('空の履歴', () => {
    test('BillingHistory_WithEmptyHistory_ShouldShowEmptyMessage', () => {
      // Arrange & Act
      render(<BillingHistory history={[]} />)

      // Assert
      expect(screen.getByText('請求履歴がありません')).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('BillingHistory_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<BillingHistory history={[]} isLoading={true} />)

      // Assert
      expect(screen.queryByText('請求履歴')).not.toBeInTheDocument()
    })
  })
})
