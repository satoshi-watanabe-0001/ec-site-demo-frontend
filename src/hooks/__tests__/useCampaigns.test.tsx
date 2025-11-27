/**
 * @fileoverview useCampaignsフックのユニットテスト
 * @module hooks/__tests__/useCampaigns.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useCampaigns } from '../useCampaigns'

// Mock the marketingService
jest.mock('@/services/marketingService', () => ({
  getCampaigns: jest.fn(),
}))

import { getCampaigns } from '@/services/marketingService'

const mockGetCampaigns = getCampaigns as jest.MockedFunction<typeof getCampaigns>

// Create a wrapper with QueryClientProvider
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  TestWrapper.displayName = 'TestWrapper'
  return TestWrapper
}

describe('useCampaigns', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('デフォルトオプション', () => {
    test('useCampaigns_WithDefaultOptions_ShouldFetchWithLimit4', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [{ id: 'campaign-001', title: '5G WELCOME割' }],
        total: 1,
      }
      mockGetCampaigns.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useCampaigns(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCampaigns).toHaveBeenCalledWith({ limit: 4, category: undefined })
    })
  })

  describe('カスタムオプション', () => {
    test('useCampaigns_WithCustomLimit_ShouldFetchWithCustomLimit', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [],
        total: 0,
      }
      mockGetCampaigns.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useCampaigns({ limit: 10 }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCampaigns).toHaveBeenCalledWith({ limit: 10, category: undefined })
    })

    test('useCampaigns_WithCategory_ShouldFetchWithCategory', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [],
        total: 0,
      }
      mockGetCampaigns.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useCampaigns({ category: '新規契約' }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCampaigns).toHaveBeenCalledWith({ limit: 4, category: '新規契約' })
    })

    test('useCampaigns_WithEnabledFalse_ShouldNotFetch', async () => {
      // Arrange & Act
      renderHook(() => useCampaigns({ enabled: false }), {
        wrapper: createWrapper(),
      })

      // Assert
      expect(mockGetCampaigns).not.toHaveBeenCalled()
    })
  })

  describe('データ取得', () => {
    test('useCampaigns_WhenSuccess_ShouldReturnData', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [
          { id: 'campaign-001', title: '5G WELCOME割' },
          { id: 'campaign-002', title: 'ahamoポイ活' },
        ],
        total: 2,
      }
      mockGetCampaigns.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useCampaigns(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(result.current.data).toEqual(mockResponse)
    })

    test('useCampaigns_WhenError_ShouldReturnError', async () => {
      // Arrange
      const error = new Error('キャンペーンの取得に失敗しました')
      mockGetCampaigns.mockRejectedValueOnce(error)

      // Act
      const { result } = renderHook(() => useCampaigns(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(result.current.error).toEqual(error)
    })
  })
})
