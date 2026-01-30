/**
 * @fileoverview 通知管理 API クライアント
 * @module services/notificationService
 *
 * 通知情報、既読管理関連のAPIサービス。
 */

import type {
  NotificationsResponse,
  MarkNotificationReadRequest,
  MarkNotificationReadResponse,
  NotificationErrorResponse,
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
 * 通知一覧取得
 *
 * @returns 通知一覧
 * @throws エラー時にエラーをスロー
 */
export async function getNotifications(): Promise<NotificationsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: NotificationErrorResponse = await response.json()
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
 * 通知既読
 *
 * @param request - 通知既読リクエスト（notificationIdを省略すると全件既読）
 * @returns 通知既読レスポンス
 * @throws エラー時にエラーをスロー
 */
export async function markNotificationRead(
  request: MarkNotificationReadRequest = {}
): Promise<MarkNotificationReadResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: NotificationErrorResponse = await response.json()
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
