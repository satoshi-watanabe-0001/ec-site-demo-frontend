/**
 * @fileoverview PlanCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/PlanCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlanCard } from '../PlanCard'
import type { AvailablePlan } from '@/types/account'

const mockCurrentPlan: AvailablePlan = {
  planId: 'ahamo-20',
  planName: 'ahamo',
  monthlyPrice: 2970,
  dataCapacity: 20,
  description: '20GBの大容量プラン',
  features: ['5分間通話無料', '海外82カ国で利用可能', 'テザリング無料'],
  isCurrent: true,
}

const mockOtherPlan: AvailablePlan = {
  planId: 'ahamo-100',
  planName: 'ahamo大盛り',
  monthlyPrice: 4950,
  dataCapacity: 100,
  description: '100GBの超大容量プラン',
  features: ['5分間通話無料', '海外82カ国で利用可能', 'テザリング無料', '100GBデータ容量'],
  isCurrent: false,
}

describe('PlanCard', () => {
  const mockOnChangePlan = jest.fn()

  beforeEach(() => {
    mockOnChangePlan.mockClear()
  })

  describe('レンダリング', () => {
    test('PlanCard_WithPlan_ShouldRenderPlanName', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText('ahamo')).toBeInTheDocument()
    })

    test('PlanCard_WithPlan_ShouldRenderPrice', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText(/2,970/)).toBeInTheDocument()
    })

    test('PlanCard_WithPlan_ShouldRenderDescription', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText('20GBの大容量プラン')).toBeInTheDocument()
    })

    test('PlanCard_WithPlan_ShouldRenderDataCapacity', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText('20GB')).toBeInTheDocument()
    })

    test('PlanCard_WithPlan_ShouldRenderFeatures', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText('5分間通話無料')).toBeInTheDocument()
      expect(screen.getByText('海外82カ国で利用可能')).toBeInTheDocument()
      expect(screen.getByText('テザリング無料')).toBeInTheDocument()
    })
  })

  describe('現在のプラン', () => {
    test('PlanCard_WhenCurrentPlan_ShouldShowCurrentBadge', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByText('現在のプラン')).toBeInTheDocument()
    })

    test('PlanCard_WhenCurrentPlan_ShouldShowDisabledButton', () => {
      // Arrange & Act
      render(<PlanCard plan={mockCurrentPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      const button = screen.getByRole('button', { name: '現在ご利用中' })
      expect(button).toBeDisabled()
    })
  })

  describe('変更可能なプラン', () => {
    test('PlanCard_WhenNotCurrentPlan_ShouldNotShowCurrentBadge', () => {
      // Arrange & Act
      render(<PlanCard plan={mockOtherPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.queryByText('現在のプラン')).not.toBeInTheDocument()
    })

    test('PlanCard_WhenNotCurrentPlan_ShouldShowChangeButton', () => {
      // Arrange & Act
      render(<PlanCard plan={mockOtherPlan} onChangePlan={mockOnChangePlan} />)

      // Assert
      expect(screen.getByRole('button', { name: 'このプランに変更' })).toBeInTheDocument()
    })

    test('PlanCard_WhenChangeClicked_ShouldCallOnChangePlan', () => {
      // Arrange
      render(<PlanCard plan={mockOtherPlan} onChangePlan={mockOnChangePlan} />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'このプランに変更' }))

      // Assert
      expect(mockOnChangePlan).toHaveBeenCalledWith('ahamo-100')
    })
  })

  describe('ローディング状態', () => {
    test('PlanCard_WhenLoading_ShouldShowLoadingText', () => {
      // Arrange & Act
      render(<PlanCard plan={mockOtherPlan} onChangePlan={mockOnChangePlan} isLoading={true} />)

      // Assert
      expect(screen.getByRole('button', { name: '変更中...' })).toBeInTheDocument()
    })

    test('PlanCard_WhenLoading_ShouldDisableButton', () => {
      // Arrange & Act
      render(<PlanCard plan={mockOtherPlan} onChangePlan={mockOnChangePlan} isLoading={true} />)

      // Assert
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
