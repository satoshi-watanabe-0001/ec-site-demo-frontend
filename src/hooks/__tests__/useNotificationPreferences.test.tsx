/**
 * @fileoverview useNotificationPreferencesフックのユニットテスト
 * @module hooks/__tests__/useNotificationPreferences.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useNotificationPreferences } from '../useNotificationPreferences'
import type { NotificationPreferences } from '@/types'

jest.mock('@/services/mypageService', () => ({
  getNotificationPreferences: jest.fn(),
}))

import { getNotificationPreferences } from '@/services/mypageService'

const mockGetNotificationPreferences = getNotificationPreferences as jest.MockedFunction<
  typeof getNotificationPreferences
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

const mockPreferences: NotificationPreferences = {
  emailNotification: true,
  campaignNotification: true,
  billingNotification: true,
  dataUsageAlert: true,
  dataUsageAlertThreshold: 80,
}

describe('useNotificationPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useNotificationPreferences_WithDefaultEnabled_ShouldFetchPreferences', async () => {
    mockGetNotificationPreferences.mockResolvedValueOnce(mockPreferences)

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(mockPreferences)
  })

  test('useNotificationPreferences_WithEnabledFalse_ShouldNotFetch', () => {
    renderHook(() => useNotificationPreferences(false), {
      wrapper: createWrapper(),
    })

    expect(mockGetNotificationPreferences).not.toHaveBeenCalled()
  })

  test('useNotificationPreferences_WithError_ShouldReturnError', async () => {
    const error = new Error('通知設定の取得に失敗しました')
    mockGetNotificationPreferences.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(error)
  })
})
