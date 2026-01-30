/**
 * @fileoverview NotificationSettingsコンポーネントのユニットテスト
 * @module components/mypage/settings/__tests__/NotificationSettings.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationSettings } from '../NotificationSettings'
import type { NotificationSettings as NotificationSettingsType } from '@/types'

describe('NotificationSettings', () => {
  const mockSettings: NotificationSettingsType = {
    email: {
      billing: true,
      campaign: false,
      service: true,
      maintenance: false,
    },
    push: {
      billing: true,
      campaign: true,
      dataUsage: false,
    },
    sms: {
      security: true,
      billing: false,
    },
  }

  describe('レンダリング', () => {
    test('NotificationSettings_WithValidSettings_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<NotificationSettings settings={mockSettings} />)

      // Assert
      expect(screen.getByText('通知設定')).toBeInTheDocument()
    })

    test('NotificationSettings_WithValidSettings_ShouldRenderEmailSection', () => {
      // Arrange & Act
      render(<NotificationSettings settings={mockSettings} />)

      // Assert
      expect(screen.getByText('メール通知')).toBeInTheDocument()
    })

    test('NotificationSettings_WithValidSettings_ShouldRenderPushSection', () => {
      // Arrange & Act
      render(<NotificationSettings settings={mockSettings} />)

      // Assert
      expect(screen.getByText('プッシュ通知')).toBeInTheDocument()
    })

    test('NotificationSettings_WithValidSettings_ShouldRenderSmsSection', () => {
      // Arrange & Act
      render(<NotificationSettings settings={mockSettings} />)

      // Assert
      expect(screen.getByText('SMS通知')).toBeInTheDocument()
    })
  })

  describe('トグルスイッチ', () => {
    test('NotificationSettings_WithValidSettings_ShouldRenderToggleSwitches', () => {
      // Arrange & Act
      render(<NotificationSettings settings={mockSettings} />)

      // Assert
      const switches = screen.getAllByRole('switch')
      expect(switches.length).toBeGreaterThan(0)
    })

    test('NotificationSettings_WhenToggleClicked_ShouldShowSaveButton', () => {
      // Arrange
      render(<NotificationSettings settings={mockSettings} onSubmit={jest.fn()} />)

      // Act
      const switches = screen.getAllByRole('switch')
      fireEvent.click(switches[0])

      // Assert
      expect(screen.getByRole('button', { name: '設定を保存' })).toBeInTheDocument()
    })
  })

  describe('フォーム送信', () => {
    test('NotificationSettings_WhenSaveClicked_ShouldCallOnSubmit', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined)
      render(<NotificationSettings settings={mockSettings} onSubmit={handleSubmit} />)

      // Act
      const switches = screen.getAllByRole('switch')
      fireEvent.click(switches[0])
      fireEvent.click(screen.getByRole('button', { name: '設定を保存' }))

      // Assert
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

    test('NotificationSettings_WhenSubmitSucceeds_ShouldShowSuccessMessage', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined)
      render(<NotificationSettings settings={mockSettings} onSubmit={handleSubmit} />)

      // Act
      const switches = screen.getAllByRole('switch')
      fireEvent.click(switches[0])
      fireEvent.click(screen.getByRole('button', { name: '設定を保存' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('設定を保存しました')
      })
    })

    test('NotificationSettings_WhenSubmitFails_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockRejectedValue(new Error('保存に失敗しました'))
      render(<NotificationSettings settings={mockSettings} onSubmit={handleSubmit} />)

      // Act
      const switches = screen.getAllByRole('switch')
      fireEvent.click(switches[0])
      fireEvent.click(screen.getByRole('button', { name: '設定を保存' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('保存に失敗しました')
      })
    })
  })

  describe('ローディング状態', () => {
    test('NotificationSettings_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<NotificationSettings settings={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('メール通知')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('NotificationSettings_WithNullSettings_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<NotificationSettings settings={null} />)

      // Assert
      expect(screen.getByText('通知設定を取得できませんでした')).toBeInTheDocument()
    })
  })
})
