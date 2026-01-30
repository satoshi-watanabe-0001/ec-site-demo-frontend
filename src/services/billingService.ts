/**
 * @fileoverview 請求情報 API クライアント
 * @module services/billingService
 *
 * 請求情報、支払い方法、請求履歴関連のAPIサービス。
 */

import type {
  CurrentBilling,
  BillingHistoryResponse,
  PaymentMethod,
  UpdatePaymentMethodRequest,
  BillingErrorResponse,
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
 * 現在月の請求情報取得
 *
 * @returns 現在月の請求情報
 * @throws エラー時にエラーをスロー
 */
export async function getCurrentBilling(): Promise<CurrentBilling> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/billing/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: BillingErrorResponse = await response.json()
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
 * 請求履歴取得
 *
 * @param page - ページ番号（デフォルト: 1）
 * @param pageSize - ページサイズ（デフォルト: 10）
 * @returns 請求履歴
 * @throws エラー時にエラーをスロー
 */
export async function getBillingHistory(
  page: number = 1,
  pageSize: number = 10
): Promise<BillingHistoryResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/billing/history`)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('pageSize', pageSize.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: BillingErrorResponse = await response.json()
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
 * 支払い方法取得
 *
 * @returns 支払い方法
 * @throws エラー時にエラーをスロー
 */
export async function getPaymentMethod(): Promise<PaymentMethod> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/billing/payment-method`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: BillingErrorResponse = await response.json()
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
 * 支払い方法更新
 *
 * @param request - 更新する支払い方法情報
 * @returns 更新後の支払い方法
 * @throws エラー時にエラーをスロー
 */
export async function updatePaymentMethod(
  request: UpdatePaymentMethodRequest
): Promise<PaymentMethod> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/billing/payment-method`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let message: string = ERROR_MESSAGES.SERVER_ERROR
      try {
        const errorData: BillingErrorResponse = await response.json()
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
