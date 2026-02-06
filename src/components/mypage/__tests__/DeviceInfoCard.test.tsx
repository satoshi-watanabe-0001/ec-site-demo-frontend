/**
 * @fileoverview DeviceInfoCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/DeviceInfoCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { DeviceInfoCard } from '../DeviceInfoCard'
import type { DeviceInfo } from '@/types'

const mockDevice: DeviceInfo = {
  deviceId: 'device-001',
  name: 'iPhone 15 Pro Max',
  imageUrl: '/images/iphone15promax.png',
  purchaseDate: '2024-01-15',
  remainingPayments: 12,
  monthlyPayment: 3750,
  remainingBalance: 45000,
  imei: '123456789012345',
}

const mockDevicePaidOff: DeviceInfo = {
  ...mockDevice,
  remainingPayments: 0,
  monthlyPayment: 0,
  remainingBalance: 0,
}

describe('DeviceInfoCard', () => {
  test('DeviceInfoCard_WithDevice_ShouldDisplayDeviceName', () => {
    render(<DeviceInfoCard device={mockDevice} />)

    expect(screen.getByText('ご利用端末')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
  })

  test('DeviceInfoCard_WithRemainingPayments_ShouldDisplayPaymentInfo', () => {
    render(<DeviceInfoCard device={mockDevice} />)

    expect(screen.getByText('¥3,750')).toBeInTheDocument()
    expect(screen.getByText('12回')).toBeInTheDocument()
    expect(screen.getByText('¥45,000')).toBeInTheDocument()
  })

  test('DeviceInfoCard_WithPaidOff_ShouldNotDisplayPaymentInfo', () => {
    render(<DeviceInfoCard device={mockDevicePaidOff} />)

    expect(screen.queryByText('月々のお支払い')).not.toBeInTheDocument()
    expect(screen.queryByText('残り回数')).not.toBeInTheDocument()
  })

  test('DeviceInfoCard_WithNull_ShouldDisplayNoDeviceMessage', () => {
    render(<DeviceInfoCard device={null} />)

    expect(screen.getByText('端末情報が登録されていません。')).toBeInTheDocument()
  })

  test('DeviceInfoCard_WithClassName_ShouldApplyClassName', () => {
    const { container } = render(<DeviceInfoCard device={mockDevice} className="test-class" />)

    expect(container.firstChild).toHaveClass('test-class')
  })

  test('DeviceInfoCard_WithNullAndClassName_ShouldApplyClassName', () => {
    const { container } = render(<DeviceInfoCard device={null} className="test-class" />)

    expect(container.firstChild).toHaveClass('test-class')
  })
})
