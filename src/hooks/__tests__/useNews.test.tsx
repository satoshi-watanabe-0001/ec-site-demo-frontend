/**
 * @fileoverview useNewsフックのユニットテスト
 * @module hooks/__tests__/useNews.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useNews } from '../useNews'

// Mock the marketingService
jest.mock('@/services/marketingService', () => ({
  getNews: jest.fn(),
}))

import { getNews } from '@/services/marketingService'

const mockGetNews = getNews as jest.MockedFunction<typeof getNews>

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

describe('useNews', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('デフォルトオプション', () => {
    test('useNews_WithDefaultOptions_ShouldFetchWithLimit5', async () => {
      // Arrange
      const mockResponse = {
        news: [{ id: 'news-001', title: 'お知らせ1' }],
        total: 1,
      }
      mockGetNews.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useNews(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetNews).toHaveBeenCalledWith({ limit: 5, category: undefined })
    })
  })

  describe('カスタムオプション', () => {
    test('useNews_WithCustomLimit_ShouldFetchWithCustomLimit', async () => {
      // Arrange
      const mockResponse = {
        news: [],
        total: 0,
      }
      mockGetNews.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useNews({ limit: 10 }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetNews).toHaveBeenCalledWith({ limit: 10, category: undefined })
    })

    test('useNews_WithCategory_ShouldFetchWithCategory', async () => {
      // Arrange
      const mockResponse = {
        news: [],
        total: 0,
      }
      mockGetNews.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useNews({ category: 'キャンペーン' }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetNews).toHaveBeenCalledWith({ limit: 5, category: 'キャンペーン' })
    })

    test('useNews_WithEnabledFalse_ShouldNotFetch', async () => {
      // Arrange & Act
      renderHook(() => useNews({ enabled: false }), {
        wrapper: createWrapper(),
      })

      // Assert
      expect(mockGetNews).not.toHaveBeenCalled()
    })
  })

  describe('データ取得', () => {
    test('useNews_WhenSuccess_ShouldReturnData', async () => {
      // Arrange
      const mockResponse = {
        news: [
          { id: 'news-001', title: 'お知らせ1' },
          { id: 'news-002', title: 'お知らせ2' },
        ],
        total: 2,
      }
      mockGetNews.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => useNews(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(result.current.data).toEqual(mockResponse)
    })

    test('useNews_WhenError_ShouldReturnError', async () => {
      // Arrange
      const error = new Error('ニュースの取得に失敗しました')
      mockGetNews.mockRejectedValueOnce(error)

      // Act
      const { result } = renderHook(() => useNews(), {
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
