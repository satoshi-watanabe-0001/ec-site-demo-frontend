/**
 * @fileoverview PasswordChangeFormコンポーネントのユニットテスト
 * @module components/mypage/settings/__tests__/PasswordChangeForm.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PasswordChangeForm } from '../PasswordChangeForm'

describe('PasswordChangeForm', () => {
  describe('レンダリング', () => {
    test('PasswordChangeForm_WithDefaultProps_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<PasswordChangeForm />)

      // Assert
      expect(screen.getByText('パスワード変更')).toBeInTheDocument()
    })

    test('PasswordChangeForm_WithDefaultProps_ShouldRenderChangeButton', () => {
      // Arrange & Act
      render(<PasswordChangeForm />)

      // Assert
      expect(screen.getByRole('button', { name: '変更する' })).toBeInTheDocument()
    })

    test('PasswordChangeForm_WithDefaultProps_ShouldRenderSecurityMessage', () => {
      // Arrange & Act
      render(<PasswordChangeForm />)

      // Assert
      expect(
        screen.getByText('セキュリティのため、定期的なパスワード変更をお勧めします')
      ).toBeInTheDocument()
    })
  })

  describe('展開モード', () => {
    test('PasswordChangeForm_WhenChangeButtonClicked_ShouldShowForm', () => {
      // Arrange
      render(<PasswordChangeForm />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Assert
      expect(screen.getByLabelText('現在のパスワード')).toBeInTheDocument()
      expect(screen.getByLabelText('新しいパスワード')).toBeInTheDocument()
      expect(screen.getByLabelText('新しいパスワード（確認）')).toBeInTheDocument()
    })

    test('PasswordChangeForm_WhenChangeButtonClicked_ShouldShowSubmitAndCancelButtons', () => {
      // Arrange
      render(<PasswordChangeForm />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Assert
      expect(screen.getByRole('button', { name: 'パスワードを変更' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
    })

    test('PasswordChangeForm_WhenCancelClicked_ShouldCollapseForm', () => {
      // Arrange
      render(<PasswordChangeForm />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

      // Assert
      expect(screen.getByRole('button', { name: '変更する' })).toBeInTheDocument()
      expect(screen.queryByLabelText('現在のパスワード')).not.toBeInTheDocument()
    })
  })

  describe('バリデーション', () => {
    test('PasswordChangeForm_WhenCurrentPasswordEmpty_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn()
      render(<PasswordChangeForm onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを変更' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('現在のパスワードを入力してください')
      })
      expect(handleSubmit).not.toHaveBeenCalled()
    })

    test('PasswordChangeForm_WhenNewPasswordTooShort_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn()
      render(<PasswordChangeForm onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.change(screen.getByLabelText('現在のパスワード'), {
        target: { value: 'oldpass123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード'), {
        target: { value: 'short' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを変更' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          '新しいパスワードは8文字以上で入力してください'
        )
      })
    })

    test('PasswordChangeForm_WhenPasswordsDoNotMatch_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn()
      render(<PasswordChangeForm onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.change(screen.getByLabelText('現在のパスワード'), {
        target: { value: 'oldpass123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
        target: { value: 'differentpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを変更' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          '新しいパスワードと確認用パスワードが一致しません'
        )
      })
    })
  })

  describe('フォーム送信', () => {
    test('PasswordChangeForm_WhenFormSubmittedSuccessfully_ShouldCallOnSubmit', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined)
      render(<PasswordChangeForm onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.change(screen.getByLabelText('現在のパスワード'), {
        target: { value: 'oldpass123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを変更' }))

      // Assert
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          currentPassword: 'oldpass123',
          newPassword: 'newpassword123',
          confirmPassword: 'newpassword123',
        })
      })
    })

    test('PasswordChangeForm_WhenSubmitFails_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockRejectedValue(new Error('パスワードが正しくありません'))
      render(<PasswordChangeForm onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '変更する' }))

      // Act
      fireEvent.change(screen.getByLabelText('現在のパスワード'), {
        target: { value: 'wrongpass' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
        target: { value: 'newpassword123' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'パスワードを変更' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('パスワードが正しくありません')
      })
    })
  })
})
