/**
 * @fileoverview BillingSummaryWidgetコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/BillingSummaryWidget.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingSummaryWidget } from '../BillingSummaryWidget'
import type { BillingSummary } from '@/types'

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

const mockBilling: BillingSummary = {
  baseFee: 2970,
  usageCharges: 0,
  optionCharges: 550,
  totalAmount: 3520,
  previousMonthAmount: 2970,
  billingMonth: '2026年2月',
}

describe('BillingSummaryWidget', () => {
  test('BillingSummaryWidget_WithValidData_ShouldRenderSectionTitle', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('今月のご利用料金')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderTotalAmount', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('¥3,520')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderBillingMonth', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('2026年2月')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderBaseFee', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderUsageCharges', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('¥0')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderOptionCharges', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText('¥550')).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithIncreasedBilling_ShouldShowPositiveDiff', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    expect(screen.getByText(/前月比 \+¥550/)).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithDecreasedBilling_ShouldShowNegativeDiff', () => {
    const decreased: BillingSummary = {
      ...mockBilling,
      totalAmount: 2470,
      previousMonthAmount: 2970,
    }
    render(<BillingSummaryWidget billing={decreased} />)

    expect(screen.getByText(/前月比.*¥500/)).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithSameBilling_ShouldShowZeroDiff', () => {
    const same: BillingSummary = {
      ...mockBilling,
      totalAmount: 2970,
      previousMonthAmount: 2970,
    }
    render(<BillingSummaryWidget billing={same} />)

    expect(screen.getByText(/前月比.*¥0/)).toBeInTheDocument()
  })

  test('BillingSummaryWidget_WithValidData_ShouldRenderDetailLink', () => {
    render(<BillingSummaryWidget billing={mockBilling} />)

    const link = screen.getByText('詳細を見る →')
    expect(link.closest('a')).toHaveAttribute('href', '/mypage/billing')
  })
})
