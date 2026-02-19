/**
 * @fileoverview AvailablePlanListコンポーネントのユニットテスト
 * @module components/mypage/PlanManagement/__tests__/AvailablePlanList.test
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AvailablePlanList } from '../AvailablePlanList'
import type { AvailablePlan } from '@/types'

describe('AvailablePlanList', () => {
  const mockPlans: AvailablePlan[] = [
    {
      id: 'P001',
      name: 'ahamo',
      type: 'ahamo',
      monthlyFee: 2970,
      dataCapacityGB: 20,
      description: 'シンプルなワンプラン',
      features: ['20GB', '5分かけ放題'],
    },
    {
      id: 'P002',
      name: 'ahamo大盛り',
      type: 'ahamo_large',
      monthlyFee: 4950,
      dataCapacityGB: 100,
      description: '大容量100GBプラン',
      features: ['100GB', '5分かけ放題'],
    },
  ]
  const mockOnChangePlan = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    mockOnChangePlan.mockClear()
  })

  test('AvailablePlanList_WithPlans_ShouldRenderAllPlans', () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    expect(screen.getByText('ahamo')).toBeInTheDocument()
    expect(screen.getByText('ahamo大盛り')).toBeInTheDocument()
  })

  test('AvailablePlanList_WithCurrentPlan_ShouldShowCurrentPlanBadge', () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    expect(screen.getByText('現在のプラン')).toBeInTheDocument()
  })

  test('AvailablePlanList_WithCurrentPlan_ShouldNotShowChangeButtonForCurrentPlan', () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    expect(screen.queryByTestId('change-plan-button-P001')).not.toBeInTheDocument()
    expect(screen.getByTestId('change-plan-button-P002')).toBeInTheDocument()
  })

  test('AvailablePlanList_WhenChangePlanClicked_ShouldCallOnChangePlan', async () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    fireEvent.click(screen.getByTestId('change-plan-button-P002'))

    await waitFor(() => {
      expect(mockOnChangePlan).toHaveBeenCalledWith('P002')
    })
  })

  test('AvailablePlanList_WhenChangeSucceeds_ShouldShowSuccessMessage', async () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    fireEvent.click(screen.getByTestId('change-plan-button-P002'))

    await waitFor(() => {
      expect(screen.getByTestId('plan-change-message')).toHaveTextContent(
        'プラン変更申請を受け付けました'
      )
    })
  })

  test('AvailablePlanList_WhenChangeFails_ShouldShowErrorMessage', async () => {
    mockOnChangePlan.mockRejectedValueOnce(new Error('変更失敗'))
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    fireEvent.click(screen.getByTestId('change-plan-button-P002'))

    await waitFor(() => {
      expect(screen.getByTestId('plan-change-message')).toHaveTextContent(
        'プラン変更に失敗しました'
      )
    })
  })

  test('AvailablePlanList_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    expect(screen.getByText('利用可能なプラン')).toBeInTheDocument()
  })

  test('AvailablePlanList_WithDefaultProps_ShouldHaveTestId', () => {
    render(
      <AvailablePlanList
        plans={mockPlans}
        currentPlanType="ahamo"
        onChangePlan={mockOnChangePlan}
      />
    )

    expect(screen.getByTestId('available-plan-list')).toBeInTheDocument()
  })
})
