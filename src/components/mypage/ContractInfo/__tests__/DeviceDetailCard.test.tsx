/**
 * @fileoverview DeviceDetailCardコンポーネントのユニットテスト
 * @module components/mypage/ContractInfo/__tests__/DeviceDetailCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeviceDetailCard } from '../DeviceDetailCard'
import type { DeviceInfo } from '@/types'

jest.mock('lucide-react', () => ({
  Smartphone: ({ className }: { className: string }) => (
    <svg data-testid="smartphone-icon" className={className} />
  ),
}))

describe('DeviceDetailCard', () => {
  const paidDevice: DeviceInfo = {
    id: 'D001',
    name: 'iPhone 16 Pro',
    imageUrl: '/images/iphone16pro.png',
    purchaseDate: '2025-09-20',
    paymentStatus: 'paid',
  }

  const installmentDevice: DeviceInfo = {
    id: 'D002',
    name: 'Galaxy S25 Ultra',
    imageUrl: '/images/galaxy.png',
    purchaseDate: '2025-06-01',
    paymentStatus: 'installment',
    remainingBalance: 95200,
    totalInstallments: 24,
    completedInstallments: 8,
  }

  test('DeviceDetailCard_WithPaidDevice_ShouldRenderDeviceName', () => {
    render(<DeviceDetailCard device={paidDevice} />)

    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithPaidDevice_ShouldShowPaidStatus', () => {
    render(<DeviceDetailCard device={paidDevice} />)

    expect(screen.getByText('支払い完了')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithInstallmentDevice_ShouldShowInstallmentStatus', () => {
    render(<DeviceDetailCard device={installmentDevice} />)

    expect(screen.getByText('分割払い中')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithInstallmentDevice_ShouldShowRemainingBalance', () => {
    render(<DeviceDetailCard device={installmentDevice} />)

    expect(screen.getByText('¥95,200')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithInstallmentDevice_ShouldShowInstallmentProgress', () => {
    render(<DeviceDetailCard device={installmentDevice} />)

    expect(screen.getByText('8/24回')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DeviceDetailCard device={paidDevice} />)

    expect(screen.getByText('端末情報')).toBeInTheDocument()
  })

  test('DeviceDetailCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DeviceDetailCard device={paidDevice} />)

    expect(screen.getByTestId('device-detail')).toBeInTheDocument()
  })
})
