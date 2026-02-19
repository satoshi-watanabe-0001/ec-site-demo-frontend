/**
 * @fileoverview アカウント設定用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 */

import { http, HttpResponse } from 'msw'
import type {
  AccountInfo,
  ContactUpdateRequest,
  ContactUpdateResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  NotificationSettingsUpdateRequest,
  NotificationSettingsUpdateResponse,
} from '@/types'

const mockAccountInfo: AccountInfo = {
  userId: 'user-001',
  name: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  phoneNumber: '090-****-5678',
  postalCode: '100-0001',
  address: '東京都千代田区千代田1-1',
  dateOfBirth: '1990-01-15',
  registeredAt: '2025-09-15T00:00:00Z',
  notificationSettings: {
    email: true,
    sms: true,
    push: true,
    marketing: false,
  },
}

export const accountHandlers = [
  http.get('*/api/v1/mypage/account', () => {
    return HttpResponse.json(mockAccountInfo)
  }),

  http.patch('*/api/v1/mypage/account/contact', async ({ request }) => {
    const body = (await request.json()) as ContactUpdateRequest
    const updatedFields: string[] = []
    if (body.email) updatedFields.push('email')
    if (body.phoneNumber) updatedFields.push('phoneNumber')
    if (body.postalCode) updatedFields.push('postalCode')
    if (body.address) updatedFields.push('address')

    const response: ContactUpdateResponse = {
      success: true,
      message: '連絡先情報を更新しました',
      updatedFields,
    }
    return HttpResponse.json(response)
  }),

  http.post('*/api/v1/mypage/account/password', async ({ request }) => {
    const body = (await request.json()) as PasswordChangeRequest

    if (body.currentPassword !== 'password123') {
      return HttpResponse.json(
        { success: false, message: '現在のパスワードが正しくありません' },
        { status: 400 }
      )
    }

    if (body.newPassword !== body.confirmPassword) {
      return HttpResponse.json(
        { success: false, message: '新しいパスワードが一致しません' },
        { status: 400 }
      )
    }

    const response: PasswordChangeResponse = {
      success: true,
      message: 'パスワードを変更しました',
    }
    return HttpResponse.json(response)
  }),

  http.patch('*/api/v1/mypage/account/notifications', async ({ request }) => {
    const body = (await request.json()) as NotificationSettingsUpdateRequest

    const response: NotificationSettingsUpdateResponse = {
      success: true,
      message: '通知設定を更新しました',
      settings: {
        ...mockAccountInfo.notificationSettings,
        ...body,
      },
    }
    return HttpResponse.json(response)
  }),
]
