/**
 * @fileoverview Product Service API クライアント
 * @module services/productService
 *
 * 端末情報を取得するためのAPIサービス。
 * Product Service（port 8082）と通信。
 */

import { config } from '@/lib/env'
import type { PopularDevicesResponse } from '@/types'

/**
 * Product Service APIのベースURL
 */
const PRODUCT_SERVICE_BASE_URL = config.api.baseURL

/**
 * 人気端末一覧を取得
 *
 * @param limit - 取得件数（デフォルト: 6）
 * @returns 人気端末レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getPopularDevices(limit: number = 6): Promise<PopularDevicesResponse> {
  const response = await fetch(`${PRODUCT_SERVICE_BASE_URL}/api/v1/products/popular?limit=${limit}`)

  if (!response.ok) {
    throw new Error(`人気端末の取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * 端末検索（既存のProduct Service APIと互換）
 *
 * @param params - 検索パラメータ
 * @returns 端末検索レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function searchDevices(params: {
  limit?: number
  offset?: number
  category?: string
}): Promise<PopularDevicesResponse> {
  const searchParams = new URLSearchParams()
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  if (params.category) searchParams.set('category', params.category)

  const response = await fetch(
    `${PRODUCT_SERVICE_BASE_URL}/api/v1/inventory/search?${searchParams.toString()}`
  )

  if (!response.ok) {
    throw new Error(`端末検索に失敗しました: ${response.status}`)
  }

  return response.json()
}
