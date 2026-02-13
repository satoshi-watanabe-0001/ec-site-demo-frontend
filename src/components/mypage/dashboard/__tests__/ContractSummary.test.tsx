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
import type { ContractInfo } from '@/types'

const mockContract: ContractInfo = {
  id: 'contract-001',
  planName: 'ahamo',
  monthlyFee: 2970,
  dataCapacity: '30GB',
  contractDate: '2024-01-15',
  phoneNumber: '090-1234-5678',
  options: [
    {
      id: 'opt-001',
      name: 'かけ放題オプション',
      monthlyFee: 1100,
      description: '国内通話かけ放題',
    },
  ],
}

describe('ContractSummary', () => {
  describe('レンダリング', () => {
    test('ContractSummary_WithContract_ShouldRenderPlanName', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('ahamo')).toBeInTheDocument()
    })

    test('ContractSummary_WithContract_ShouldRenderMonthlyFee', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('¥2,970')).toBeInTheDocument()
    })

    test('ContractSummary_WithContract_ShouldRenderDataCapacity', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('30GB')).toBeInTheDocument()
    })

    test('ContractSummary_WithContract_ShouldRenderPhoneNumber', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
    })

    test('ContractSummary_WithContract_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('契約情報')).toBeInTheDocument()
    })

    test('ContractSummary_WithContract_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      const link = screen.getByText('詳細を見る →')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/mypage/contract')
    })
  })

  describe('オプション表示', () => {
    test('ContractSummary_WithOptions_ShouldRenderOptionName', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('かけ放題オプション')).toBeInTheDocument()
    })

    test('ContractSummary_WithOptions_ShouldRenderOptionFee', () => {
      // Arrange & Act
      render(<ContractSummary contract={mockContract} />)

      // Assert
      expect(screen.getByText('¥1,100/月')).toBeInTheDocument()
    })

    test('ContractSummary_WithNoOptions_ShouldNotRenderOptionsSection', () => {
      // Arrange
      const contractNoOptions: ContractInfo = { ...mockContract, options: [] }

      // Act
      render(<ContractSummary contract={contractNoOptions} />)

      // Assert
      expect(screen.queryByText('契約中オプション')).not.toBeInTheDocument()
    })
  })
})
