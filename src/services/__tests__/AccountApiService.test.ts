/**
 * @fileoverview アカウント設定APIサービスのユニットテスト
 * @module services/__tests__/AccountApiService.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import {
  getAccount,
  updateContact,
  changePassword,
  updateNotificationSettings,
} from '../AccountApiService'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('AccountApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAccount', () => {
    test('getAccount_WhenSuccess_ShouldReturnAccountData', async () => {
      const mockData = { account: { userId: 'U001', name: 'テストユーザー' } }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await getAccount()

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/mypage/account'))
    })

    test('getAccount_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      await expect(getAccount()).rejects.toThrow('アカウント情報の取得に失敗しました: 401')
    })
  })

  describe('updateContact', () => {
    test('updateContact_WhenSuccess_ShouldReturnSuccessResponse', async () => {
      const mockResponse = { success: true, message: '更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await updateContact({ email: 'new@test.com' })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/account/contact'),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'new@test.com' }),
        })
      )
    })

    test('updateContact_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400 })

      await expect(updateContact({ email: 'bad' })).rejects.toThrow(
        '連絡先の更新に失敗しました: 400'
      )
    })
  })

  describe('changePassword', () => {
    test('changePassword_WhenSuccess_ShouldReturnSuccessResponse', async () => {
      const mockResponse = { success: true, message: '変更しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await changePassword({
        currentPassword: 'old123',
        newPassword: 'new12345',
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/account/password'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    test('changePassword_WhenHttpError_ShouldThrowWithServerMessage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '現在のパスワードが不正です' }),
      })

      await expect(
        changePassword({ currentPassword: 'wrong', newPassword: 'new12345' })
      ).rejects.toThrow('現在のパスワードが不正です')
    })
  })

  describe('updateNotificationSettings', () => {
    test('updateNotificationSettings_WhenSuccess_ShouldReturnSuccessResponse', async () => {
      const mockResponse = { success: true, message: '更新しました' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await updateNotificationSettings({ emailNotifications: true })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/mypage/account/notifications'),
        expect.objectContaining({ method: 'PATCH' })
      )
    })

    test('updateNotificationSettings_WhenHttpError_ShouldThrowError', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(updateNotificationSettings({ emailNotifications: false })).rejects.toThrow(
        '通知設定の更新に失敗しました: 500'
      )
    })
  })
})
