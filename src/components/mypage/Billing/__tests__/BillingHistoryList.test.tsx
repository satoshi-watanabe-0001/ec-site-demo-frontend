/**
 * @fileoverview BillingHistoryListコンポーネントのユニットテスト
 * @module components/mypage/Billing/__tests__/BillingHistoryList.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingHistoryList } from '../BillingHistoryList'
import type { BillingHistoryItem } from '@/types'

describe('BillingHistoryList', () => {
  const mockHistory: BillingHistoryItem[] = [
    { billingMonth: '2026年1月', total: 3300, paymentStatus: 'paid', paidDate: '2026-02-25' },
    { billingMonth: '2025年12月', total: 2970, paymentStatus: 'paid', paidDate: '2026-01-25' },
    { billingMonth: '2025年11月', total: 3520, paymentStatus: 'overdue' },
  ]

  test('BillingHistoryList_WithHistory_ShouldRenderAllItems', () => {
    render(<BillingHistoryList history={mockHistory} />)

    expect(screen.getByText('2026年1月')).toBeInTheDocument()
    expect(screen.getByText('2025年12月')).toBeInTheDocument()
    expect(screen.getByText('2025年11月')).toBeInTheDocument()
  })

  test('BillingHistoryList_WithHistory_ShouldRenderTotalAmounts', () => {
    render(<BillingHistoryList history={mockHistory} />)

    expect(screen.getByText('¥3,300')).toBeInTheDocument()
    expect(screen.getByText('¥2,970')).toBeInTheDocument()
    expect(screen.getByText('¥3,520')).toBeInTheDocument()
  })

  test('BillingHistoryList_WithPaidItems_ShouldShowPaidStatus', () => {
    render(<BillingHistoryList history={mockHistory} />)

    const paidLabels = screen.getAllByText('支払い済み')
    expect(paidLabels).toHaveLength(2)
  })

  test('BillingHistoryList_WithOverdueItem_ShouldShowOverdueStatus', () => {
    render(<BillingHistoryList history={mockHistory} />)

    expect(screen.getByText('未払い')).toBeInTheDocument()
  })

  test('BillingHistoryList_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<BillingHistoryList history={mockHistory} />)

    expect(screen.getByText('請求履歴')).toBeInTheDocument()
  })

  test('BillingHistoryList_WithDefaultProps_ShouldHaveTestId', () => {
    render(<BillingHistoryList history={mockHistory} />)

    expect(screen.getByTestId('billing-history')).toBeInTheDocument()
  })
})
