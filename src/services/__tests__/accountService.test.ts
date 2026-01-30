/**
 * @fileoverview accountServiceのユニットテスト
 * @module services/__tests__/accountService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import type { AccountProfile, NotificationSettings } from '@/types'
import {
  getAccountProfile,
  updateAccountProfile,
  getNotificationSettings,
  updateNotificationSettings,
} from '@/services/accountService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
} as const

describe('accountService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAccountProfile', () => {
    test('getAccountProfile_WithValidResponse_ShouldReturnAccountProfile', async () => {
      // Arrange
      const mockResponse: AccountProfile = {
        userId: 'user-001',
        name: '山田 太郎',
        nameKana: 'ヤマダ タロウ',
        email: 'test@docomo.ne.jp',
        phoneNumber: '090-1234-5678',
        birthDate: '1990-01-15',
        postalCode: '100-0001',
        address: '東京都千代田区千代田1-1-1',
        registeredAt: '2023-04-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getAccountProfile()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getAccountProfile_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getAccountProfile()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })

    test('getAccountProfile_WithNetworkError_ShouldThrowNetworkErrorMessage', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

      // Act & Assert
      await expect(getAccountProfile()).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR)
    })
  })

  describe('updateAccountProfile', () => {
    test('updateAccountProfile_WithValidData_ShouldReturnUpdatedProfile', async () => {
      // Arrange
      const updateData: Partial<AccountProfile> = {
        phoneNumber: '090-9876-5432',
      }
      const mockResponse: AccountProfile = {
        userId: 'user-001',
        name: '山田 太郎',
        nameKana: 'ヤマダ タロウ',
        email: 'test@docomo.ne.jp',
        phoneNumber: '090-9876-5432',
        birthDate: '1990-01-15',
        postalCode: '100-0001',
        address: '東京都千代田区千代田1-1-1',
        registeredAt: '2023-04-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await updateAccountProfile(updateData)

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('updateAccountProfile_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const updateData: Partial<AccountProfile> = {
        phoneNumber: '090-9876-5432',
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(updateAccountProfile(updateData)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  describe('getNotificationSettings', () => {
    test('getNotificationSettings_WithValidResponse_ShouldReturnNotificationSettings', async () => {
      // Arrange
      const mockResponse: NotificationSettings = {
        email: {
          billing: true,
          campaign: true,
          service: true,
          maintenance: false,
        },
        push: {
          billing: true,
          campaign: false,
          dataUsage: true,
        },
        sms: {
          security: true,
          billing: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      // Act
      const result = await getNotificationSettings()

      // Assert
      expect(result).toEqual(mockResponse)
    })

    test('getNotificationSettings_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(getNotificationSettings()).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR)
    })
  })

  describe('updateNotificationSettings', () => {
    test('updateNotificationSettings_WithValidData_ShouldReturnUpdatedSettings', async () => {
      // Arrange
      const updateData: NotificationSettings = {
        email: {
          billing: true,
          campaign: false,
          service: true,
          maintenance: false,
        },
        push: {
          billing: true,
          campaign: false,
          dataUsage: true,
        },
        sms: {
          security: true,
          billing: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updateData),
      })

      // Act
      const result = await updateNotificationSettings(updateData)

      // Assert
      expect(result).toEqual(updateData)
    })

    test('updateNotificationSettings_WithServerError_ShouldThrowServerErrorMessage', async () => {
      // Arrange
      const updateData: NotificationSettings = {
        email: {
          billing: true,
          campaign: false,
          service: true,
          maintenance: false,
        },
        push: {
          billing: true,
          campaign: false,
          dataUsage: true,
        },
        sms: {
          security: true,
          billing: false,
        },
      }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      // Act & Assert
      await expect(updateNotificationSettings(updateData)).rejects.toThrow(
        ERROR_MESSAGES.SERVER_ERROR
      )
    })
  })
})
