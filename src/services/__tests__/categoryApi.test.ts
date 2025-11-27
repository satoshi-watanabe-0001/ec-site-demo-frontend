/**
 * @fileoverview categoryApiサービスのユニットテスト
 * @module services/__tests__/categoryApi.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

// @lib/envをモック（ESMモジュール問題を回避）
jest.mock('@/lib/env', () => ({
  config: {
    api: {
      baseURL: 'http://localhost:8080',
    },
  },
}))

import { getCategoryProducts } from '../categoryApi'
import type { CategoryDetailResponse } from '@/types'

// fetchをグローバルにモック
const mockFetch = jest.fn()
global.fetch = mockFetch

// console.errorをモック（エラーログを抑制）
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('categoryApi', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('getCategoryProducts', () => {
    test('getCategoryProducts_WithCategoryCode_ShouldFetchCorrectUrl', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCategoryProducts('iphone')

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/products/categories/iphone',
        { cache: 'no-store' }
      )
    })

    test('getCategoryProducts_WithKeyword_ShouldIncludeKeywordParam', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCategoryProducts('iphone', { keyword: 'Pro' })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('keyword=Pro'),
        expect.any(Object)
      )
    })

    test('getCategoryProducts_WithPagination_ShouldIncludePaginationParams', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCategoryProducts('iphone', { page: 2, size: 10 })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=2'), expect.any(Object))
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('size=10'), expect.any(Object))
    })

    test('getCategoryProducts_WithSort_ShouldIncludeSortParams', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCategoryProducts('iphone', { sort: 'price', order: 'asc' })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=price'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('order=asc'),
        expect.any(Object)
      )
    })

    test('getCategoryProducts_WhenSuccess_ShouldReturnData', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
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
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getCategoryProducts('iphone')

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getCategoryProducts_WhenHttpError_ShouldReturnEmptyResponse', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act
      const result = await getCategoryProducts('iphone')

      // Assert
      // エラー時は空のレスポンスを返す（UIクラッシュ防止）
      expect(result).toEqual({
        categoryCode: 'iphone',
        categoryName: '',
        products: [],
        totalCount: 0,
      })
      expect(mockConsoleError).toHaveBeenCalled()
    })

    test('getCategoryProducts_WhenNetworkError_ShouldReturnEmptyResponse', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Act
      const result = await getCategoryProducts('iphone')

      // Assert
      // ネットワークエラー時も空のレスポンスを返す
      expect(result).toEqual({
        categoryCode: 'iphone',
        categoryName: '',
        products: [],
        totalCount: 0,
      })
      expect(mockConsoleError).toHaveBeenCalled()
    })

    test('getCategoryProducts_WithPageZero_ShouldIncludePageParam', async () => {
      // Arrange
      const mockResponse: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: [],
        totalCount: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCategoryProducts('iphone', { page: 0 })

      // Assert
      // page=0も有効なパラメータとして含める
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=0'), expect.any(Object))
    })
  })
})
