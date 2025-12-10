/**
 * @fileoverview Inputコンポーネントのユニットテスト
 * @module components/ui/__tests__/input.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  describe('レンダリング', () => {
    test('Input_WithDefaultProps_ShouldRenderInput', () => {
      // Arrange & Act
      render(<Input />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('Input_WithPlaceholder_ShouldDisplayPlaceholder', () => {
      // Arrange
      const placeholder = '例: example@docomo.ne.jp'

      // Act
      render(<Input placeholder={placeholder} />)

      // Assert
      const input = screen.getByPlaceholderText(placeholder)
      expect(input).toBeInTheDocument()
    })

    test('Input_WithType_ShouldHaveCorrectType', () => {
      // Arrange & Act
      render(<Input type="email" />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    test('Input_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<Input className="custom-class" />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
    })
  })

  describe('エラー状態', () => {
    test('Input_WithErrorTrue_ShouldApplyErrorStyles', () => {
      // Arrange & Act
      render(<Input error={true} />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-500')
    })

    test('Input_WithErrorFalse_ShouldApplyNormalStyles', () => {
      // Arrange & Act
      render(<Input error={false} />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-slate-600')
    })

    test('Input_WithErrorAndMessage_ShouldDisplayErrorMessage', () => {
      // Arrange
      const errorMessage = 'メールアドレスを入力してください'

      // Act
      render(<Input id="email" error={true} errorMessage={errorMessage} />)

      // Assert
      const errorElement = screen.getByRole('alert')
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent(errorMessage)
    })

    test('Input_WithErrorButNoMessage_ShouldNotDisplayErrorMessage', () => {
      // Arrange & Act
      render(<Input error={true} />)

      // Assert
      const errorElement = screen.queryByRole('alert')
      expect(errorElement).not.toBeInTheDocument()
    })

    test('Input_WithoutError_ShouldNotDisplayErrorMessage', () => {
      // Arrange & Act
      render(<Input error={false} errorMessage="エラーメッセージ" />)

      // Assert
      const errorElement = screen.queryByRole('alert')
      expect(errorElement).not.toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('Input_WithError_ShouldHaveAriaInvalidTrue', () => {
      // Arrange & Act
      render(<Input error={true} />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    test('Input_WithoutError_ShouldHaveAriaInvalidFalse', () => {
      // Arrange & Act
      render(<Input error={false} />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    test('Input_WithErrorAndMessage_ShouldHaveAriaDescribedBy', () => {
      // Arrange & Act
      render(<Input id="email" error={true} errorMessage="エラー" />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'email-error')
    })

    test('Input_WithoutErrorMessage_ShouldNotHaveAriaDescribedBy', () => {
      // Arrange & Act
      render(<Input id="email" error={false} />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).not.toHaveAttribute('aria-describedby')
    })
  })

  describe('状態', () => {
    test('Input_WhenDisabled_ShouldBeDisabled', () => {
      // Arrange & Act
      render(<Input disabled />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    test('Input_WhenDisabled_ShouldApplyDisabledStyles', () => {
      // Arrange & Act
      render(<Input disabled />)

      // Assert
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('disabled:opacity-50')
    })
  })
})
