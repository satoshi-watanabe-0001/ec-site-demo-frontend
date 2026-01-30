/**
 * @fileoverview ContactInfoFormコンポーネントのユニットテスト
 * @module components/mypage/settings/__tests__/ContactInfoForm.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactInfoForm } from '../ContactInfoForm'
import type { AccountProfile } from '@/types'

describe('ContactInfoForm', () => {
  const mockProfile: AccountProfile = {
    userId: 'user-001',
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    email: 'test@example.com',
    phoneNumber: '090-1234-5678',
    birthDate: '1990-01-01',
    postalCode: '123-4567',
    address: '東京都渋谷区1-2-3',
    registeredAt: '2023-04-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }

  describe('レンダリング', () => {
    test('ContactInfoForm_WithValidProfile_ShouldRenderContactInfo', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={mockProfile} />)

      // Assert
      expect(screen.getByText('連絡先情報')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
    })

    test('ContactInfoForm_WithValidProfile_ShouldRenderPostalCode', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={mockProfile} />)

      // Assert
      expect(screen.getByText('123-4567')).toBeInTheDocument()
    })

    test('ContactInfoForm_WithValidProfile_ShouldRenderAddress', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={mockProfile} />)

      // Assert
      expect(screen.getByText('東京都渋谷区1-2-3')).toBeInTheDocument()
    })

    test('ContactInfoForm_WithValidProfile_ShouldRenderEditButton', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={mockProfile} />)

      // Assert
      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
    })
  })

  describe('編集モード', () => {
    test('ContactInfoForm_WhenEditButtonClicked_ShouldShowEditForm', () => {
      // Arrange
      render(<ContactInfoForm profile={mockProfile} />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '編集' }))

      // Assert
      expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByLabelText('電話番号')).toBeInTheDocument()
      expect(screen.getByLabelText('郵便番号')).toBeInTheDocument()
      expect(screen.getByLabelText('住所')).toBeInTheDocument()
    })

    test('ContactInfoForm_WhenEditButtonClicked_ShouldShowSaveAndCancelButtons', () => {
      // Arrange
      render(<ContactInfoForm profile={mockProfile} />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '編集' }))

      // Assert
      expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
    })

    test('ContactInfoForm_WhenCancelClicked_ShouldExitEditMode', () => {
      // Arrange
      render(<ContactInfoForm profile={mockProfile} />)
      fireEvent.click(screen.getByRole('button', { name: '編集' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

      // Assert
      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
      expect(screen.queryByLabelText('メールアドレス')).not.toBeInTheDocument()
    })
  })

  describe('フォーム送信', () => {
    test('ContactInfoForm_WhenFormSubmitted_ShouldCallOnSubmit', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockResolvedValue(undefined)
      render(<ContactInfoForm profile={mockProfile} onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '編集' }))

      // Act
      fireEvent.change(screen.getByLabelText('メールアドレス'), {
        target: { value: 'new@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: '保存' }))

      // Assert
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'new@example.com',
          })
        )
      })
    })

    test('ContactInfoForm_WhenSubmitFails_ShouldShowError', async () => {
      // Arrange
      const handleSubmit = jest.fn().mockRejectedValue(new Error('更新に失敗しました'))
      render(<ContactInfoForm profile={mockProfile} onSubmit={handleSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: '編集' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: '保存' }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('更新に失敗しました')
      })
    })
  })

  describe('ローディング状態', () => {
    test('ContactInfoForm_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('連絡先情報')).not.toBeInTheDocument()
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('ContactInfoForm_WithNullProfile_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<ContactInfoForm profile={null} />)

      // Assert
      expect(screen.getByText('連絡先情報を取得できませんでした')).toBeInTheDocument()
    })
  })
})
