/**
 * @fileoverview useDashboardフックのユニットテスト
 * @module hooks/__tests__/useDashboard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useDashboard } from '../useDashboard'
import type { DashboardData } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getDashboardData: jest.fn(),
}))

import { getDashboardData } from '@/services/mypageService'

const mockGetDashboardData = getDashboardData as jest.MockedFunction<typeof getDashboardData>

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

const mockDashboardData: DashboardData = {
  contract: {
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
  },
  dataUsage: {
    currentUsage: 8.5,
    remaining: 11.5,
    totalCapacity: 20,
    lastUpdated: '2024-01-15T10:00:00Z',
    dailyUsage: [],
    monthlyHistory: [],
  },
  billing: {
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
  },
  device: null,
  notifications: [],
}

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useDashboard_WithDefaultOptions_ShouldFetchDashboardData', async () => {
    mockGetDashboardData.mockResolvedValueOnce(mockDashboardData)

    const { result } = renderHook(() => useDashboard(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockDashboardData)
  })

  test('useDashboard_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useDashboard({ enabled: false }), {
      wrapper: createWrapper(),
    })

    expect(mockGetDashboardData).not.toHaveBeenCalled()
  })

  test('useDashboard_WithError_ShouldReturnError', async () => {
    const error = new Error('データの取得に失敗しました')
    mockGetDashboardData.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useDashboard(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
