/**
 * @fileoverview アカウント管理 API クライアント
 * @module services/accountService
 *
 * アカウント情報、プロファイル、通知設定関連のAPIサービス。
 */

import type {
  AccountProfile,
  UpdateAccountProfileRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  NotificationSettings,
  AccountErrorResponse,
} from '@/types'

/**
 * APIのベースURL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
 * アカウントプロファイル取得
 *
 * @returns アカウントプロファイル情報
 * @throws エラー時にエラーをスロー
 */
export async function getAccountProfile(): Promise<AccountProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: AccountErrorResponse = await response.json()
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
 * アカウントプロファイル更新
 *
 * @param request - 更新するプロファイル情報
 * @returns 更新後のアカウントプロファイル
 * @throws エラー時にエラーをスロー
 */
export async function updateAccountProfile(
  request: UpdateAccountProfileRequest
): Promise<AccountProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: AccountErrorResponse = await response.json()
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
 * パスワード変更
 *
 * @param request - パスワード変更リクエスト
 * @returns パスワード変更レスポンス
 * @throws エラー時にエラーをスロー
 */
export async function changePassword(
  request: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: AccountErrorResponse = await response.json()
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
 * 通知設定取得
 *
 * @returns 通知設定
 * @throws エラー時にエラーをスロー
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/notification-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: AccountErrorResponse = await response.json()
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
 * 通知設定更新
 *
 * @param settings - 更新する通知設定
 * @returns 更新後の通知設定
 * @throws エラー時にエラーをスロー
 */
export async function updateNotificationSettings(
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/account/notification-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: AccountErrorResponse = await response.json()
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
