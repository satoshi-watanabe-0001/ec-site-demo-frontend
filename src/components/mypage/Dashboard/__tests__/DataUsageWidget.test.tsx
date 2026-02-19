/**
 * @fileoverview DataUsageWidgetコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DataUsageWidget.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DataUsageWidget } from '../DataUsageWidget'
import type { DataUsageSummary } from '@/types'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockDataUsage: DataUsageSummary = {
  usedGB: 12.5,
  totalGB: 20,
  usagePercentage: 62.5,
  remainingGB: 7.5,
  lastUpdated: '2026-02-19T10:30:00Z',
}

describe('DataUsageWidget', () => {
  test('DataUsageWidget_WithValidData_ShouldRenderSectionTitle', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    expect(screen.getByText('データ使用量')).toBeInTheDocument()
  })

  test('DataUsageWidget_WithValidData_ShouldRenderUsedGB', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    expect(screen.getByText('12.5')).toBeInTheDocument()
  })

  test('DataUsageWidget_WithValidData_ShouldRenderTotalGB', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    expect(screen.getByText('/ 20GB')).toBeInTheDocument()
  })

  test('DataUsageWidget_WithValidData_ShouldRenderRemainingGB', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    expect(screen.getByText('7.5GB')).toBeInTheDocument()
  })

  test('DataUsageWidget_WithValidData_ShouldRenderProgressBar', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '62.5')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  test('DataUsageWidget_WithValidData_ShouldRenderDetailLink', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    const link = screen.getByText('詳細を見る →')
    expect(link.closest('a')).toHaveAttribute('href', '/mypage/data-usage')
  })

  test('DataUsageWidget_WithHighUsage_ShouldShowRedProgressBar', () => {
    const highUsage: DataUsageSummary = {
      ...mockDataUsage,
      usagePercentage: 95,
      usedGB: 19,
      remainingGB: 1,
    }
    render(<DataUsageWidget dataUsage={highUsage} />)

    const progressBar = screen.getByRole('progressbar')
    const bar = progressBar.firstChild as HTMLElement
    expect(bar.className).toContain('bg-red-500')
  })

  test('DataUsageWidget_WithMediumUsage_ShouldShowYellowProgressBar', () => {
    const mediumUsage: DataUsageSummary = {
      ...mockDataUsage,
      usagePercentage: 75,
      usedGB: 15,
      remainingGB: 5,
    }
    render(<DataUsageWidget dataUsage={mediumUsage} />)

    const progressBar = screen.getByRole('progressbar')
    const bar = progressBar.firstChild as HTMLElement
    expect(bar.className).toContain('bg-yellow-500')
  })

  test('DataUsageWidget_WithLowUsage_ShouldShowCyanProgressBar', () => {
    render(<DataUsageWidget dataUsage={mockDataUsage} />)

    const progressBar = screen.getByRole('progressbar')
    const bar = progressBar.firstChild as HTMLElement
    expect(bar.className).toContain('bg-cyan-500')
  })
})
