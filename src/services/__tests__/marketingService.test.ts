/**
 * @fileoverview marketingServiceのユニットテスト
 * @module services/__tests__/marketingService.test
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

import { getCampaigns, getNews } from '../marketingService'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('marketingService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getCampaigns', () => {
    test('getCampaigns_WithNoParams_ShouldFetchWithEmptyParams', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCampaigns()

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/campaigns'))
    })

    test('getCampaigns_WithLimit_ShouldIncludeLimitParam', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCampaigns({ limit: 5 })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=5'))
    })

    test('getCampaigns_WithCategory_ShouldIncludeCategoryParam', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getCampaigns({ category: '新規契約' })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category='))
    })

    test('getCampaigns_WhenSuccess_ShouldReturnCampaigns', async () => {
      // Arrange
      const mockResponse = {
        campaigns: [
          { id: 'campaign-001', name: '5G WELCOME割' },
          { id: 'campaign-002', name: 'ahamoポイ活' },
        ],
        total: 2,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getCampaigns()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getCampaigns_WhenError_ShouldThrowError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getCampaigns()).rejects.toThrow('キャンペーンの取得に失敗しました: 500')
    })
  })

  describe('getNews', () => {
    test('getNews_WithNoParams_ShouldFetchWithEmptyParams', async () => {
      // Arrange
      const mockResponse = {
        news: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getNews()

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/news'))
    })

    test('getNews_WithLimit_ShouldIncludeLimitParam', async () => {
      // Arrange
      const mockResponse = {
        news: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getNews({ limit: 10 })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'))
    })

    test('getNews_WithCategory_ShouldIncludeCategoryParam', async () => {
      // Arrange
      const mockResponse = {
        news: [],
        total: 0,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      await getNews({ category: 'キャンペーン' })

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category='))
    })

    test('getNews_WhenSuccess_ShouldReturnNews', async () => {
      // Arrange
      const mockResponse = {
        news: [
          { id: 'news-001', title: 'お知らせ1' },
          { id: 'news-002', title: 'お知らせ2' },
        ],
        total: 2,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getNews()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getNews_WhenError_ShouldThrowError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      // Act & Assert
      await expect(getNews()).rejects.toThrow('ニュースの取得に失敗しました: 404')
    })
  })
})
