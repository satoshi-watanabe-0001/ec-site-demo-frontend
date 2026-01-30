/**
 * @fileoverview DataUsageCardコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/DataUsageCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataUsageCard } from '../DataUsageCard'
import type { CurrentDataUsage } from '@/types'

describe('DataUsageCard', () => {
  const mockUsage: CurrentDataUsage = {
    dataCapacity: 20,
    usedData: 12.5,
    remainingData: 7.5,
    usagePercentage: 62.5,
    periodStartDate: '2025-01-01',
    periodEndDate: '2025-01-31',
    resetDate: '2025-02-01',
    additionalData: 0,
    carryOverData: 0,
  }

  describe('レンダリング', () => {
    test('DataUsageCard_WithValidUsage_ShouldRenderUsageInfo', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.getByText('データ使用量')).toBeInTheDocument()
      expect(screen.getByText('12.5')).toBeInTheDocument()
    })

    test('DataUsageCard_WithValidUsage_ShouldRenderDataCapacity', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.getByText('/ 20GB')).toBeInTheDocument()
    })

    test('DataUsageCard_WithValidUsage_ShouldRenderRemainingData', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.getByText('7.5GB')).toBeInTheDocument()
    })

    test('DataUsageCard_WithValidUsage_ShouldRenderResetDate', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.getByText('2025-02-01')).toBeInTheDocument()
    })

    test('DataUsageCard_WithValidUsage_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.getByText('詳細を見る →')).toBeInTheDocument()
    })
  })

  describe('追加データ表示', () => {
    test('DataUsageCard_WithAdditionalData_ShouldShowAdditionalData', () => {
      // Arrange
      const usageWithAdditional = { ...mockUsage, additionalData: 5 }

      // Act
      render(<DataUsageCard usage={usageWithAdditional} />)

      // Assert
      expect(screen.getByText('+5GB')).toBeInTheDocument()
    })

    test('DataUsageCard_WithoutAdditionalData_ShouldNotShowAdditionalData', () => {
      // Arrange & Act
      render(<DataUsageCard usage={mockUsage} />)

      // Assert
      expect(screen.queryByText('追加データ')).not.toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('DataUsageCard_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<DataUsageCard usage={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('データ使用量')).not.toBeInTheDocument()
      expect(screen.queryByText('12.5')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('DataUsageCard_WithNullUsage_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<DataUsageCard usage={null} />)

      // Assert
      expect(screen.getByText('データ使用量を取得できませんでした')).toBeInTheDocument()
    })
  })
})
