/**
 * @fileoverview DataUsageProgressBarコンポーネントのユニットテスト
 * @module components/mypage/__tests__/DataUsageProgressBar.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataUsageProgressBar } from '../DataUsageProgressBar'

describe('DataUsageProgressBar', () => {
  describe('レンダリング', () => {
    test('DataUsageProgressBar_WithUsageData_ShouldRenderUsedData', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={12.5} totalData={20} />)

      // Assert
      expect(screen.getByText('12.5')).toBeInTheDocument()
      expect(screen.getByText('GB 使用済み')).toBeInTheDocument()
    })

    test('DataUsageProgressBar_WithUsageData_ShouldRenderRemainingData', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={12.5} totalData={20} />)

      // Assert
      expect(screen.getByText('7.5')).toBeInTheDocument()
    })

    test('DataUsageProgressBar_WithUsageData_ShouldRenderProgressBar', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={12.5} totalData={20} />)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    test('DataUsageProgressBar_WithTotalDataLabels_ShouldRenderMinMax', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={5} totalData={20} />)

      // Assert
      expect(screen.getByText('0 GB')).toBeInTheDocument()
      expect(screen.getByText('20 GB')).toBeInTheDocument()
    })
  })

  describe('プログレスバーの色', () => {
    test('DataUsageProgressBar_WithLowUsage_ShouldUsePrimaryColor', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={5} totalData={20} />)

      // Assert - 25%使用率 → primary色
      const progressBar = screen.getByRole('progressbar')
      const bar = progressBar.firstChild as HTMLElement
      expect(bar).toHaveClass('bg-primary')
    })

    test('DataUsageProgressBar_WithHighUsage_ShouldUseYellowColor', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={15} totalData={20} />)

      // Assert - 75%使用率 → yellow色
      const progressBar = screen.getByRole('progressbar')
      const bar = progressBar.firstChild as HTMLElement
      expect(bar).toHaveClass('bg-yellow-500')
    })

    test('DataUsageProgressBar_WithCriticalUsage_ShouldUseRedColor', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={19} totalData={20} />)

      // Assert - 95%使用率 → red色
      const progressBar = screen.getByRole('progressbar')
      const bar = progressBar.firstChild as HTMLElement
      expect(bar).toHaveClass('bg-red-500')
    })
  })

  describe('エッジケース', () => {
    test('DataUsageProgressBar_WithZeroTotal_ShouldRenderZeroPercentage', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={0} totalData={0} />)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    test('DataUsageProgressBar_WithExceedingUsage_ShouldCapAt100Percent', () => {
      // Arrange & Act
      render(<DataUsageProgressBar usedData={25} totalData={20} />)

      // Assert
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })

    test('DataUsageProgressBar_WithClassName_ShouldApplyClassName', () => {
      // Arrange & Act
      const { container } = render(
        <DataUsageProgressBar usedData={10} totalData={20} className="custom-class" />
      )

      // Assert
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})
