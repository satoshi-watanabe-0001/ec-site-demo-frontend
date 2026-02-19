/**
 * @fileoverview ContactInfoFormコンポーネントのユニットテスト
 * @module components/mypage/Settings/__tests__/ContactInfoForm.test
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactInfoForm } from '../ContactInfoForm'

describe('ContactInfoForm', () => {
  const defaultProps = {
    initialEmail: 'test@docomo.ne.jp',
    initialPhone: '090-1234-5678',
    initialAddress: '東京都千代田区丸の内1-1-1',
    onSubmit: jest.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    defaultProps.onSubmit.mockClear()
  })

  test('ContactInfoForm_WithInitialValues_ShouldRenderEmailField', () => {
    render(<ContactInfoForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    expect(emailInput).toHaveValue('test@docomo.ne.jp')
  })

  test('ContactInfoForm_WithInitialValues_ShouldRenderPhoneField', () => {
    render(<ContactInfoForm {...defaultProps} />)

    const phoneInput = screen.getByLabelText('電話番号')
    expect(phoneInput).toHaveValue('090-1234-5678')
  })

  test('ContactInfoForm_WithInitialValues_ShouldRenderAddressField', () => {
    render(<ContactInfoForm {...defaultProps} />)

    const addressInput = screen.getByLabelText('住所')
    expect(addressInput).toHaveValue('東京都千代田区丸の内1-1-1')
  })

  test('ContactInfoForm_WithDefaultProps_ShouldRenderSubmitButton', () => {
    render(<ContactInfoForm {...defaultProps} />)

    expect(screen.getByTestId('contact-submit-button')).toHaveTextContent('連絡先を更新')
  })

  test('ContactInfoForm_WhenSubmitted_ShouldCallOnSubmit', async () => {
    render(<ContactInfoForm {...defaultProps} />)

    fireEvent.click(screen.getByTestId('contact-submit-button'))

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        email: 'test@docomo.ne.jp',
        phone: '090-1234-5678',
        address: '東京都千代田区丸の内1-1-1',
      })
    })
  })

  test('ContactInfoForm_WhenSubmitSucceeds_ShouldShowSuccessMessage', async () => {
    render(<ContactInfoForm {...defaultProps} />)

    fireEvent.click(screen.getByTestId('contact-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('contact-form-message')).toHaveTextContent(
        '連絡先情報を更新しました'
      )
    })
  })

  test('ContactInfoForm_WhenSubmitFails_ShouldShowErrorMessage', async () => {
    defaultProps.onSubmit.mockRejectedValueOnce(new Error('更新失敗'))
    render(<ContactInfoForm {...defaultProps} />)

    fireEvent.click(screen.getByTestId('contact-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('contact-form-message')).toHaveTextContent('更新に失敗しました')
    })
  })

  test('ContactInfoForm_WhenEmailChanged_ShouldUpdateValue', () => {
    render(<ContactInfoForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    fireEvent.change(emailInput, { target: { value: 'new@test.com' } })

    expect(emailInput).toHaveValue('new@test.com')
  })

  test('ContactInfoForm_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<ContactInfoForm {...defaultProps} />)

    expect(screen.getByText('連絡先情報')).toBeInTheDocument()
  })

  test('ContactInfoForm_WithDefaultProps_ShouldHaveTestId', () => {
    render(<ContactInfoForm {...defaultProps} />)

    expect(screen.getByTestId('contact-info-form')).toBeInTheDocument()
  })
})
