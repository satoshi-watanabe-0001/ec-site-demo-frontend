/**
 * @fileoverview Account Service API クライアント
 * @module services/accountService
 *
 * アカウント管理関連のAPIサービス。
 * プロフィール、契約、設定、プラン、オプション管理。
 */

import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  NotificationSettings,
  NotificationsResponse,
  ApiSuccessResponse,
} from '@/types/account'
import type {
  ContractDetail,
  AvailableOptionsResponse,
  AvailablePlansResponse,
  ChangePlanRequest,
  DevicesResponse,
} from '@/types/contract'

/**
 * Account Service APIのベースURL
 */
const ACCOUNT_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

/**
 * ネットワークエラーかどうかを判定
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('cors') ||
      message.includes('timeout')
    )
  }
  return false
}

/**
 * 共通のfetchラッパー
 */
async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData = await response.json()
        if (errorData?.message) {
          message = errorData.message
        }
      } catch {
        // JSONパースエラーの場合はデフォルトメッセージを使用
      }
      throw new Error(message)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error && !isNetworkError(error)) {
      throw error
    }
    if (isNetworkError(error)) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * ユーザープロフィール取得
 */
export async function getProfile(): Promise<UserProfile> {
  return fetchWithErrorHandling<UserProfile>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/profile`
  )
}

/**
 * ユーザープロフィール更新
 */
export async function updateProfile(request: UpdateProfileRequest): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/profile`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}

/**
 * パスワード変更
 */
export async function changePassword(request: ChangePasswordRequest): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/password`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}

/**
 * 契約詳細取得
 */
export async function getContract(): Promise<ContractDetail> {
  return fetchWithErrorHandling<ContractDetail>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/contract`
  )
}

/**
 * 現在のプラン取得
 */
export async function getCurrentPlan(): Promise<AvailablePlansResponse> {
  return fetchWithErrorHandling<AvailablePlansResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/plan`
  )
}

/**
 * プラン変更
 */
export async function changePlan(request: ChangePlanRequest): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/plan`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}

/**
 * オプション一覧取得
 */
export async function getOptions(): Promise<AvailableOptionsResponse> {
  return fetchWithErrorHandling<AvailableOptionsResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options`
  )
}

/**
 * オプション追加
 */
export async function addOption(optionId: string): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
    {
      method: 'POST',
    }
  )
}

/**
 * オプション解除
 */
export async function removeOption(optionId: string): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
    {
      method: 'DELETE',
    }
  )
}

/**
 * 通知一覧取得
 */
export async function getNotifications(): Promise<NotificationsResponse> {
  return fetchWithErrorHandling<NotificationsResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notifications`
  )
}

/**
 * 通知設定更新
 */
export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notification-settings`,
    {
      method: 'PUT',
      body: JSON.stringify(settings),
    }
  )
}

/**
 * 端末情報取得
 */
export async function getDevices(): Promise<DevicesResponse> {
  return fetchWithErrorHandling<DevicesResponse>(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/devices`
  )
}
