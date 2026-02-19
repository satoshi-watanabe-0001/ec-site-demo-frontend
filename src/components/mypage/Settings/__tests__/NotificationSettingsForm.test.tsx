/**
 * @fileoverview NotificationSettingsFormコンポーネントのユニットテスト
 * @module components/mypage/Settings/__tests__/NotificationSettingsForm.test
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationSettingsForm } from '../NotificationSettingsForm'
import type { NotificationSettings } from '@/types'

describe('NotificationSettingsForm', () => {
  const mockSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    usageAlerts: true,
    billingAlerts: true,
  }
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('NotificationSettingsForm_WithSettings_ShouldRenderAllToggles', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    expect(screen.getByText('メール通知')).toBeInTheDocument()
    expect(screen.getByText('SMS通知')).toBeInTheDocument()
    expect(screen.getByText('キャンペーン通知')).toBeInTheDocument()
    expect(screen.getByText('データ使用量通知')).toBeInTheDocument()
    expect(screen.getByText('請求通知')).toBeInTheDocument()
  })

  test('NotificationSettingsForm_WithSettings_ShouldReflectInitialState', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    const emailToggle = screen.getByTestId('notification-toggle-emailNotifications')
    expect(emailToggle).toHaveAttribute('aria-checked', 'true')

    const smsToggle = screen.getByTestId('notification-toggle-smsNotifications')
    expect(smsToggle).toHaveAttribute('aria-checked', 'false')
  })

  test('NotificationSettingsForm_WhenToggleClicked_ShouldToggleState', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    const smsToggle = screen.getByTestId('notification-toggle-smsNotifications')
    fireEvent.click(smsToggle)

    expect(smsToggle).toHaveAttribute('aria-checked', 'true')
  })

  test('NotificationSettingsForm_WhenSubmitted_ShouldCallOnSubmit', async () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    fireEvent.click(screen.getByTestId('notification-submit-button'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockSettings)
    })
  })

  test('NotificationSettingsForm_WhenSubmitSucceeds_ShouldShowSuccessMessage', async () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    fireEvent.click(screen.getByTestId('notification-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('notification-form-message')).toHaveTextContent(
        '通知設定を更新しました'
      )
    })
  })

  test('NotificationSettingsForm_WhenSubmitFails_ShouldShowErrorMessage', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('更新失敗'))
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    fireEvent.click(screen.getByTestId('notification-submit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('notification-form-message')).toHaveTextContent(
        '更新に失敗しました'
      )
    })
  })

  test('NotificationSettingsForm_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    expect(screen.getByText('通知設定')).toBeInTheDocument()
  })

  test('NotificationSettingsForm_WithDefaultProps_ShouldRenderSubmitButton', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    expect(screen.getByTestId('notification-submit-button')).toHaveTextContent('設定を保存')
  })

  test('NotificationSettingsForm_WithDefaultProps_ShouldHaveTestId', () => {
    render(<NotificationSettingsForm initialSettings={mockSettings} onSubmit={mockOnSubmit} />)

    expect(screen.getByTestId('notification-settings-form')).toBeInTheDocument()
  })
})
