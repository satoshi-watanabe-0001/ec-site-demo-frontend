/**
 * @fileoverview DashboardDeviceCardコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DashboardDeviceCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardDeviceCard } from '../DashboardDeviceCard'

jest.mock('lucide-react', () => ({
  Smartphone: ({ className }: { className: string }) => (
    <svg data-testid="smartphone-icon" className={className} />
  ),
}))

describe('DashboardDeviceCard', () => {
  test('DashboardDeviceCard_WithPaidDevice_ShouldRenderDeviceName', () => {
    render(
      <DashboardDeviceCard
        name="iPhone 16 Pro"
        purchaseDate="2025-09-20T00:00:00Z"
        paymentStatus="paid"
      />
    )

    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
  })

  test('DashboardDeviceCard_WithPaidDevice_ShouldShowPaidStatus', () => {
    render(
      <DashboardDeviceCard
        name="iPhone 16 Pro"
        purchaseDate="2025-09-20T00:00:00Z"
        paymentStatus="paid"
      />
    )

    expect(screen.getByText('支払い完了')).toBeInTheDocument()
  })

  test('DashboardDeviceCard_WithInstallment_ShouldShowRemainingBalance', () => {
    render(
      <DashboardDeviceCard
        name="iPhone 16 Pro"
        purchaseDate="2025-09-20T00:00:00Z"
        paymentStatus="installment"
        remainingBalance={95200}
      />
    )

    expect(screen.getByText(/分割残額/)).toBeInTheDocument()
    expect(screen.getByText(/¥95,200/)).toBeInTheDocument()
  })

  test('DashboardDeviceCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(
      <DashboardDeviceCard
        name="iPhone 16 Pro"
        purchaseDate="2025-09-20T00:00:00Z"
        paymentStatus="paid"
      />
    )

    expect(screen.getByText('ご利用端末')).toBeInTheDocument()
  })

  test('DashboardDeviceCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(
      <DashboardDeviceCard
        name="iPhone 16 Pro"
        purchaseDate="2025-09-20T00:00:00Z"
        paymentStatus="paid"
      />
    )

    expect(screen.getByTestId('device-card')).toBeInTheDocument()
  })
})
