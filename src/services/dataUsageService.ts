/**
 * @fileoverview データ使用量 API クライアント
 * @module services/dataUsageService
 *
 * データ使用量、使用履歴関連のAPIサービス。
 */

import type {
  CurrentDataUsage,
  DataUsageHistoryResponse,
  DataAddOnOption,
  PurchaseDataAddOnRequest,
  PurchaseDataAddOnResponse,
  DataUsageErrorResponse,
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
 * 現在のデータ使用量取得
 *
 * @returns 現在のデータ使用量
 * @throws エラー時にエラーをスロー
 */
export async function getCurrentDataUsage(): Promise<CurrentDataUsage> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/data-usage/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: DataUsageErrorResponse = await response.json()
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
 * データ使用量履歴取得
 *
 * @returns データ使用量履歴
 * @throws エラー時にエラーをスロー
 */
export async function getDataUsageHistory(): Promise<DataUsageHistoryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/data-usage/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: DataUsageErrorResponse = await response.json()
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
 * データ追加購入オプション取得
 *
 * @returns データ追加購入オプション一覧
 * @throws エラー時にエラーをスロー
 */
export async function getDataAddOnOptions(): Promise<DataAddOnOption[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/data-usage/add-on-options`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: DataUsageErrorResponse = await response.json()
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
 * データ追加購入
 *
 * @param request - データ追加購入リクエスト
 * @returns データ追加購入レスポンス
 * @throws エラー時にエラーをスロー
 */
export async function purchaseDataAddOn(
  request: PurchaseDataAddOnRequest
): Promise<PurchaseDataAddOnResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/data-usage/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: DataUsageErrorResponse = await response.json()
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
