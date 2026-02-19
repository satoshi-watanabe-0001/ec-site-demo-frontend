/**
 * @fileoverview アカウント設定APIサービス
 * @module services/AccountApiService
 *
 * アカウント情報の取得・更新、パスワード変更、通知設定の管理を行うAPIサービス。
 */

import type {
  AccountResponse,
  ContactUpdateRequest,
  PasswordChangeRequest,
  NotificationUpdateRequest,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getAccount(): Promise<AccountResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account`)
  if (!response.ok) {
    throw new Error(`アカウント情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function updateContact(
  data: ContactUpdateRequest
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/contact`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`連絡先の更新に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function changePassword(
  data: PasswordChangeRequest
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `パスワードの変更に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function updateNotificationSettings(
  data: NotificationUpdateRequest
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/notifications`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`通知設定の更新に失敗しました: ${response.status}`)
  }
  return response.json()
}
