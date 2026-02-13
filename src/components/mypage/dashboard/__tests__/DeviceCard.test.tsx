/**
 * @fileoverview DeviceCardコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/DeviceCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeviceCard } from '../DeviceCard'
import type { DeviceInfo } from '@/types'

const mockDevice: DeviceInfo = {
  id: 'device-001',
  name: 'iPhone 16 Pro',
  imageUrl: '/images/devices/iphone-16-pro.png',
  purchaseDate: '2024-10-01',
  remainingBalance: 48000,
}

describe('DeviceCard', () => {
  describe('レンダリング', () => {
    test('DeviceCard_WithDevice_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<DeviceCard device={mockDevice} />)

      // Assert
      expect(screen.getByText('契約中の端末')).toBeInTheDocument()
    })

    test('DeviceCard_WithDevice_ShouldRenderDeviceName', () => {
      // Arrange & Act
      render(<DeviceCard device={mockDevice} />)

      // Assert
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
    })

    test('DeviceCard_WithDevice_ShouldRenderImage', () => {
      // Arrange & Act
      render(<DeviceCard device={mockDevice} />)

      // Assert
      const img = screen.getByAltText('iPhone 16 Pro')
      expect(img).toBeInTheDocument()
    })
  })

  describe('分割払い残額', () => {
    test('DeviceCard_WithRemainingBalance_ShouldRenderBalance', () => {
      // Arrange & Act
      render(<DeviceCard device={mockDevice} />)

      // Assert
      expect(screen.getByText('¥48,000')).toBeInTheDocument()
      expect(screen.getByText('分割払い残額')).toBeInTheDocument()
    })

    test('DeviceCard_WithoutRemainingBalance_ShouldNotRenderBalance', () => {
      // Arrange
      const deviceNoBalance: DeviceInfo = {
        ...mockDevice,
        remainingBalance: undefined,
      }

      // Act
      render(<DeviceCard device={deviceNoBalance} />)

      // Assert
      expect(screen.queryByText('分割払い残額')).not.toBeInTheDocument()
    })
  })
})
