/**
 * @fileoverview PlanSummaryコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/PlanSummary.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { PlanSummary } from '../PlanSummary'
import type { ContractPlan } from '@/types'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockPlan: ContractPlan = {
  planId: 'ahamo',
  planName: 'ahamo',
  monthlyFee: 2970,
  dataCapacityGB: 20,
  description: '20GBまで使えるベーシックプラン',
}

describe('PlanSummary', () => {
  test('PlanSummary_WithValidPlan_ShouldRenderPlanName', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('ahamo')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderSectionTitle', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('ご契約プラン')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderMonthlyFee', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderDataCapacity', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('20GB')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderDescription', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('20GBまで使えるベーシックプラン')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderContractStatusBadge', () => {
    render(<PlanSummary plan={mockPlan} />)

    expect(screen.getByText('契約中')).toBeInTheDocument()
  })

  test('PlanSummary_WithValidPlan_ShouldRenderDetailLink', () => {
    render(<PlanSummary plan={mockPlan} />)

    const link = screen.getByText('詳細を見る →')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/mypage/contract')
  })

  test('PlanSummary_WithLargePlan_ShouldRenderLargePlanFee', () => {
    const largePlan: ContractPlan = {
      planId: 'ahamo-large',
      planName: 'ahamo大盛り',
      monthlyFee: 4950,
      dataCapacityGB: 100,
      description: '100GBまで使える大容量プラン',
    }
    render(<PlanSummary plan={largePlan} />)

    expect(screen.getByText('ahamo大盛り')).toBeInTheDocument()
    expect(screen.getByText('¥4,950')).toBeInTheDocument()
    expect(screen.getByText('100GB')).toBeInTheDocument()
  })
})
