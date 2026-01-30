/**
 * @fileoverview ContractDetailsコンポーネントのユニットテスト
 * @module components/mypage/contract/__tests__/ContractDetails.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ContractDetails } from '../ContractDetails'
import type { ContractDetails as ContractDetailsType } from '@/types'

describe('ContractDetails', () => {
  const mockDetails: ContractDetailsType = {
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
    options: [
      {
        optionId: 'opt-001',
        optionName: 'かけ放題オプション',
        monthlyFee: 1100,
      },
    ],
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
    test('ContractDetails_WithValidDetails_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('契約詳細')).toBeInTheDocument()
    })

    test('ContractDetails_WithValidDetails_ShouldRenderContractNumber', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('CNT-2023-001234')).toBeInTheDocument()
    })

    test('ContractDetails_WithValidDetails_ShouldRenderPhoneNumber', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
    })

    test('ContractDetails_WithValidDetails_ShouldRenderPlanName', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('ahamo')).toBeInTheDocument()
    })

    test('ContractDetails_WithValidDetails_ShouldRenderDataCapacity', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('20GB')).toBeInTheDocument()
    })
  })

  describe('ステータス表示', () => {
    test('ContractDetails_WithActiveStatus_ShouldShowActiveLabel', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('契約中')).toBeInTheDocument()
    })

    test('ContractDetails_WithSuspendedStatus_ShouldShowSuspendedLabel', () => {
      // Arrange
      const suspendedDetails = { ...mockDetails, status: 'suspended' as const }

      // Act
      render(<ContractDetails details={suspendedDetails} />)

      // Assert
      expect(screen.getByText('一時停止中')).toBeInTheDocument()
    })
  })

  describe('オプション表示', () => {
    test('ContractDetails_WithOptions_ShouldRenderOptions', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('契約中オプション')).toBeInTheDocument()
      expect(screen.getByText('かけ放題オプション')).toBeInTheDocument()
    })

    test('ContractDetails_WithoutOptions_ShouldNotRenderOptionsSection', () => {
      // Arrange
      const detailsWithoutOptions = { ...mockDetails, options: [] }

      // Act
      render(<ContractDetails details={detailsWithoutOptions} />)

      // Assert
      expect(screen.queryByText('契約中オプション')).not.toBeInTheDocument()
    })
  })

  describe('SIM情報表示', () => {
    test('ContractDetails_WithPhysicalSim_ShouldShowPhysicalSimLabel', () => {
      // Arrange & Act
      render(<ContractDetails details={mockDetails} />)

      // Assert
      expect(screen.getByText('物理SIM')).toBeInTheDocument()
    })

    test('ContractDetails_WithESim_ShouldShowESimLabel', () => {
      // Arrange
      const eSimDetails = {
        ...mockDetails,
        simInfo: { ...mockDetails.simInfo, simType: 'esim' as const },
      }

      // Act
      render(<ContractDetails details={eSimDetails} />)

      // Assert
      expect(screen.getByText('eSIM')).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    test('ContractDetails_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<ContractDetails details={null} isLoading={true} />)

      // Assert
      expect(screen.queryByText('契約詳細')).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('ContractDetails_WithNullDetails_ShouldShowErrorMessage', () => {
      // Arrange & Act
      render(<ContractDetails details={null} />)

      // Assert
      expect(screen.getByText('契約詳細を取得できませんでした')).toBeInTheDocument()
    })
  })
})
