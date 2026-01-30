/**
 * @fileoverview PaymentMethodCardコンポーネントのユニットテスト
 * @module components/mypage/billing/__tests__/PaymentMethodCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PaymentMethodCard } from '../PaymentMethodCard'
import type { PaymentMethod } from '@/types'

describe('PaymentMethodCard', () => {
  const mockCreditCard: PaymentMethod = {
    type: 'credit_card',
    isDefault: true,
    cardInfo: {
      cardId: 'card-001',
      brand: 'visa',
      lastFourDigits: '1234',
      expiryDate: '12/26',
      holderName: 'TARO YAMADA',
    },
  }

  const mockBankTransfer: PaymentMethod = {
    type: 'bank_transfer',
    isDefault: false,
    bankInfo: {
      accountId: 'acc-001',
      bankName: '三菱UFJ銀行',
      branchName: '渋谷支店',
      accountType: 'savings',
      accountNumberLast4: '5678',
      accountHolderName: '山田 太郎',
    },
  }

  const mockCarrierBilling: PaymentMethod = {
    type: 'carrier_billing',
    isDefault: false,
  }

  describe('クレジットカード表示', () => {
    test('PaymentMethodCard_WithCreditCard_ShouldRenderCardInfo', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCreditCard} />)

      // Assert
      expect(screen.getByText('お支払い方法')).toBeInTheDocument()
      expect(screen.getByText('**** **** **** 1234')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithCreditCard_ShouldRenderExpiryDate', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCreditCard} />)

      // Assert
      expect(screen.getByText('12/26')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithCreditCard_ShouldRenderHolderName', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCreditCard} />)

      // Assert
      expect(screen.getByText('TARO YAMADA')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithDefaultCard_ShouldShowDefaultLabel', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCreditCard} />)

      // Assert
      expect(screen.getByText('デフォルトの支払い方法')).toBeInTheDocument()
    })
  })

  describe('口座振替表示', () => {
    test('PaymentMethodCard_WithBankTransfer_ShouldRenderBankInfo', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockBankTransfer} />)

      // Assert
      expect(screen.getByText('口座振替')).toBeInTheDocument()
      expect(screen.getByText('三菱UFJ銀行')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithBankTransfer_ShouldRenderBranchName', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockBankTransfer} />)

      // Assert
      expect(screen.getByText('渋谷支店')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithBankTransfer_ShouldRenderAccountType', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockBankTransfer} />)

      // Assert
      expect(screen.getByText('普通')).toBeInTheDocument()
    })
  })

  describe('キャリア決済表示', () => {
    test('PaymentMethodCard_WithCarrierBilling_ShouldRenderCarrierInfo', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCarrierBilling} />)

      // Assert
      expect(screen.getByText('キャリア決済')).toBeInTheDocument()
    })
  })

  describe('編集ボタン', () => {
    test('PaymentMethodCard_WithOnEdit_ShouldRenderEditButton', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={mockCreditCard} onEdit={jest.fn()} />)

      // Assert
      expect(screen.getByRole('button', { name: '変更' })).toBeInTheDocument()
    })

    test('PaymentMethodCard_WhenEditClicked_ShouldCallOnEdit', () => {
      // Arrange
      const handleEdit = jest.fn()
      render(<PaymentMethodCard paymentMethod={mockCreditCard} onEdit={handleEdit} />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '変更' }))

      // Assert
      expect(handleEdit).toHaveBeenCalled()
    })
  })

  describe('未登録状態', () => {
    test('PaymentMethodCard_WithNullPaymentMethod_ShouldShowEmptyMessage', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={null} />)

      // Assert
      expect(screen.getByText('支払い方法が登録されていません')).toBeInTheDocument()
    })

    test('PaymentMethodCard_WithNullPaymentMethodAndOnEdit_ShouldShowRegisterButton', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={null} onEdit={jest.fn()} />)

      // Assert
      expect(screen.getByRole('button', { name: '支払い方法を登録' })).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('PaymentMethodCard_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<PaymentMethodCard paymentMethod={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('お支払い方法')).not.toBeInTheDocument()
    })
  })
})
