/**
 * @fileoverview OptionCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/OptionCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { OptionCard } from '../OptionCard'
import type { AvailableOption } from '@/types/account'

const mockEnrolledOption: AvailableOption = {
  optionId: 'opt-1',
  optionName: 'かけ放題オプション',
  monthlyPrice: 1100,
  description: '国内通話が24時間かけ放題',
  category: '通話',
  isEnrolled: true,
}

const mockNotEnrolledOption: AvailableOption = {
  optionId: 'opt-2',
  optionName: 'データ追加1GB',
  monthlyPrice: 550,
  description: '1GBのデータ容量を追加',
  category: 'データ',
  isEnrolled: false,
}

describe('OptionCard', () => {
  const mockOnEnroll = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockOnEnroll.mockClear()
    mockOnCancel.mockClear()
  })

  describe('レンダリング', () => {
    test('OptionCard_WithOption_ShouldRenderOptionName', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByText('かけ放題オプション')).toBeInTheDocument()
    })

    test('OptionCard_WithOption_ShouldRenderPrice', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByText(/1,100/)).toBeInTheDocument()
    })

    test('OptionCard_WithOption_ShouldRenderDescription', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByText('国内通話が24時間かけ放題')).toBeInTheDocument()
    })

    test('OptionCard_WithOption_ShouldRenderCategory', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByText('通話')).toBeInTheDocument()
    })
  })

  describe('登録済みオプション', () => {
    test('OptionCard_WhenEnrolled_ShouldShowEnrolledBadge', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByText('登録中')).toBeInTheDocument()
    })

    test('OptionCard_WhenEnrolled_ShouldShowCancelButton', () => {
      // Arrange & Act
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Assert
      expect(screen.getByRole('button', { name: '解除する' })).toBeInTheDocument()
    })

    test('OptionCard_WhenCancelClicked_ShouldCallOnCancel', () => {
      // Arrange
      render(
        <OptionCard option={mockEnrolledOption} onEnroll={mockOnEnroll} onCancel={mockOnCancel} />
      )

      // Act
      fireEvent.click(screen.getByRole('button', { name: '解除する' }))

      // Assert
      expect(mockOnCancel).toHaveBeenCalledWith('opt-1')
    })
  })

  describe('未登録オプション', () => {
    test('OptionCard_WhenNotEnrolled_ShouldNotShowEnrolledBadge', () => {
      // Arrange & Act
      render(
        <OptionCard
          option={mockNotEnrolledOption}
          onEnroll={mockOnEnroll}
          onCancel={mockOnCancel}
        />
      )

      // Assert
      expect(screen.queryByText('登録中')).not.toBeInTheDocument()
    })

    test('OptionCard_WhenNotEnrolled_ShouldShowEnrollButton', () => {
      // Arrange & Act
      render(
        <OptionCard
          option={mockNotEnrolledOption}
          onEnroll={mockOnEnroll}
          onCancel={mockOnCancel}
        />
      )

      // Assert
      expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument()
    })

    test('OptionCard_WhenEnrollClicked_ShouldCallOnEnroll', () => {
      // Arrange
      render(
        <OptionCard
          option={mockNotEnrolledOption}
          onEnroll={mockOnEnroll}
          onCancel={mockOnCancel}
        />
      )

      // Act
      fireEvent.click(screen.getByRole('button', { name: '登録する' }))

      // Assert
      expect(mockOnEnroll).toHaveBeenCalledWith('opt-2')
    })
  })

  describe('ローディング状態', () => {
    test('OptionCard_WhenLoading_ShouldShowProcessingText', () => {
      // Arrange & Act
      render(
        <OptionCard
          option={mockEnrolledOption}
          onEnroll={mockOnEnroll}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      )

      // Assert
      expect(screen.getByRole('button', { name: '処理中...' })).toBeInTheDocument()
    })

    test('OptionCard_WhenLoading_ShouldDisableButton', () => {
      // Arrange & Act
      render(
        <OptionCard
          option={mockEnrolledOption}
          onEnroll={mockOnEnroll}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      )

      // Assert
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
