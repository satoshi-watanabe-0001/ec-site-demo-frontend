/**
 * @fileoverview AccountApiServiceのユニットテスト
 * @module services/__tests__/AccountApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getAccountInfo,
  updateContact,
  changePassword,
  updateNotificationSettings,
} from '@/services/AccountApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('AccountApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAccountInfo', () => {
    test('getAccountInfo_WithSuccessfulResponse_ShouldReturnAccountData', async () => {
      const mockData = { email: 'test@docomo.ne.jp', name: 'テストユーザー' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getAccountInfo()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/mypage/account')
    })

    test('getAccountInfo_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      await expect(getAccountInfo()).rejects.toThrow('アカウント情報の取得に失敗しました: 401')
    })
  })

  describe('updateContact', () => {
    test('updateContact_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      const request = { email: 'new@docomo.ne.jp', phoneNumber: '090-1234-5678' }
      const mockResponse = { success: true, message: '連絡先を更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await updateContact(request)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/account/contact',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      )
    })

    test('updateContact_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      await expect(
        updateContact({ email: 'invalid', phoneNumber: '090-1234-5678' })
      ).rejects.toThrow('連絡先の更新に失敗しました: 400')
    })
  })

  describe('changePassword', () => {
    test('changePassword_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      const request = {
        currentPassword: 'old123',
        newPassword: 'new456',
        confirmPassword: 'new456',
      }
      const mockResponse = { success: true, message: 'パスワードを変更しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await changePassword(request)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/account/password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      )
    })

    test('changePassword_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      await expect(
        changePassword({
          currentPassword: 'wrong',
          newPassword: 'new456',
          confirmPassword: 'new456',
        })
      ).rejects.toThrow('パスワードの変更に失敗しました: 400')
    })
  })

  describe('updateNotificationSettings', () => {
    test('updateNotificationSettings_WithValidRequest_ShouldReturnSuccessResponse', async () => {
      const request = { email: true, sms: false }
      const mockResponse = { success: true, message: '通知設定を更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await updateNotificationSettings(request)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/mypage/account/notifications',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      )
    })

    test('updateNotificationSettings_WithErrorResponse_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(updateNotificationSettings({ email: true, sms: false })).rejects.toThrow(
        '通知設定の更新に失敗しました: 500'
      )
    })
  })
})
