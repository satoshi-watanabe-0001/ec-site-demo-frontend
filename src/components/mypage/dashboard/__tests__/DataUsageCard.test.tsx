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
import type { DataUsage } from '@/types'

const mockDataUsage: DataUsage = {
  contractId: 'contract-001',
  currentMonth: {
    used: 12800,
    total: 30720,
    lastUpdated: '2025-01-20T10:30:00Z',
  },
  dailyUsage: [],
}

describe('DataUsageCard', () => {
  describe('レンダリング', () => {
    test('DataUsageCard_WithDataUsage_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      expect(screen.getByText('データ使用状況')).toBeInTheDocument()
    })

    test('DataUsageCard_WithDataUsage_ShouldRenderUsedGB', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      expect(screen.getByText('12.5')).toBeInTheDocument()
    })

    test('DataUsageCard_WithDataUsage_ShouldRenderTotalGB', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      const totalElements = screen.getAllByText(/30/)
      expect(totalElements.length).toBeGreaterThanOrEqual(1)
    })

    test('DataUsageCard_WithDataUsage_ShouldRenderDetailLink', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      const link = screen.getByText('詳細を見る →')
      expect(link).toHaveAttribute('href', '/mypage/data-usage')
    })
  })

  describe('プログレスバー', () => {
    test('DataUsageCard_WithDataUsage_ShouldRenderProgressBar', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    test('DataUsageCard_WithDataUsage_ShouldHaveCorrectAriaValues', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '12800')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '30720')
    })

    test('DataUsageCard_WithDataUsage_ShouldShowUsagePercent', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      expect(screen.getByText('42% 使用済み')).toBeInTheDocument()
    })
  })

  describe('残りデータ量', () => {
    test('DataUsageCard_WithDataUsage_ShouldRenderRemainingGB', () => {
      // Arrange & Act
      render(<DataUsageCard dataUsage={mockDataUsage} />)

      // Assert
      expect(screen.getByText('17.5GB')).toBeInTheDocument()
    })
  })
})
