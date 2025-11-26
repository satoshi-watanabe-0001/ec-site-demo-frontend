/**
 * @fileoverview Marketing Service API クライアント
 * @module services/marketingService
 *
 * キャンペーンとニュース情報を取得するためのAPIサービス。
 * Marketing Service（port 8090）と通信。
 * 現在はMSWでモック対応。
 */

import { config } from '@/lib/env'
import type { CampaignsResponse, NewsResponse, CampaignCategory, NewsCategory } from '@/types'

/**
 * Marketing Service APIのベースURL
 */
const MARKETING_SERVICE_BASE_URL = config.api.baseURL

/**
 * キャンペーン一覧を取得
 *
 * @param params - 取得パラメータ
 * @returns キャンペーンレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getCampaigns(params?: {
  limit?: number
  category?: CampaignCategory
}): Promise<CampaignsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.category) searchParams.set('category', params.category)

  const response = await fetch(
    `${MARKETING_SERVICE_BASE_URL}/api/v1/campaigns?${searchParams.toString()}`
  )

  if (!response.ok) {
    throw new Error(`キャンペーンの取得に失敗しました: ${response.status}`)
  }

  return response.json()
}

/**
 * ニュース一覧を取得
 *
 * @param params - 取得パラメータ
 * @returns ニュースレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getNews(params?: {
  limit?: number
  category?: NewsCategory
}): Promise<NewsResponse> {
  const searchParams = new URLSearchParams()
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.category) searchParams.set('category', params.category)

  const response = await fetch(
    `${MARKETING_SERVICE_BASE_URL}/api/v1/news?${searchParams.toString()}`
  )

  if (!response.ok) {
    throw new Error(`ニュースの取得に失敗しました: ${response.status}`)
  }

  return response.json()
}
