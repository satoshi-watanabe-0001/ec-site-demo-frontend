/**
 * @fileoverview BillingSummaryCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/BillingSummaryCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { BillingSummaryCard } from '../BillingSummaryCard'
import type { BillingInfo } from '@/types'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockBilling: BillingInfo = {
  currentMonthEstimate: {
    month: '2024-01',
    basicFee: 2970,
    callFee: 220,
    optionFee: 1100,
    discount: 0,
    totalAmount: 4290,
    items: [
      { itemName: '基本料金', amount: 2970 },
      { itemName: '通話料', amount: 220 },
      { itemName: 'オプション', amount: 1100 },
    ],
    isConfirmed: false,
  },
  history: [
    {
      month: '2023-12',
      basicFee: 2970,
      callFee: 0,
      optionFee: 1100,
      discount: 0,
      totalAmount: 4070,
      items: [],
      isConfirmed: true,
    },
  ],
  paymentMethod: {
    type: 'credit_card',
    displayName: 'VISA ****1234',
    expiryDate: '12/25',
  },
}

const mockBillingNoHistory: BillingInfo = {
  ...mockBilling,
  history: [],
}

describe('BillingSummaryCard', () => {
  test('BillingSummaryCard_WithEstimate_ShouldDisplayTotalAmount', () => {
    render(<BillingSummaryCard billing={mockBilling} />)

    expect(screen.getByText('今月のご利用料金')).toBeInTheDocument()
    expect(screen.getByText('¥4,290')).toBeInTheDocument()
    expect(screen.getByText('見込み（税込）')).toBeInTheDocument()
  })

  test('BillingSummaryCard_WithHistory_ShouldDisplayDifference', () => {
    render(<BillingSummaryCard billing={mockBilling} />)

    expect(screen.getByText('前月比 +¥220')).toBeInTheDocument()
  })

  test('BillingSummaryCard_WithNoHistory_ShouldNotDisplayDifference', () => {
    render(<BillingSummaryCard billing={mockBillingNoHistory} />)

    expect(screen.queryByText(/前月比/)).not.toBeInTheDocument()
  })

  test('BillingSummaryCard_WithConfirmed_ShouldDisplayConfirmed', () => {
    const confirmed: BillingInfo = {
      ...mockBilling,
      currentMonthEstimate: { ...mockBilling.currentMonthEstimate, isConfirmed: true },
    }
    render(<BillingSummaryCard billing={confirmed} />)

    expect(screen.getByText('確定')).toBeInTheDocument()
  })

  test('BillingSummaryCard_ShouldDisplayItems', () => {
    render(<BillingSummaryCard billing={mockBilling} />)

    expect(screen.getByText('基本料金')).toBeInTheDocument()
    expect(screen.getByText('通話料')).toBeInTheDocument()
    expect(screen.getByText('オプション')).toBeInTheDocument()
  })

  test('BillingSummaryCard_ShouldDisplayPaymentMethod', () => {
    render(<BillingSummaryCard billing={mockBilling} />)

    expect(screen.getByText('VISA ****1234')).toBeInTheDocument()
  })

  test('BillingSummaryCard_ShouldHaveDetailLink', () => {
    render(<BillingSummaryCard billing={mockBilling} />)

    const detailLink = screen.getByText('詳細')
    expect(detailLink.closest('a')).toHaveAttribute('href', '/mypage/billing')
  })
})
