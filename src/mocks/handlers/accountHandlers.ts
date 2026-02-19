/**
 * @fileoverview アカウント設定関連MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * アカウント情報、連絡先更新、パスワード変更、通知設定のモックAPI。
 */

import { http, HttpResponse } from 'msw'
import type {
  AccountResponse,
  ContactUpdateRequest,
  PasswordChangeRequest,
  NotificationUpdateRequest,
} from '@/types'

const mockAccount: AccountResponse = {
  account: {
    userId: 'user-001',
    name: 'テストユーザー',
    email: 'test@docomo.ne.jp',
    contact: {
      email: 'test@docomo.ne.jp',
      phoneNumber: '090-1234-5678',
      postalCode: '100-0001',
      address: '東京都千代田区千代田1-1',
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      promotionalEmails: false,
      usageAlerts: true,
      billingAlerts: true,
    },
    createdAt: '2025-09-15T10:00:00Z',
    lastLoginAt: '2026-02-19T08:30:00Z',
  },
}

export const accountHandlers = [
  http.get('*/api/v1/mypage/account', () => {
    return HttpResponse.json(mockAccount)
  }),

  http.patch('*/api/v1/mypage/account/contact', async ({ request }) => {
    const body = (await request.json()) as ContactUpdateRequest
    const updatedAccount = {
      ...mockAccount,
      account: {
        ...mockAccount.account,
        contact: {
          ...mockAccount.account.contact,
          ...body,
        },
      },
    }
    return HttpResponse.json({
      success: true,
      message: '連絡先情報を更新しました',
      account: updatedAccount.account,
    })
  }),

  http.post('*/api/v1/mypage/account/password', async ({ request }) => {
    const body = (await request.json()) as PasswordChangeRequest
    if (body.currentPassword !== 'password123') {
      return HttpResponse.json(
        { success: false, message: '現在のパスワードが正しくありません' },
        { status: 400 }
      )
    }
    return HttpResponse.json({
      success: true,
      message: 'パスワードを変更しました',
    })
  }),

  http.patch('*/api/v1/mypage/account/notifications', async ({ request }) => {
    const body = (await request.json()) as NotificationUpdateRequest
    const updatedSettings = {
      ...mockAccount.account.notificationSettings,
      ...body,
    }
    return HttpResponse.json({
      success: true,
      message: '通知設定を更新しました',
      notificationSettings: updatedSettings,
    })
  }),
]
