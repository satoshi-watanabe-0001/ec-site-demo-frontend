/**
 * @fileoverview ContractDetailCardコンポーネントのユニットテスト
 * @module components/mypage/ContractInfo/__tests__/ContractDetailCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { ContractDetailCard } from '../ContractDetailCard'
import type { ContractInfo } from '@/types'

describe('ContractDetailCard', () => {
  const mockContract: ContractInfo = {
    contractId: 'C-2025-001',
    phoneNumber: '090-1234-5678',
    plan: {
      id: 'P001',
      name: 'ahamo',
      type: 'ahamo',
      monthlyFee: 2970,
      dataCapacityGB: 20,
      description: 'シンプルなワンプラン。20GBのデータ容量と5分以内の国内通話無料。',
    },
    device: {
      id: 'D001',
      name: 'iPhone 16 Pro',
      imageUrl: '/images/iphone16pro.png',
      purchaseDate: '2025-09-20',
      paymentStatus: 'paid',
    },
    contractStartDate: '2024-01-15',
    status: 'active',
    simType: 'esim',
  }

  test('ContractDetailCard_WithActiveContract_ShouldRenderContractId', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('C-2025-001')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithActiveContract_ShouldRenderPhoneNumber', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('090-1234-5678')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithActiveContract_ShouldRenderPlanName', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('ahamo')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithActiveContract_ShouldRenderMonthlyFee', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('¥2,970/月')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithActiveContract_ShouldShowActiveStatus', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('契約中')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithSuspendedContract_ShouldShowSuspendedStatus', () => {
    const suspended = { ...mockContract, status: 'suspended' as const }
    render(<ContractDetailCard contract={suspended} />)

    expect(screen.getByText('一時停止中')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithEsim_ShouldShowEsimType', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('eSIM')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText('契約情報')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByTestId('contract-detail')).toBeInTheDocument()
  })

  test('ContractDetailCard_WithDefaultProps_ShouldRenderDescription', () => {
    render(<ContractDetailCard contract={mockContract} />)

    expect(screen.getByText(/シンプルなワンプラン/)).toBeInTheDocument()
  })
})
