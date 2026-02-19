/**
 * @fileoverview CurrentPlanCardコンポーネントのユニットテスト
 * @module components/mypage/PlanManagement/__tests__/CurrentPlanCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { CurrentPlanCard } from '../CurrentPlanCard'
import type { ContractPlan } from '@/types'

describe('CurrentPlanCard', () => {
  const mockPlan: ContractPlan = {
    id: 'P001',
    name: 'ahamo',
    type: 'ahamo',
    monthlyFee: 2970,
    dataCapacityGB: 20,
    description: 'シンプルなワンプラン。20GBのデータ容量と5分以内の国内通話無料。',
  }

  test('CurrentPlanCard_WithPlan_ShouldRenderPlanName', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByText('ahamo')).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithPlan_ShouldRenderMonthlyFee', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithPlan_ShouldRenderDataCapacity', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByText('20GB')).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithPlan_ShouldRenderDescription', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByText(/シンプルなワンプラン/)).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByText('現在のプラン')).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<CurrentPlanCard plan={mockPlan} />)

    expect(screen.getByTestId('current-plan-card')).toBeInTheDocument()
  })

  test('CurrentPlanCard_WithLargePlan_ShouldRenderCorrectly', () => {
    const largePlan: ContractPlan = {
      id: 'P002',
      name: 'ahamo大盛り',
      type: 'ahamo_large',
      monthlyFee: 4950,
      dataCapacityGB: 100,
      description: '大容量100GBプラン。',
    }
    render(<CurrentPlanCard plan={largePlan} />)

    expect(screen.getByText('ahamo大盛り')).toBeInTheDocument()
    expect(screen.getByText('¥4,950')).toBeInTheDocument()
    expect(screen.getByText('100GB')).toBeInTheDocument()
  })
})
