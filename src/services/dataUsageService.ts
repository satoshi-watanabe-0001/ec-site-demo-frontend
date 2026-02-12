/**
 * @fileoverview データ使用量APIクライアント
 * @module services/dataUsageService
 *
 * データ使用量関連のAPIサービス。
 * データ使用量取得、使用履歴取得を提供。
 */

import type { DataUsage, DataUsageHistory, DataCharge } from '@/types/data-usage'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * データ使用量レスポンス
 */
export interface DataUsageResponse {
  /** 今月のデータ使用状況 */
  current: DataUsage
  /** 使用量履歴 */
  history: DataUsageHistory
  /** チャージ履歴 */
  charges: DataCharge[]
}

/**
 * データ使用量を取得
 *
 * @param token - 認証トークン
 * @returns データ使用量情報
 */
export async function getDataUsage(token: string): Promise<DataUsageResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/data-usage`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('データ使用量の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('データ使用量取得エラー:', error)
    throw error
  }
}
