/**
 * @fileoverview DashboardDataUsageCardコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DashboardDataUsageCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardDataUsageCard } from '../DashboardDataUsageCard'

describe('DashboardDataUsageCard', () => {
  const defaultProps = {
    usedGB: 12.5,
    totalCapacityGB: 20,
    remainingGB: 7.5,
    usagePercent: 62.5,
    lastUpdated: '2026-02-19T10:00:00Z',
  }

  test('DashboardDataUsageCard_WithDefaultProps_ShouldRenderUsedData', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    expect(screen.getByText('12.5')).toBeInTheDocument()
  })

  test('DashboardDataUsageCard_WithDefaultProps_ShouldRenderTotalCapacity', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    expect(screen.getByText('/ 20GB')).toBeInTheDocument()
  })

  test('DashboardDataUsageCard_WithDefaultProps_ShouldRenderRemainingData', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    expect(screen.getByText('残り 7.5GB')).toBeInTheDocument()
  })

  test('DashboardDataUsageCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    expect(screen.getByText('今月のデータ使用量')).toBeInTheDocument()
  })

  test('DashboardDataUsageCard_WithDefaultProps_ShouldRenderProgressBar', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
  })

  test('DashboardDataUsageCard_WithHighUsage_ShouldShowRedProgressBar', () => {
    render(<DashboardDataUsageCard {...defaultProps} usagePercent={95} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-red-500')
  })

  test('DashboardDataUsageCard_WithMediumUsage_ShouldShowYellowProgressBar', () => {
    render(<DashboardDataUsageCard {...defaultProps} usagePercent={75} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-yellow-500')
  })

  test('DashboardDataUsageCard_WithLowUsage_ShouldShowTealProgressBar', () => {
    render(<DashboardDataUsageCard {...defaultProps} usagePercent={50} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-teal-500')
  })

  test('DashboardDataUsageCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DashboardDataUsageCard {...defaultProps} />)

    expect(screen.getByTestId('data-usage-card')).toBeInTheDocument()
  })
})
