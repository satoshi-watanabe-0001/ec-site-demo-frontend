/**
 * @fileoverview アカウント管理用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * アカウント情報、プロファイル、通知設定のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  AccountProfile,
  UpdateAccountProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  NotificationSettings,
  AccountErrorResponse,
} from '@/types'

/**
 * モック用アカウントプロファイル
 */
const mockAccountProfile: AccountProfile = {
  userId: 'user-001',
  name: '山田 太郎',
  nameKana: 'ヤマダ タロウ',
  email: 'test@docomo.ne.jp',
  phoneNumber: '090-1234-5678',
  birthDate: '1990-01-15',
  postalCode: '100-0001',
  address: '東京都千代田区千代田1-1-1',
  registeredAt: '2023-04-01T00:00:00Z',
  updatedAt: '2024-12-01T10:30:00Z',
}

/**
 * モック用通知設定
 */
const mockNotificationSettings: NotificationSettings = {
  email: {
    billing: true,
    campaign: true,
    service: true,
    maintenance: false,
  },
  push: {
    billing: true,
    campaign: true,
    dataUsage: true,
  },
  sms: {
    security: true,
    billing: false,
  },
}

/**
 * アカウント管理用MSWハンドラー
 */
export const accountHandlers = [
  // アカウントプロファイル取得
  http.get('*/api/v1/account/profile', () => {
    return HttpResponse.json(mockAccountProfile)
  }),

  // アカウントプロファイル更新
  http.put('*/api/v1/account/profile', async ({ request }) => {
    const body = (await request.json()) as UpdateAccountProfileRequest

    const updatedProfile: AccountProfile = {
      ...mockAccountProfile,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(updatedProfile)
  }),

  // パスワード変更
  http.put('*/api/v1/account/password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordRequest

    // 現在のパスワードが正しくない場合
    if (body.currentPassword !== 'password123') {
      const errorResponse: AccountErrorResponse = {
        status: 'error',
        message: '現在のパスワードが正しくありません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    // 新しいパスワードと確認用パスワードが一致しない場合
    if (body.newPassword !== body.confirmPassword) {
      const errorResponse: AccountErrorResponse = {
        status: 'error',
        message: '新しいパスワードと確認用パスワードが一致しません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const response: ChangePasswordResponse = {
      success: true,
      message: 'パスワードを変更しました',
    }

    return HttpResponse.json(response)
  }),

  // 通知設定取得
  http.get('*/api/v1/account/notification-settings', () => {
    return HttpResponse.json(mockNotificationSettings)
  }),

  // 通知設定更新
  http.put('*/api/v1/account/notification-settings', async ({ request }) => {
    const body = (await request.json()) as Partial<NotificationSettings>

    const updatedSettings: NotificationSettings = {
      ...mockNotificationSettings,
      ...body,
    }

    return HttpResponse.json(updatedSettings)
  }),
]
