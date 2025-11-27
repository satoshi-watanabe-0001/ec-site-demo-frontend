/**
 * @fileoverview Buttonコンポーネントのユニットテスト
 * @module components/ui/__tests__/button.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  describe('レンダリング', () => {
    test('Button_WithChildren_ShouldRenderChildren', () => {
      // Arrange
      const buttonText = 'クリック'

      // Act
      render(<Button>{buttonText}</Button>)

      // Assert
      expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument()
    })

    test('Button_WithDefaultVariant_ShouldApplyDefaultStyles', () => {
      // Arrange & Act
      render(<Button>デフォルト</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    test('Button_WithDestructiveVariant_ShouldApplyDestructiveStyles', () => {
      // Arrange & Act
      render(<Button variant="destructive">削除</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-500')
    })

    test('Button_WithOutlineVariant_ShouldApplyOutlineStyles', () => {
      // Arrange & Act
      render(<Button variant="outline">アウトライン</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })

    test('Button_WithSecondaryVariant_ShouldApplySecondaryStyles', () => {
      // Arrange & Act
      render(<Button variant="secondary">セカンダリ</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-slate-700')
    })

    test('Button_WithGhostVariant_ShouldApplyGhostStyles', () => {
      // Arrange & Act
      render(<Button variant="ghost">ゴースト</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-slate-700')
    })

    test('Button_WithLinkVariant_ShouldApplyLinkStyles', () => {
      // Arrange & Act
      render(<Button variant="link">リンク</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  describe('サイズ', () => {
    test('Button_WithDefaultSize_ShouldApplyDefaultSizeStyles', () => {
      // Arrange & Act
      render(<Button size="default">デフォルトサイズ</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    test('Button_WithSmSize_ShouldApplySmSizeStyles', () => {
      // Arrange & Act
      render(<Button size="sm">小さいボタン</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    test('Button_WithLgSize_ShouldApplyLgSizeStyles', () => {
      // Arrange & Act
      render(<Button size="lg">大きいボタン</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
    })

    test('Button_WithIconSize_ShouldApplyIconSizeStyles', () => {
      // Arrange & Act
      render(<Button size="icon">アイコン</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('インタラクション', () => {
    test('Button_WhenClicked_ShouldCallOnClick', () => {
      // Arrange
      const handleClick = jest.fn()

      // Act
      render(<Button onClick={handleClick}>クリック</Button>)
      fireEvent.click(screen.getByRole('button'))

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('Button_WhenDisabled_ShouldNotCallOnClick', () => {
      // Arrange
      const handleClick = jest.fn()

      // Act
      render(
        <Button onClick={handleClick} disabled>
          無効
        </Button>
      )
      fireEvent.click(screen.getByRole('button'))

      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })

    test('Button_WhenDisabled_ShouldApplyDisabledStyles', () => {
      // Arrange & Act
      render(<Button disabled>無効</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })
  })

  describe('アクセシビリティ', () => {
    test('Button_WithType_ShouldHaveCorrectType', () => {
      // Arrange & Act
      render(<Button type="submit">送信</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    test('Button_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<Button className="custom-class">カスタム</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })
  })
})
