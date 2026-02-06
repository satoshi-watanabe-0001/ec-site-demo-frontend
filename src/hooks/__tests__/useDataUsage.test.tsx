/**
 * @fileoverview useDataUsageフックのユニットテスト
 * @module hooks/__tests__/useDataUsage.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useDataUsage } from '../useDataUsage'
import type { DataUsage } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getDataUsage: jest.fn(),
}))

import { getDataUsage } from '@/services/mypageService'

const mockGetDataUsage = getDataUsage as jest.MockedFunction<typeof getDataUsage>

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

const mockDataUsage: DataUsage = {
  currentUsage: 8.5,
  remaining: 11.5,
  totalCapacity: 20,
  lastUpdated: '2024-01-15T10:00:00Z',
  dailyUsage: [],
  monthlyHistory: [],
}

describe('useDataUsage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useDataUsage_WithDefaultEnabled_ShouldFetchDataUsage', async () => {
    mockGetDataUsage.mockResolvedValueOnce(mockDataUsage)

    const { result } = renderHook(() => useDataUsage(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockDataUsage)
  })

  test('useDataUsage_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useDataUsage(false), {
      wrapper: createWrapper(),
    })

    expect(mockGetDataUsage).not.toHaveBeenCalled()
  })

  test('useDataUsage_WithError_ShouldReturnError', async () => {
    const error = new Error('データ使用量の取得に失敗しました')
    mockGetDataUsage.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useDataUsage(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
