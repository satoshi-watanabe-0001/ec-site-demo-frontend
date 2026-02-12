/**
 * @fileoverview 請求情報APIクライアント
 * @module services/billingService
 *
 * 請求情報関連のAPIサービス。
 * 請求情報取得、支払い方法管理を提供。
 */

import type { BillingInfo, BillingHistory, PaymentMethod } from '@/types/billing'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 請求情報レスポンス
 */
export interface BillingResponse {
  /** 今月の請求情報 */
  current: BillingInfo
  /** 請求履歴 */
  history: BillingHistory[]
  /** 支払い方法 */
  paymentMethod: PaymentMethod
}

/**
 * 請求情報を取得
 *
 * @param token - 認証トークン
 * @returns 請求情報
 */
export async function getBillingInfo(token: string): Promise<BillingResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/billing`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('請求情報の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('請求情報取得エラー:', error)
    throw error
  }
}
