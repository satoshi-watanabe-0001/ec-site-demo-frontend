/**
 * @fileoverview DashboardBillingCardコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DashboardBillingCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardBillingCard } from '../DashboardBillingCard'

describe('DashboardBillingCard', () => {
  const defaultProps = {
    currentMonthEstimate: 3200,
    baseFee: 2970,
    usageAndOptionCharges: 230,
    previousMonthTotal: 2970,
  }

  test('DashboardBillingCard_WithDefaultProps_ShouldRenderEstimate', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByText('¥3,200')).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByText('今月の請求見込み')).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithDefaultProps_ShouldRenderBaseFee', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByText('基本料金')).toBeInTheDocument()
    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithDefaultProps_ShouldRenderUsageCharges', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByText('利用料・オプション')).toBeInTheDocument()
    expect(screen.getByText('¥230')).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithIncrease_ShouldShowUpArrow', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByText(/↑/)).toBeInTheDocument()
    expect(screen.getByText(/前月比/)).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithDecrease_ShouldShowDownArrow', () => {
    render(
      <DashboardBillingCard
        currentMonthEstimate={2500}
        baseFee={2970}
        usageAndOptionCharges={0}
        previousMonthTotal={3200}
      />
    )

    expect(screen.getByText(/↓/)).toBeInTheDocument()
  })

  test('DashboardBillingCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DashboardBillingCard {...defaultProps} />)

    expect(screen.getByTestId('billing-card')).toBeInTheDocument()
  })
})
