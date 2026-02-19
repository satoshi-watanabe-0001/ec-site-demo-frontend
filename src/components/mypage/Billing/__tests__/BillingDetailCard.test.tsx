/**
 * @fileoverview BillingDetailCardコンポーネントのユニットテスト
 * @module components/mypage/Billing/__tests__/BillingDetailCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingDetailCard } from '../BillingDetailCard'
import type { BillingInfo } from '@/types'

describe('BillingDetailCard', () => {
  const mockBilling: BillingInfo = {
    billingMonth: '2026年2月',
    breakdown: {
      baseFee: 2970,
      usageCharges: 0,
      optionCharges: 550,
      discount: 220,
      tax: 330,
      total: 3630,
    },
    paymentMethod: 'クレジットカード',
    paymentStatus: 'pending',
    dueDate: '2026-03-25',
    previousMonthTotal: 3300,
  }

  test('BillingDetailCard_WithPendingBilling_ShouldRenderTotalAmount', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    const totals = screen.getAllByText('¥3,630')
    expect(totals.length).toBeGreaterThanOrEqual(1)
  })

  test('BillingDetailCard_WithPendingBilling_ShouldShowPendingStatus', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByText('未確定')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithPaidBilling_ShouldShowPaidStatus', () => {
    const paid = { ...mockBilling, paymentStatus: 'paid' as const }
    render(<BillingDetailCard billing={paid} />)

    expect(screen.getByText('支払い済み')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithBilling_ShouldRenderBaseFee', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByText('基本料金')).toBeInTheDocument()
    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithBilling_ShouldRenderOptionCharges', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByText('オプション料金')).toBeInTheDocument()
    expect(screen.getByText('¥550')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithDiscount_ShouldRenderDiscount', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByText('割引')).toBeInTheDocument()
    expect(screen.getByText('-¥220')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithNoDiscount_ShouldNotRenderDiscount', () => {
    const noDiscount = {
      ...mockBilling,
      breakdown: { ...mockBilling.breakdown, discount: 0 },
    }
    render(<BillingDetailCard billing={noDiscount} />)

    expect(screen.queryByText('割引')).not.toBeInTheDocument()
  })

  test('BillingDetailCard_WithBilling_ShouldRenderBillingMonth', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    const monthTexts = screen.getAllByText(/2026年2月/)
    expect(monthTexts.length).toBeGreaterThanOrEqual(1)
  })

  test('BillingDetailCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByText('請求情報')).toBeInTheDocument()
  })

  test('BillingDetailCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<BillingDetailCard billing={mockBilling} />)

    expect(screen.getByTestId('billing-detail')).toBeInTheDocument()
  })
})
