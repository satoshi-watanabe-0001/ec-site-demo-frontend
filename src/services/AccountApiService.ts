/**
 * @fileoverview アカウント設定 API クライアント
 * @module services/AccountApiService
 */

import type {
  AccountInfo,
  ContactUpdateRequest,
  ContactUpdateResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  NotificationSettingsUpdateRequest,
  NotificationSettingsUpdateResponse,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getAccountInfo(): Promise<AccountInfo> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account`)
  if (!response.ok) {
    throw new Error(`アカウント情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function updateContact(request: ContactUpdateRequest): Promise<ContactUpdateResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/contact`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(`連絡先の更新に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function changePassword(request: PasswordChangeRequest): Promise<PasswordChangeResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(`パスワードの変更に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function updateNotificationSettings(
  request: NotificationSettingsUpdateRequest
): Promise<NotificationSettingsUpdateResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/account/notifications`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(`通知設定の更新に失敗しました: ${response.status}`)
  }
  return response.json()
}
