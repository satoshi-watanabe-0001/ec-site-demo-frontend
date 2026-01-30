/**
 * @fileoverview ContractorInfoコンポーネントのユニットテスト
 * @module components/mypage/contract/__tests__/ContractorInfo.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ContractorInfo } from '../ContractorInfo'
import type { ContractDetails } from '@/types'

describe('ContractorInfo', () => {
  const mockDetails: ContractDetails = {
    contractId: 'CNT-001',
    contractNumber: 'CNT-2023-001234',
    phoneNumber: '090-1234-5678',
    status: 'active',
    startDate: '2023-04-01',
    plan: {
      planId: 'plan-001',
      planName: 'ahamo',
      dataCapacity: 20,
      monthlyFee: 2970,
    },
    options: [],
    contractor: {
      name: '山田 太郎',
      nameKana: 'ヤマダ タロウ',
      dateOfBirth: '1990-01-15',
      postalCode: '150-0001',
      address: '東京都渋谷区神宮前1-2-3',
      email: 'test@example.com',
      contactPhone: '03-1234-5678',
    },
    simInfo: {
      simType: 'physical',
      iccid: '8981100000000000000',
      activationDate: '2023-04-01',
    },
  }

  describe('レンダリング', () => {
    test('ContractorInfo_WithValidDetails_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('契約者情報')).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderContractorName', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('山田 太郎')).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderNameKana', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('ヤマダ タロウ')).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderDateOfBirth', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('1990-01-15')).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderAddress', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText(/東京都渋谷区神宮前1-2-3/)).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderEmail', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    test('ContractorInfo_WithValidDetails_ShouldRenderContactPhone', () => {
      // Arrange & Act
      render(<ContractorInfo details={mockDetails} />)

      // Assert
      expect(screen.getByText('03-1234-5678')).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('ContractorInfo_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<ContractorInfo details={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('契約者情報')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('ContractorInfo_WithNullDetails_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<ContractorInfo details={null} />)

      // Assert
      expect(screen.getByText('契約者情報を取得できませんでした')).toBeInTheDocument()
    })
  })
})
