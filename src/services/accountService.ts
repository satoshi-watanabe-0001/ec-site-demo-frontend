/**
 * @fileoverview Account Service API クライアント
 * @module services/accountService
 *
 * アカウント・契約・データ通信量・請求・端末・通知情報を取得するためのAPIサービス。
 * 現在はMSWでモック対応。
 */

import { config } from '@/lib/env'
import type {
  AccountInfoResponse,
  DataUsageResponse,
  BillingResponse,
  DeviceInfoResponse,
  NotificationsResponse,
  OptionsResponse,
  SuccessResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateNotificationSettingsRequest,
  ChangePlanRequest,
  UpdatePaymentMethodRequest,
} from '@/types'

/**
 * Account Service APIのベースURL
 */
const ACCOUNT_SERVICE_BASE_URL = config.api.baseURL

/**
 * アカウント・契約情報を取得
 *
 * @returns アカウント情報レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getAccountInfo(): Promise<AccountInfoResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/me`)

  if (!response.ok) {
    throw new Error(`アカウント情報の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * データ通信量を取得
 *
 * @returns データ通信量レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getDataUsage(): Promise<DataUsageResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/data-usage`)

  if (!response.ok) {
    throw new Error(`データ通信量の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 請求情報を取得
 *
 * @returns 請求情報レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getBilling(): Promise<BillingResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/billing`)

  if (!response.ok) {
    throw new Error(`請求情報の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 端末情報を取得
 *
 * @returns 端末情報レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getDeviceInfo(): Promise<DeviceInfoResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/device`)

  if (!response.ok) {
    throw new Error(`端末情報の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 通知一覧を取得
 *
 * @returns 通知レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notifications`)

  if (!response.ok) {
    throw new Error(`通知の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * オプションサービス一覧を取得
 *
 * @returns オプションサービスレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getOptions(): Promise<OptionsResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options`)

  if (!response.ok) {
    throw new Error(`オプション情報の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * プロフィールを更新
 *
 * @param data - プロフィール更新データ
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<SuccessResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`プロフィールの更新に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * パスワードを変更
 *
 * @param data - パスワード変更データ
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function changePassword(data: ChangePasswordRequest): Promise<SuccessResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`パスワードの変更に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 通知設定を更新
 *
 * @param data - 通知設定更新データ
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function updateNotificationSettings(
  data: UpdateNotificationSettingsRequest
): Promise<SuccessResponse> {
  const response = await fetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notification-settings`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error(`通知設定の更新に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * プランを変更
 *
 * @param data - プラン変更データ
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function changePlan(data: ChangePlanRequest): Promise<SuccessResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/plan`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`プラン変更に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * オプションサービスを追加
 *
 * @param optionId - オプションID
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function subscribeOption(optionId: string): Promise<SuccessResponse> {
  const response = await fetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  if (!response.ok) {
    throw new Error(`オプションの追加に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * オプションサービスを解除
 *
 * @param optionId - オプションID
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function unsubscribeOption(optionId: string): Promise<SuccessResponse> {
  const response = await fetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error(`オプションの解除に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 支払い方法を更新
 *
 * @param data - 支払い方法更新データ
 * @returns 成功レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function updatePaymentMethod(
  data: UpdatePaymentMethodRequest
): Promise<SuccessResponse> {
  const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/payment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`支払い方法の更新に失敗しました: ${response.status}`)
  }

  return response.json()
}
