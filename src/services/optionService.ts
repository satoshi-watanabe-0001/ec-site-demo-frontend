/**
 * @fileoverview オプションサービス管理 API クライアント
 * @module services/optionService
 *
 * オプションサービス情報、契約・解約関連のAPIサービス。
 */

import type {
  OptionsResponse,
  SubscribeOptionRequest,
  SubscribeOptionResponse,
  UnsubscribeOptionRequest,
  UnsubscribeOptionResponse,
  OptionErrorResponse,
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
 * オプション一覧取得
 *
 * @returns オプション一覧
 * @throws エラー時にエラーをスロー
 */
export async function getOptions(): Promise<OptionsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/options`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: OptionErrorResponse = await response.json()
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
 * オプション契約
 *
 * @param request - オプション契約リクエスト
 * @returns オプション契約レスポンス
 * @throws エラー時にエラーをスロー
 */
export async function subscribeOption(
  request: SubscribeOptionRequest
): Promise<SubscribeOptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/options/${request.optionId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: OptionErrorResponse = await response.json()
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
 * オプション解約
 *
 * @param request - オプション解約リクエスト
 * @returns オプション解約レスポンス
 * @throws エラー時にエラーをスロー
 */
export async function unsubscribeOption(
  request: UnsubscribeOptionRequest
): Promise<UnsubscribeOptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/options/${request.optionId}/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: OptionErrorResponse = await response.json()
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
