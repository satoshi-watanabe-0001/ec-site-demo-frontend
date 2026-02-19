/**
 * @fileoverview DataUsageChartコンポーネントのユニットテスト
 * @module components/mypage/DataUsage/__tests__/DataUsageChart.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataUsageChart } from '../DataUsageChart'
import type { DailyUsage } from '@/types'

describe('DataUsageChart', () => {
  const mockDailyUsage: DailyUsage[] = [
    { date: '2026-02-01', usageGB: 0.5 },
    { date: '2026-02-02', usageGB: 1.2 },
    { date: '2026-02-03', usageGB: 0.8 },
  ]

  test('DataUsageChart_WithDailyData_ShouldRenderSectionTitle', () => {
    render(<DataUsageChart dailyUsage={mockDailyUsage} />)

    expect(screen.getByText('日別データ使用量')).toBeInTheDocument()
  })

  test('DataUsageChart_WithDailyData_ShouldRenderBarsForEachDay', () => {
    render(<DataUsageChart dailyUsage={mockDailyUsage} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('DataUsageChart_WithDailyData_ShouldHaveTooltips', () => {
    render(<DataUsageChart dailyUsage={mockDailyUsage} />)

    expect(screen.getByTitle('2026-02-01: 0.5GB')).toBeInTheDocument()
    expect(screen.getByTitle('2026-02-02: 1.2GB')).toBeInTheDocument()
  })

  test('DataUsageChart_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DataUsageChart dailyUsage={mockDailyUsage} />)

    expect(screen.getByTestId('data-usage-chart')).toBeInTheDocument()
  })

  test('DataUsageChart_WithEmptyData_ShouldRenderEmptyChart', () => {
    render(<DataUsageChart dailyUsage={[]} />)

    expect(screen.getByTestId('data-usage-chart')).toBeInTheDocument()
  })
})
