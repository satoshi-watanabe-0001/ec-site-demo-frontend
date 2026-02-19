/**
 * @fileoverview DeviceInfoWidgetコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DeviceInfoWidget.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeviceInfoWidget } from '../DeviceInfoWidget'
import type { DeviceInfo } from '@/types'

const mockDeviceWithBalance: DeviceInfo = {
  deviceName: 'iPhone 15 Pro',
  imageUrl: '/images/iphone15pro.png',
  purchaseDate: '2025-09-15',
  paymentStatus: '分割払い中',
  remainingBalance: 48000,
  monthlyPayment: 2000,
  remainingMonths: 24,
}

const mockDevicePaidOff: DeviceInfo = {
  deviceName: 'Galaxy S24',
  imageUrl: '/images/galaxy-s24.png',
  purchaseDate: '2024-03-01',
  paymentStatus: '支払い完了',
  remainingBalance: null,
  monthlyPayment: null,
  remainingMonths: null,
}

describe('DeviceInfoWidget', () => {
  test('DeviceInfoWidget_WithValidDevice_ShouldRenderSectionTitle', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText('ご利用端末')).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithValidDevice_ShouldRenderDeviceName', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithValidDevice_ShouldRenderPurchaseDate', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText(/2025年9月15日/)).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithValidDevice_ShouldRenderPaymentStatus', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText(/分割払い中/)).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithRemainingBalance_ShouldRenderBalance', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText(/¥48,000/)).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithMonthlyPayment_ShouldRenderPaymentInfo', () => {
    render(<DeviceInfoWidget device={mockDeviceWithBalance} />)

    expect(screen.getByText(/¥2,000/)).toBeInTheDocument()
    expect(screen.getByText(/残り24回/)).toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithPaidOffDevice_ShouldNotRenderBalance', () => {
    render(<DeviceInfoWidget device={mockDevicePaidOff} />)

    expect(screen.getByText('支払い完了')).toBeInTheDocument()
    expect(screen.queryByText(/残り/)).not.toBeInTheDocument()
  })

  test('DeviceInfoWidget_WithPaidOffDevice_ShouldRenderDeviceName', () => {
    render(<DeviceInfoWidget device={mockDevicePaidOff} />)

    expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
  })
})
