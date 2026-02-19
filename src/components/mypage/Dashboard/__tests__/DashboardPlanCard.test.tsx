/**
 * @fileoverview DashboardPlanCardコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DashboardPlanCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardPlanCard } from '../DashboardPlanCard'

describe('DashboardPlanCard', () => {
  const defaultProps = {
    name: 'ahamo',
    monthlyFee: 2970,
    dataCapacityGB: 20,
  }

  test('DashboardPlanCard_WithDefaultProps_ShouldRenderPlanName', () => {
    render(<DashboardPlanCard {...defaultProps} />)

    expect(screen.getByText('ahamo')).toBeInTheDocument()
  })

  test('DashboardPlanCard_WithDefaultProps_ShouldRenderMonthlyFee', () => {
    render(<DashboardPlanCard {...defaultProps} />)

    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  test('DashboardPlanCard_WithDefaultProps_ShouldRenderDataCapacity', () => {
    render(<DashboardPlanCard {...defaultProps} />)

    expect(screen.getByText('データ容量: 20GB')).toBeInTheDocument()
  })

  test('DashboardPlanCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DashboardPlanCard {...defaultProps} />)

    expect(screen.getByText('ご契約プラン')).toBeInTheDocument()
  })

  test('DashboardPlanCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DashboardPlanCard {...defaultProps} />)

    expect(screen.getByTestId('plan-card')).toBeInTheDocument()
  })

  test('DashboardPlanCard_WithLargePlan_ShouldRenderCorrectly', () => {
    render(<DashboardPlanCard name="ahamo大盛り" monthlyFee={4950} dataCapacityGB={100} />)

    expect(screen.getByText('ahamo大盛り')).toBeInTheDocument()
    expect(screen.getByText('¥4,950')).toBeInTheDocument()
    expect(screen.getByText('データ容量: 100GB')).toBeInTheDocument()
  })
})
