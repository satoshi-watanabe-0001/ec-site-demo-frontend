/**
 * @fileoverview GradientButtonコンポーネントのユニットテスト
 * @module components/ui/__tests__/gradient-button.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { GradientButton } from '../gradient-button'

describe('GradientButton', () => {
  describe('レンダリング', () => {
    test('GradientButton_WithChildren_ShouldRenderChildren', () => {
      // Arrange
      const buttonText = '申し込む'

      // Act
      render(<GradientButton>{buttonText}</GradientButton>)

      // Assert
      expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument()
    })

    test('GradientButton_WithDefaultProps_ShouldApplyGradientStyles', () => {
      // Arrange & Act
      render(<GradientButton>グラデーション</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gradient-to-r', 'from-orange-500', 'to-red-500')
    })
  })

  describe('サイズ', () => {
    test('GradientButton_WithSmSize_ShouldApplySmSizeStyles', () => {
      // Arrange & Act
      render(<GradientButton size="sm">小さい</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
    })

    test('GradientButton_WithMdSize_ShouldApplyMdSizeStyles', () => {
      // Arrange & Act
      render(<GradientButton size="md">中サイズ</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-base')
    })

    test('GradientButton_WithLgSize_ShouldApplyLgSizeStyles', () => {
      // Arrange & Act
      render(<GradientButton size="lg">大きい</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-12', 'py-4', 'text-lg')
    })
  })

  describe('インタラクション', () => {
    test('GradientButton_WhenClicked_ShouldCallOnClick', () => {
      // Arrange
      const handleClick = jest.fn()

      // Act
      render(<GradientButton onClick={handleClick}>クリック</GradientButton>)
      fireEvent.click(screen.getByRole('button'))

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('GradientButton_WhenDisabled_ShouldNotCallOnClick', () => {
      // Arrange
      const handleClick = jest.fn()

      // Act
      render(
        <GradientButton onClick={handleClick} disabled>
          無効
        </GradientButton>
      )
      fireEvent.click(screen.getByRole('button'))

      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('アクセシビリティ', () => {
    test('GradientButton_WithType_ShouldHaveCorrectType', () => {
      // Arrange & Act
      render(<GradientButton type="submit">送信</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    test('GradientButton_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<GradientButton className="custom-class">カスタム</GradientButton>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })
})
