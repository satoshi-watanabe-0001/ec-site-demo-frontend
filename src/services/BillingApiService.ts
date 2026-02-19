/**
 * @fileoverview 請求情報 API クライアント
 * @module services/BillingApiService
 */

import type { BillingDetail, BillingHistoryResponse } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getBillingDetail(): Promise<BillingDetail> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/billing`)
  if (!response.ok) {
    throw new Error(`請求情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getBillingHistory(): Promise<BillingHistoryResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/billing/history`)
  if (!response.ok) {
    throw new Error(`請求履歴の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}
