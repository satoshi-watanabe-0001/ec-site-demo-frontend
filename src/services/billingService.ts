/**
 * @fileoverview Billing Service API クライアント
 * @module services/billingService
 *
 * 請求・支払い関連のAPIサービス。
 * 請求情報、支払い方法の管理。
 */

import type {
  CurrentBilling,
  BillingHistoryResponse,
  PaymentMethod,
  UpdatePaymentMethodRequest,
} from '@/types/billing'
import type { ApiSuccessResponse } from '@/types/account'

/**
 * Billing Service APIのベースURL
 */
const BILLING_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
 * 現在の請求情報取得
 */
export async function getCurrentBilling(): Promise<CurrentBilling> {
  return fetchWithErrorHandling<CurrentBilling>(
    `${BILLING_SERVICE_BASE_URL}/api/v1/account/billing/current`
  )
}

/**
 * 請求履歴取得
 */
export async function getBillingHistory(): Promise<BillingHistoryResponse> {
  return fetchWithErrorHandling<BillingHistoryResponse>(
    `${BILLING_SERVICE_BASE_URL}/api/v1/account/billing/history`
  )
}

/**
 * 支払い方法取得
 */
export async function getPaymentMethod(): Promise<PaymentMethod> {
  return fetchWithErrorHandling<PaymentMethod>(
    `${BILLING_SERVICE_BASE_URL}/api/v1/account/payment-method`
  )
}

/**
 * 支払い方法更新
 */
export async function updatePaymentMethod(
  request: UpdatePaymentMethodRequest
): Promise<ApiSuccessResponse> {
  return fetchWithErrorHandling<ApiSuccessResponse>(
    `${BILLING_SERVICE_BASE_URL}/api/v1/account/payment-method`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}
