/**
 * @fileoverview DataUsageSummaryコンポーネントのユニットテスト
 * @module components/mypage/DataUsage/__tests__/DataUsageSummary.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataUsageSummary } from '../DataUsageSummary'
import type { DataUsageInfo } from '@/types'

describe('DataUsageSummary', () => {
  const mockDataUsage: DataUsageInfo = {
    totalCapacityGB: 20,
    usedGB: 12.5,
    remainingGB: 7.5,
    usagePercent: 62.5,
    lastUpdated: '2026-02-19T10:00:00Z',
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
    dailyUsage: [],
  }

  test('DataUsageSummary_WithDefaultProps_ShouldRenderUsedGB', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByText('12.5GB')).toBeInTheDocument()
  })

  test('DataUsageSummary_WithDefaultProps_ShouldRenderTotalCapacity', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByText('/ 20GB')).toBeInTheDocument()
  })

  test('DataUsageSummary_WithDefaultProps_ShouldRenderRemainingData', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByText('7.5GB')).toBeInTheDocument()
  })

  test('DataUsageSummary_WithDefaultProps_ShouldRenderUsagePercent', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByText('62.5%')).toBeInTheDocument()
  })

  test('DataUsageSummary_WithDefaultProps_ShouldRenderProgressBar', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
  })

  test('DataUsageSummary_WithHighUsage_ShouldShowRedProgressBar', () => {
    const highUsage = { ...mockDataUsage, usagePercent: 95 }
    render(<DataUsageSummary dataUsage={highUsage} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar.className).toContain('bg-red-500')
  })

  test('DataUsageSummary_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByText('データ使用量サマリー')).toBeInTheDocument()
  })

  test('DataUsageSummary_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DataUsageSummary dataUsage={mockDataUsage} />)

    expect(screen.getByTestId('data-usage-summary')).toBeInTheDocument()
  })
})
