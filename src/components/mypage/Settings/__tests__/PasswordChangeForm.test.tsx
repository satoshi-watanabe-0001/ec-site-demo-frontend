/**
 * @fileoverview PasswordChangeFormコンポーネントのユニットテスト
 * @module components/mypage/Settings/__tests__/PasswordChangeForm.test
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PasswordChangeForm } from '../PasswordChangeForm'

describe('PasswordChangeForm', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('PasswordChangeForm_WithDefaultProps_ShouldRenderAllFields', () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText('現在のパスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('新しいパスワード')).toBeInTheDocument()
    expect(screen.getByLabelText('新しいパスワード（確認）')).toBeInTheDocument()
  })

  test('PasswordChangeForm_WithDefaultProps_ShouldRenderSubmitButton', () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    expect(screen.getByTestId('password-submit-button')).toHaveTextContent('パスワードを変更')
  })

  test('PasswordChangeForm_WhenPasswordsMismatch_ShouldShowError', async () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'current123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'newpass123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
      target: { value: 'different123' },
    })
    fireEvent.click(screen.getByTestId('password-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('password-form-message')).toHaveTextContent(
        '新しいパスワードが一致しません'
      )
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('PasswordChangeForm_WhenPasswordTooShort_ShouldShowError', async () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'current123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByTestId('password-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('password-form-message')).toHaveTextContent(
        'パスワードは8文字以上で入力してください'
      )
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('PasswordChangeForm_WhenValidSubmission_ShouldCallOnSubmit', async () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'current123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.click(screen.getByTestId('password-submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        currentPassword: 'current123',
        newPassword: 'newpassword123',
      })
    })
  })

  test('PasswordChangeForm_WhenSubmitSucceeds_ShouldShowSuccessMessage', async () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'current123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.click(screen.getByTestId('password-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('password-form-message')).toHaveTextContent(
        'パスワードを変更しました'
      )
    })
  })

  test('PasswordChangeForm_WhenSubmitFails_ShouldShowErrorMessage', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('認証失敗'))
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText('現在のパスワード'), {
      target: { value: 'wrong123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByLabelText('新しいパスワード（確認）'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.click(screen.getByTestId('password-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('password-form-message')).toHaveTextContent(
        '現在のパスワードが正しくありません'
      )
    })
  })

  test('PasswordChangeForm_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    expect(screen.getByText('パスワード変更')).toBeInTheDocument()
  })

  test('PasswordChangeForm_WithDefaultProps_ShouldHaveTestId', () => {
    render(<PasswordChangeForm onSubmit={mockOnSubmit} />)

    expect(screen.getByTestId('password-change-form')).toBeInTheDocument()
  })
})
