/**
 * @fileoverview useAvailableOptionsフックのユニットテスト
 * @module hooks/__tests__/useAvailableOptions.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useAvailableOptions } from '../useAvailableOptions'
import type { AvailableOption } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getAvailableOptions: jest.fn(),
}))

import { getAvailableOptions } from '@/services/mypageService'

const mockGetAvailableOptions = getAvailableOptions as jest.MockedFunction<
  typeof getAvailableOptions
>

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

const mockAvailableOptions: AvailableOption[] = [
  {
    optionId: 'opt-001',
    optionName: 'かけ放題オプション',
    monthlyFee: 1100,
    description: '国内通話かけ放題',
    category: 'call',
    isSubscribed: false,
  },
]

describe('useAvailableOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useAvailableOptions_WithDefaultEnabled_ShouldFetchOptions', async () => {
    mockGetAvailableOptions.mockResolvedValueOnce(mockAvailableOptions)

    const { result } = renderHook(() => useAvailableOptions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockAvailableOptions)
  })

  test('useAvailableOptions_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useAvailableOptions(false), {
      wrapper: createWrapper(),
    })

    expect(mockGetAvailableOptions).not.toHaveBeenCalled()
  })

  test('useAvailableOptions_WithError_ShouldReturnError', async () => {
    const error = new Error('オプション一覧の取得に失敗しました')
    mockGetAvailableOptions.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useAvailableOptions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
