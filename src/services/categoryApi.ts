/**
 * @fileoverview カテゴリ製品API クライアント
 * @module services/categoryApi
 *
 * カテゴリ別製品情報を取得するためのAPIサービス。
 * Product Service（port 8082）と通信。
 */

import { config } from '@/lib/env'
import type { CategoryDetailResponse } from '@/types'

/**
 * Product Service APIのベースURL
 */
const PRODUCT_SERVICE_BASE_URL = config.api.baseURL

/**
 * カテゴリ製品取得パラメータ
 */
interface GetCategoryProductsParams {
  /** 検索キーワード（オプション） */
  keyword?: string
  /** ページ番号（オプション） */
  page?: number
  /** ページサイズ（オプション） */
  size?: number
  /** ソートフィールド（オプション） */
  sort?: string
  /** ソート順序（オプション） */
  order?: 'asc' | 'desc'
}

/**
 * カテゴリ別製品一覧を取得
 *
 * バックエンドAPIからカテゴリに属する製品一覧を取得する。
 * エラー発生時は空のレスポンスを返す（UIクラッシュ防止のため）。
 *
 * @param categoryCode - カテゴリコード（例: 'iphone', 'android'）
 * @param params - 検索パラメータ（オプション）
 * @returns カテゴリ詳細レスポンス
 */
export async function getCategoryProducts(
  categoryCode: string,
  params?: GetCategoryProductsParams
): Promise<CategoryDetailResponse> {
  const searchParams = new URLSearchParams()

  // クエリパラメータの設定
  if (params?.keyword) searchParams.set('keyword', params.keyword)
  if (params?.page !== undefined) searchParams.set('page', params.page.toString())
  if (params?.size !== undefined) searchParams.set('size', params.size.toString())
  if (params?.sort) searchParams.set('sort', params.sort)
  if (params?.order) searchParams.set('order', params.order)

  const queryString = searchParams.toString()
  const url = `${PRODUCT_SERVICE_BASE_URL}/api/v1/products/categories/${categoryCode}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      // キャッシュを無効化してリアルタイムの在庫情報を取得
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`カテゴリ製品の取得に失敗しました: ${response.status}`)
    }

    const data: CategoryDetailResponse = await response.json()
    return data
  } catch (error) {
    // エラー発生時は空のレスポンスを返す（UIクラッシュ防止）
    console.error(`カテゴリ製品の取得でエラーが発生しました: ${categoryCode}`, error)
    return {
      categoryCode,
      categoryName: '',
      products: [],
      totalCount: 0,
    }
  }
}
