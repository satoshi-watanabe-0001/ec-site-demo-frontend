/**
 * @fileoverview usePopularDevicesフックのユニットテスト
 * @module hooks/__tests__/usePopularDevices.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { usePopularDevices } from '../usePopularDevices'

// Mock the productService
jest.mock('@/services/productService', () => ({
  getPopularDevices: jest.fn(),
}))

import { getPopularDevices } from '@/services/productService'

const mockGetPopularDevices = getPopularDevices as jest.MockedFunction<typeof getPopularDevices>

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

describe('usePopularDevices', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('デフォルトオプション', () => {
    test('usePopularDevices_WithDefaultOptions_ShouldFetchWithLimit6', async () => {
      // Arrange
      const mockResponse = {
        devices: [{ id: 'device-001', name: 'iPhone 16 Pro' }],
        total: 1,
      }
      mockGetPopularDevices.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => usePopularDevices(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetPopularDevices).toHaveBeenCalledWith(6)
    })
  })

  describe('カスタムオプション', () => {
    test('usePopularDevices_WithCustomLimit_ShouldFetchWithCustomLimit', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockGetPopularDevices.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => usePopularDevices({ limit: 10 }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetPopularDevices).toHaveBeenCalledWith(10)
    })

    test('usePopularDevices_WithEnabledFalse_ShouldNotFetch', async () => {
      // Arrange & Act
      renderHook(() => usePopularDevices({ enabled: false }), {
        wrapper: createWrapper(),
      })

      // Assert
      expect(mockGetPopularDevices).not.toHaveBeenCalled()
    })
  })

  describe('データ取得', () => {
    test('usePopularDevices_WhenSuccess_ShouldReturnData', async () => {
      // Arrange
      const mockResponse = {
        devices: [
          { id: 'device-001', name: 'iPhone 16 Pro' },
          { id: 'device-002', name: 'iPhone 16' },
        ],
        total: 2,
      }
      mockGetPopularDevices.mockResolvedValueOnce(mockResponse)

      // Act
      const { result } = renderHook(() => usePopularDevices(), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(result.current.data).toEqual(mockResponse)
    })

    test('usePopularDevices_WhenError_ShouldReturnError', async () => {
      // Arrange
      const error = new Error('人気端末の取得に失敗しました')
      mockGetPopularDevices.mockRejectedValueOnce(error)

      // Act
      const { result } = renderHook(() => usePopularDevices(), {
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
