/**
 * @fileoverview DataUsageCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/DataUsageCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { DataUsageCard } from '../DataUsageCard'
import type { DataUsage } from '@/types'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockDataUsage: DataUsage = {
  currentUsage: 8.5,
  remaining: 11.5,
  totalCapacity: 20,
  lastUpdated: '2024-01-15T10:00:00Z',
  dailyUsage: [],
  monthlyHistory: [],
}

describe('DataUsageCard', () => {
  test('DataUsageCard_WithNormalUsage_ShouldDisplayUsageInfo', () => {
    render(<DataUsageCard dataUsage={mockDataUsage} />)

    expect(screen.getByText('データ使用量')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
    expect(screen.getByText('/ 20GB 中')).toBeInTheDocument()
    expect(screen.getByText('残り 11.5GB')).toBeInTheDocument()
    expect(screen.getByText('使用済み: 43%')).toBeInTheDocument()
  })

  test('DataUsageCard_WithHighUsage_ShouldShowYellowBar', () => {
    const highUsage: DataUsage = {
      ...mockDataUsage,
      currentUsage: 15,
      remaining: 5,
    }
    const { container } = render(<DataUsageCard dataUsage={highUsage} />)

    const progressBar = container.querySelector('.bg-yellow-500')
    expect(progressBar).toBeInTheDocument()
  })

  test('DataUsageCard_WithCriticalUsage_ShouldShowRedBar', () => {
    const criticalUsage: DataUsage = {
      ...mockDataUsage,
      currentUsage: 19,
      remaining: 1,
    }
    const { container } = render(<DataUsageCard dataUsage={criticalUsage} />)

    const progressBar = container.querySelector('.bg-red-500')
    expect(progressBar).toBeInTheDocument()
  })

  test('DataUsageCard_ShouldHaveDetailLink', () => {
    render(<DataUsageCard dataUsage={mockDataUsage} />)

    const detailLink = screen.getByText('詳細')
    expect(detailLink.closest('a')).toHaveAttribute('href', '/mypage/data-usage')
  })

  test('DataUsageCard_WithClassName_ShouldApplyClassName', () => {
    const { container } = render(<DataUsageCard dataUsage={mockDataUsage} className="custom" />)

    expect(container.firstChild).toHaveClass('custom')
  })
})
