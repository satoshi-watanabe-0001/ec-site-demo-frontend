/**
 * @fileoverview DeviceInfoコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/DeviceInfo.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DeviceInfo } from '../DeviceInfo'
import type { DeviceInfo as DeviceInfoType } from '@/types'

describe('DeviceInfo', () => {
  const mockDevice: DeviceInfoType = {
    deviceId: 'dev-001',
    deviceName: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    modelNumber: 'A3101',
    imei: '123456789012345',
    purchaseDate: '2024-01-15',
    warrantyEndDate: '2025-01-15',
    installmentBalance: 50000,
    installmentRemainingCount: 12,
  }

  describe('レンダリング', () => {
    test('DeviceInfo_WithValidDevice_ShouldRenderDeviceInfo', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('ご利用端末')).toBeInTheDocument()
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    })

    test('DeviceInfo_WithValidDevice_ShouldRenderManufacturer', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    test('DeviceInfo_WithValidDevice_ShouldRenderModelNumber', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('A3101')).toBeInTheDocument()
    })

    test('DeviceInfo_WithValidDevice_ShouldRenderIMEI', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('123456789012345')).toBeInTheDocument()
    })

    test('DeviceInfo_WithValidDevice_ShouldRenderPurchaseDate', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    })
  })

  describe('保証期限表示', () => {
    test('DeviceInfo_WithWarrantyEndDate_ShouldShowWarrantyEndDate', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('保証期限')).toBeInTheDocument()
      expect(screen.getByText('2025-01-15')).toBeInTheDocument()
    })

    test('DeviceInfo_WithoutWarrantyEndDate_ShouldNotShowWarrantyEndDate', () => {
      // Arrange
      const deviceWithoutWarranty = { ...mockDevice, warrantyEndDate: '' }

      // Act
      render(<DeviceInfo device={deviceWithoutWarranty} />)

      // Assert
      expect(screen.queryByText('保証期限')).not.toBeInTheDocument()
    })
  })

  describe('分割払い情報表示', () => {
    test('DeviceInfo_WithInstallmentBalance_ShouldShowInstallmentInfo', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('分割払い残高')).toBeInTheDocument()
      expect(screen.getByText('¥50,000')).toBeInTheDocument()
    })

    test('DeviceInfo_WithInstallmentRemainingCount_ShouldShowRemainingCount', () => {
      // Arrange & Act
      render(<DeviceInfo device={mockDevice} />)

      // Assert
      expect(screen.getByText('残り回数')).toBeInTheDocument()
      expect(screen.getByText('12回')).toBeInTheDocument()
    })

    test('DeviceInfo_WithoutInstallmentBalance_ShouldNotShowInstallmentInfo', () => {
      // Arrange
      const deviceWithoutInstallment = { ...mockDevice, installmentBalance: 0 }

      // Act
      render(<DeviceInfo device={deviceWithoutInstallment} />)

      // Assert
      expect(screen.queryByText('分割払い残高')).not.toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('DeviceInfo_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<DeviceInfo device={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('ご利用端末')).not.toBeInTheDocument()
      expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('DeviceInfo_WithNullDevice_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<DeviceInfo device={null} />)

      // Assert
      expect(screen.getByText('端末情報を取得できませんでした')).toBeInTheDocument()
    })
  })
})
