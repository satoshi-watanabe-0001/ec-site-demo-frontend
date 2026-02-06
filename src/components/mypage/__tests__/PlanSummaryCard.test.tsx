/**
 * @fileoverview PlanSummaryCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/PlanSummaryCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { PlanSummaryCard } from '../PlanSummaryCard'
import type { ContractInfo } from '@/types'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

const mockContract: ContractInfo = {
  userId: 'user-001',
  phoneNumber: '090-1234-5678',
  contractDate: '2023-01-15',
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    freeCallIncluded: true,
  },
  options: [],
  contractorName: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  simType: 'eSIM',
}

const mockContractWithOptions: ContractInfo = {
  ...mockContract,
  options: [
    {
      optionId: 'opt-001',
      optionName: 'かけ放題オプション',
      monthlyFee: 1100,
      startDate: '2023-06-01',
      description: '国内通話かけ放題',
      category: 'call',
    },
    {
      optionId: 'opt-002',
      optionName: 'ケータイ補償サービス',
      monthlyFee: 825,
      startDate: '2023-01-15',
      description: '端末の故障・紛失を補償',
      category: 'insurance',
    },
  ],
}

describe('PlanSummaryCard', () => {
  test('PlanSummaryCard_WithBasicPlan_ShouldDisplayPlanInfo', () => {
    render(<PlanSummaryCard contract={mockContract} />)

    expect(screen.getByText('ご契約プラン')).toBeInTheDocument()
    expect(screen.getByText('ahamo')).toBeInTheDocument()
    expect(screen.getByText('¥2,970')).toBeInTheDocument()
    expect(screen.getByText('20GB')).toBeInTheDocument()
    expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
  })

  test('PlanSummaryCard_WithOptions_ShouldDisplayOptionInfo', () => {
    render(<PlanSummaryCard contract={mockContractWithOptions} />)

    expect(screen.getByText('オプション (2件)')).toBeInTheDocument()
    expect(screen.getByText('+¥1,925')).toBeInTheDocument()
    expect(screen.getByText('かけ放題オプション')).toBeInTheDocument()
    expect(screen.getByText('ケータイ補償サービス')).toBeInTheDocument()
  })

  test('PlanSummaryCard_WithNoOptions_ShouldNotDisplayOptionSection', () => {
    render(<PlanSummaryCard contract={mockContract} />)

    expect(screen.queryByText(/オプション/)).not.toBeInTheDocument()
  })

  test('PlanSummaryCard_WithClassName_ShouldApplyClassName', () => {
    const { container } = render(<PlanSummaryCard contract={mockContract} className="test-class" />)

    expect(container.firstChild).toHaveClass('test-class')
  })

  test('PlanSummaryCard_ShouldHaveDetailLink', () => {
    render(<PlanSummaryCard contract={mockContract} />)

    const detailLink = screen.getByText('詳細')
    expect(detailLink.closest('a')).toHaveAttribute('href', '/mypage/contract')
  })

  test('PlanSummaryCard_ShouldHavePlanChangeLink', () => {
    render(<PlanSummaryCard contract={mockContract} />)

    const planChangeLink = screen.getByText('プラン変更')
    expect(planChangeLink.closest('a')).toHaveAttribute('href', '/mypage/plan-change')
  })
})
