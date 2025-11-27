/**
 * @fileoverview useCategoryProductsフックのユニットテスト
 * @module hooks/__tests__/useCategoryProducts.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useCategoryProducts } from '../useCategoryProducts'
import type { CategoryDetailResponse } from '@/types'

// categoryApiサービスをモック
jest.mock('@/services/categoryApi', () => ({
  getCategoryProducts: jest.fn(),
}))

import { getCategoryProducts } from '@/services/categoryApi'

const mockGetCategoryProducts = getCategoryProducts as jest.MockedFunction<
  typeof getCategoryProducts
>

/**
 * QueryClientProviderラッパーを作成
 */
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

/**
 * モック用カテゴリ詳細レスポンス
 */
const mockCategoryResponse: CategoryDetailResponse = {
  categoryCode: 'iphone',
  categoryName: 'iPhone',
  products: [
    {
      productId: 1,
      productName: 'iPhone 16 Pro Max',
      manufacturer: 'Apple',
      price: 189800,
      imageUrls: ['/images/devices/iphone-16-pro-max.png'],
      storageOptions: ['256GB', '512GB', '1TB'],
      colorOptions: [{ name: 'ナチュラルチタニウム', hex: '#C4B8A5' }],
      campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
      inStock: true,
    },
  ],
  totalCount: 1,
}

describe('useCategoryProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('デフォルトオプション', () => {
    test('useCategoryProducts_WithCategoryCode_ShouldFetchCategoryProducts', async () => {
      // Arrange
      mockGetCategoryProducts.mockResolvedValueOnce(mockCategoryResponse)

      // Act
      const { result } = renderHook(() => useCategoryProducts('iphone'), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCategoryProducts).toHaveBeenCalledWith('iphone', {
        keyword: undefined,
        page: undefined,
        size: undefined,
        sort: undefined,
        order: undefined,
      })
    })

    test('useCategoryProducts_WithEmptyCategoryCode_ShouldNotFetch', async () => {
      // Arrange & Act
      renderHook(() => useCategoryProducts(''), {
        wrapper: createWrapper(),
      })

      // Assert
      expect(mockGetCategoryProducts).not.toHaveBeenCalled()
    })
  })

  describe('カスタムオプション', () => {
    test('useCategoryProducts_WithKeyword_ShouldFetchWithKeyword', async () => {
      // Arrange
      mockGetCategoryProducts.mockResolvedValueOnce(mockCategoryResponse)

      // Act
      const { result } = renderHook(() => useCategoryProducts('iphone', { keyword: 'Pro' }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCategoryProducts).toHaveBeenCalledWith('iphone', {
        keyword: 'Pro',
        page: undefined,
        size: undefined,
        sort: undefined,
        order: undefined,
      })
    })

    test('useCategoryProducts_WithPagination_ShouldFetchWithPaginationParams', async () => {
      // Arrange
      mockGetCategoryProducts.mockResolvedValueOnce(mockCategoryResponse)

      // Act
      const { result } = renderHook(() => useCategoryProducts('iphone', { page: 2, size: 10 }), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCategoryProducts).toHaveBeenCalledWith('iphone', {
        keyword: undefined,
        page: 2,
        size: 10,
        sort: undefined,
        order: undefined,
      })
    })

    test('useCategoryProducts_WithSort_ShouldFetchWithSortParams', async () => {
      // Arrange
      mockGetCategoryProducts.mockResolvedValueOnce(mockCategoryResponse)

      // Act
      const { result } = renderHook(
        () => useCategoryProducts('iphone', { sort: 'price', order: 'asc' }),
        { wrapper: createWrapper() }
      )

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(mockGetCategoryProducts).toHaveBeenCalledWith('iphone', {
        keyword: undefined,
        page: undefined,
        size: undefined,
        sort: 'price',
        order: 'asc',
      })
    })

    test('useCategoryProducts_WithEnabledFalse_ShouldNotFetch', async () => {
      // Arrange & Act
      renderHook(() => useCategoryProducts('iphone', { enabled: false }), {
        wrapper: createWrapper(),
      })

      // Assert
      expect(mockGetCategoryProducts).not.toHaveBeenCalled()
    })
  })

  describe('データ取得', () => {
    test('useCategoryProducts_WhenSuccess_ShouldReturnData', async () => {
      // Arrange
      mockGetCategoryProducts.mockResolvedValueOnce(mockCategoryResponse)

      // Act
      const { result } = renderHook(() => useCategoryProducts('iphone'), {
        wrapper: createWrapper(),
      })

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      expect(result.current.data).toEqual(mockCategoryResponse)
    })

    test('useCategoryProducts_WhenError_ShouldReturnError', async () => {
      // Arrange
      const error = new Error('カテゴリ製品の取得に失敗しました')
      mockGetCategoryProducts.mockRejectedValueOnce(error)

      // Act
      const { result } = renderHook(() => useCategoryProducts('iphone'), {
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
