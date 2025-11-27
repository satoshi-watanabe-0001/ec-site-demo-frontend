/**
 * @fileoverview productServiceのユニットテスト
 * @module services/__tests__/productService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

// Mock @lib/env before importing the service
jest.mock('@/lib/env', () => ({
  config: {
    api: {
      baseURL: 'http://localhost:8080',
    },
  },
}))

import { getPopularDevices, searchDevices } from '../productService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('productService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getPopularDevices', () => {
    test('getPopularDevices_WithDefaultLimit_ShouldFetchWithLimit6', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getPopularDevices()

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=6'))
    })

    test('getPopularDevices_WithCustomLimit_ShouldFetchWithCustomLimit', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getPopularDevices(10)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'))
    })

    test('getPopularDevices_WhenSuccess_ShouldReturnDevices', async () => {
      // Arrange
      const mockResponse = {
        devices: [
          { id: 'device-001', name: 'iPhone 16 Pro' },
          { id: 'device-002', name: 'iPhone 16' },
        ],
        total: 2,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getPopularDevices()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getPopularDevices_WhenError_ShouldThrowError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getPopularDevices()).rejects.toThrow('人気端末の取得に失敗しました: 500')
    })
  })

  describe('searchDevices', () => {
    test('searchDevices_WithNoParams_ShouldFetchWithEmptyParams', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await searchDevices({})

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventory/search'))
    })

    test('searchDevices_WithLimit_ShouldIncludeLimitParam', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await searchDevices({ limit: 10 })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'))
    })

    test('searchDevices_WithOffset_ShouldIncludeOffsetParam', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await searchDevices({ offset: 20 })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('offset=20'))
    })

    test('searchDevices_WithCategory_ShouldIncludeCategoryParam', async () => {
      // Arrange
      const mockResponse = {
        devices: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await searchDevices({ category: 'iphone' })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category=iphone'))
    })

    test('searchDevices_WhenSuccess_ShouldReturnDevices', async () => {
      // Arrange
      const mockResponse = {
        devices: [{ id: 'device-001', name: 'iPhone 16 Pro' }],
        total: 1,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await searchDevices({ limit: 5 })

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('searchDevices_WhenError_ShouldThrowError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      // Act & Assert
      await expect(searchDevices({})).rejects.toThrow('端末検索に失敗しました: 404')
    })
  })
})
