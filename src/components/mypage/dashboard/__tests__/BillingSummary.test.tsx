/**
 * @fileoverview BillingSummaryコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/BillingSummary.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BillingSummary } from '../BillingSummary'
import type { CurrentBilling } from '@/types'

describe('BillingSummary', () => {
  const mockBilling: CurrentBilling = {
    billingMonth: '2025-01',
    total: 9963,
    baseFee: 2970,
    optionFee: 1100,
    deviceInstallment: 4987,
    tax: 906,
    dueDate: '2025-01-27',
    status: 'pending',
  }

  describe('レンダリング', () => {
    test('BillingSummary_WithValidBilling_ShouldRenderBillingInfo', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('今月の請求')).toBeInTheDocument()
      expect(screen.getByText('¥9,963')).toBeInTheDocument()
    })

    test('BillingSummary_WithValidBilling_ShouldRenderBaseFee', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('¥2,970')).toBeInTheDocument()
    })

    test('BillingSummary_WithValidBilling_ShouldRenderDueDate', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('2025-01-27')).toBeInTheDocument()
    })

    test('BillingSummary_WithValidBilling_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('請求詳細を見る →')).toBeInTheDocument()
    })
  })

  describe('オプション料金表示', () => {
    test('BillingSummary_WithOptionFee_ShouldShowOptionFee', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('オプション料金')).toBeInTheDocument()
      expect(screen.getByText('¥1,100')).toBeInTheDocument()
    })

    test('BillingSummary_WithoutOptionFee_ShouldNotShowOptionFee', () => {
      // Arrange
      const billingWithoutOption = { ...mockBilling, optionFee: 0 }

      // Act
      render(<BillingSummary billing={billingWithoutOption} />)

      // Assert
      expect(screen.queryByText('オプション料金')).not.toBeInTheDocument()
    })
  })

  describe('端末分割払い表示', () => {
    test('BillingSummary_WithDeviceInstallment_ShouldShowDeviceInstallment', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('端末分割払い')).toBeInTheDocument()
      expect(screen.getByText('¥4,987')).toBeInTheDocument()
    })

    test('BillingSummary_WithoutDeviceInstallment_ShouldNotShowDeviceInstallment', () => {
      // Arrange
      const billingWithoutDevice = { ...mockBilling, deviceInstallment: 0 }

      // Act
      render(<BillingSummary billing={billingWithoutDevice} />)

      // Assert
      expect(screen.queryByText('端末分割払い')).not.toBeInTheDocument()
    })
  })

  describe('ステータス表示', () => {
    test('BillingSummary_WithPendingStatus_ShouldShowPendingLabel', () => {
      // Arrange & Act
      render(<BillingSummary billing={mockBilling} />)

      // Assert
      expect(screen.getByText('請求予定')).toBeInTheDocument()
    })

    test('BillingSummary_WithPaidStatus_ShouldShowPaidLabel', () => {
      // Arrange
      const paidBilling = { ...mockBilling, status: 'paid' as const }

      // Act
      render(<BillingSummary billing={paidBilling} />)

      // Assert
      expect(screen.getByText('支払い済み')).toBeInTheDocument()
    })

    test('BillingSummary_WithOverdueStatus_ShouldShowOverdueLabel', () => {
      // Arrange
      const overdueBilling = { ...mockBilling, status: 'overdue' as const }

      // Act
      render(<BillingSummary billing={overdueBilling} />)

      // Assert
      expect(screen.getByText('支払い期限超過')).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('BillingSummary_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<BillingSummary billing={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('今月の請求')).not.toBeInTheDocument()
      expect(screen.queryByText('¥9,963')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('BillingSummary_WithNullBilling_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<BillingSummary billing={null} />)

      // Assert
      expect(screen.getByText('請求情報を取得できませんでした')).toBeInTheDocument()
    })
  })
})
