/**
 * @fileoverview useContractDetailsフックのユニットテスト
 * @module hooks/__tests__/useContractDetails.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useContractDetails } from '../useContractDetails'
import type { ContractInfo } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getContractDetails: jest.fn(),
}))

import { getContractDetails } from '@/services/mypageService'

const mockGetContractDetails = getContractDetails as jest.MockedFunction<typeof getContractDetails>

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  TestWrapper.displayName = 'TestWrapper'
  return TestWrapper
}

const mockContractInfo: ContractInfo = {
  userId: 'user-001',
  phoneNumber: '090-1234-5678',
  contractDate: '2023-01-15',
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    freeCallIncluded: true,
  },
  options: [],
  contractorName: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  simType: 'eSIM',
}

describe('useContractDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useContractDetails_WithDefaultEnabled_ShouldFetchContractDetails', async () => {
    mockGetContractDetails.mockResolvedValueOnce(mockContractInfo)

    const { result } = renderHook(() => useContractDetails(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockContractInfo)
  })

  test('useContractDetails_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useContractDetails(false), {
      wrapper: createWrapper(),
    })

    expect(mockGetContractDetails).not.toHaveBeenCalled()
  })

  test('useContractDetails_WithError_ShouldReturnError', async () => {
    const error = new Error('契約情報の取得に失敗しました')
    mockGetContractDetails.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useContractDetails(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
