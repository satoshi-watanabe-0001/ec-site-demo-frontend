/**
 * @fileoverview useBillingInfoフックのユニットテスト
 * @module hooks/__tests__/useBillingInfo.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useBillingInfo } from '../useBillingInfo'
import type { BillingInfo } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getBillingInfo: jest.fn(),
}))

import { getBillingInfo } from '@/services/mypageService'

const mockGetBillingInfo = getBillingInfo as jest.MockedFunction<typeof getBillingInfo>

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

const mockBillingInfo: BillingInfo = {
  currentMonthEstimate: {
    month: '2024-01',
    basicFee: 2970,
    callFee: 0,
    optionFee: 0,
    discount: 0,
    totalAmount: 2970,
    items: [{ itemName: '基本料金', amount: 2970 }],
    isConfirmed: false,
  },
  history: [],
  paymentMethod: { type: 'credit_card', displayName: 'VISA ****1234' },
}

describe('useBillingInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useBillingInfo_WithDefaultEnabled_ShouldFetchBillingInfo', async () => {
    mockGetBillingInfo.mockResolvedValueOnce(mockBillingInfo)

    const { result } = renderHook(() => useBillingInfo(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockBillingInfo)
  })

  test('useBillingInfo_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useBillingInfo(false), {
      wrapper: createWrapper(),
    })

    expect(mockGetBillingInfo).not.toHaveBeenCalled()
  })

  test('useBillingInfo_WithError_ShouldReturnError', async () => {
    const error = new Error('請求情報の取得に失敗しました')
    mockGetBillingInfo.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useBillingInfo(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
