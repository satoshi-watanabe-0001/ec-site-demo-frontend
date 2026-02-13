/**
 * @fileoverview BillingCardコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/BillingCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingCard } from '../BillingCard'
import type { BillingInfo } from '@/types'

const mockBilling: BillingInfo = {
  contractId: 'contract-001',
  currentBill: {
    basicFee: 2970,
    optionFee: 1100,
    callFee: 220,
    total: 4290,
    previousMonthTotal: 2970,
  },
  history: [],
}

describe('BillingCard', () => {
  describe('レンダリング', () => {
    test('BillingCard_WithBilling_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      expect(screen.getByText('今月の請求予定額')).toBeInTheDocument()
    })

    test('BillingCard_WithBilling_ShouldRenderTotalAmount', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      const totals = screen.getAllByText('¥4,290')
      expect(totals.length).toBeGreaterThanOrEqual(1)
    })

    test('BillingCard_WithBilling_ShouldRenderBasicFee', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      expect(screen.getByText('基本料金')).toBeInTheDocument()
      expect(screen.getByText('¥2,970')).toBeInTheDocument()
    })

    test('BillingCard_WithBilling_ShouldRenderOptionFee', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      expect(screen.getByText('オプション料金')).toBeInTheDocument()
      expect(screen.getByText('¥1,100')).toBeInTheDocument()
    })

    test('BillingCard_WithBilling_ShouldRenderCallFee', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      expect(screen.getByText('通話料')).toBeInTheDocument()
      expect(screen.getByText('¥220')).toBeInTheDocument()
    })

    test('BillingCard_WithBilling_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      const link = screen.getByText('詳細を見る →')
      expect(link).toHaveAttribute('href', '/mypage/billing')
    })
  })

  describe('前月比較', () => {
    test('BillingCard_WithIncrease_ShouldShowPositiveDiff', () => {
      // Arrange & Act
      render(<BillingCard billing={mockBilling} />)

      // Assert
      expect(screen.getByText('前月比 +¥1,320')).toBeInTheDocument()
    })

    test('BillingCard_WithDecrease_ShouldShowNegativeDiff', () => {
      // Arrange
      const decreaseBilling: BillingInfo = {
        ...mockBilling,
        currentBill: { ...mockBilling.currentBill, total: 2000, previousMonthTotal: 2970 },
      }

      // Act
      render(<BillingCard billing={decreaseBilling} />)

      // Assert
      expect(screen.getByText('前月比 ¥970')).toBeInTheDocument()
    })

    test('BillingCard_WithNoDifference_ShouldShowZeroDiff', () => {
      // Arrange
      const sameBilling: BillingInfo = {
        ...mockBilling,
        currentBill: { ...mockBilling.currentBill, total: 2970, previousMonthTotal: 2970 },
      }

      // Act
      render(<BillingCard billing={sameBilling} />)

      // Assert
      expect(screen.getByText('前月比 ¥0')).toBeInTheDocument()
    })
  })
})
