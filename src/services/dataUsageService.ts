/**
 * @fileoverview Data Usage Service API クライアント
 * @module services/dataUsageService
 *
 * データ使用量関連のAPIサービス。
 * 使用量データ、チャージ履歴の取得。
 */

import type {
  DataUsage,
  DataUsageHistoryResponse,
  DataChargeHistoryResponse,
} from '@/types/data-usage'

/**
 * Data Usage Service APIのベースURL
 */
const DATA_USAGE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
 * 当月データ使用量取得
 */
export async function getDataUsage(): Promise<DataUsage> {
  return fetchWithErrorHandling<DataUsage>(
    `${DATA_USAGE_SERVICE_BASE_URL}/api/v1/account/data-usage`
  )
}

/**
 * データ使用量履歴取得
 */
export async function getDataUsageHistory(): Promise<DataUsageHistoryResponse> {
  return fetchWithErrorHandling<DataUsageHistoryResponse>(
    `${DATA_USAGE_SERVICE_BASE_URL}/api/v1/account/data-usage/history`
  )
}

/**
 * データチャージ履歴取得
 */
export async function getDataChargeHistory(): Promise<DataChargeHistoryResponse> {
  return fetchWithErrorHandling<DataChargeHistoryResponse>(
    `${DATA_USAGE_SERVICE_BASE_URL}/api/v1/account/data-charge/history`
  )
}
