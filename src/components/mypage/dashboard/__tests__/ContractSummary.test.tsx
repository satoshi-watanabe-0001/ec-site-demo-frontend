/**
 * @fileoverview ContractSummaryコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/ContractSummary.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ContractSummary } from '../ContractSummary'
import type { ContractSummary as ContractSummaryType } from '@/types'

describe('ContractSummary', () => {
  const mockSummary: ContractSummaryType = {
    contractId: 'CNT-001',
    planName: 'ahamo',
    phoneNumber: '090-1234-5678',
    monthlyBaseFee: 2970,
    startDate: '2023-04-01',
    status: 'active',
  }

  describe('レンダリング', () => {
    test('ContractSummary_WithValidSummary_ShouldRenderContractInfo', () => {
      // Arrange & Act
      render(<ContractSummary summary={mockSummary} />)

      // Assert
      expect(screen.getByText('契約情報')).toBeInTheDocument()
      expect(screen.getByText('ahamo')).toBeInTheDocument()
      expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
    })

    test('ContractSummary_WithValidSummary_ShouldRenderMonthlyFee', () => {
      // Arrange & Act
      render(<ContractSummary summary={mockSummary} />)

      // Assert
      expect(screen.getByText('¥2,970')).toBeInTheDocument()
    })

    test('ContractSummary_WithValidSummary_ShouldRenderStartDate', () => {
      // Arrange & Act
      render(<ContractSummary summary={mockSummary} />)

      // Assert
      expect(screen.getByText('2023-04-01')).toBeInTheDocument()
    })

    test('ContractSummary_WithValidSummary_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<ContractSummary summary={mockSummary} />)

      // Assert
      expect(screen.getByText('契約詳細を見る →')).toBeInTheDocument()
    })
  })

  describe('ステータス表示', () => {
    test('ContractSummary_WithActiveStatus_ShouldShowActiveLabel', () => {
      // Arrange & Act
      render(<ContractSummary summary={mockSummary} />)

      // Assert
      expect(screen.getByText('契約中')).toBeInTheDocument()
    })

    test('ContractSummary_WithSuspendedStatus_ShouldShowSuspendedLabel', () => {
      // Arrange
      const suspendedSummary = { ...mockSummary, status: 'suspended' as const }

      // Act
      render(<ContractSummary summary={suspendedSummary} />)

      // Assert
      expect(screen.getByText('一時停止中')).toBeInTheDocument()
    })

    test('ContractSummary_WithCancelledStatus_ShouldShowCancelledLabel', () => {
      // Arrange
      const cancelledSummary = { ...mockSummary, status: 'cancelled' as const }

      // Act
      render(<ContractSummary summary={cancelledSummary} />)

      // Assert
      expect(screen.getByText('解約済み')).toBeInTheDocument()
    })

    test('ContractSummary_WithPendingStatus_ShouldShowPendingLabel', () => {
      // Arrange
      const pendingSummary = { ...mockSummary, status: 'pending' as const }

      // Act
      render(<ContractSummary summary={pendingSummary} />)

      // Assert
      expect(screen.getByText('手続き中')).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('ContractSummary_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<ContractSummary summary={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('契約情報')).not.toBeInTheDocument()
      expect(screen.queryByText('ahamo')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('ContractSummary_WithNullSummary_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<ContractSummary summary={null} />)

      // Assert
      expect(screen.getByText('契約情報を取得できませんでした')).toBeInTheDocument()
    })
  })
})
