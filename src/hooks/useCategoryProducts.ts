/**
 * @fileoverview カテゴリ製品取得カスタムフック
 * @module hooks/useCategoryProducts
 *
 * TanStack Queryを使用してカテゴリ別製品データを取得するカスタムフック。
 * 5分間のキャッシュ戦略を採用（他のフックと統一）。
 */

import { useQuery } from '@tanstack/react-query'
import { getCategoryProducts } from '@/services/categoryApi'
import type { CategoryDetailResponse } from '@/types'

/**
 * カテゴリ製品取得フックのオプション
 */
interface UseCategoryProductsOptions {
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
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * カテゴリ別製品データを取得するカスタムフック
 *
 * TanStack Queryを使用してデータ取得・キャッシュ・エラーハンドリングを行う。
 * 5分間のstaleTimeを設定し、不要なAPI呼び出しを削減。
 *
 * @param categoryCode - カテゴリコード（例: 'iphone', 'android'）
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useCategoryProducts(
  categoryCode: string,
  options: UseCategoryProductsOptions = {}
) {
  const { keyword, page, size, sort, order, enabled = true } = options

  return useQuery<CategoryDetailResponse, Error>({
    queryKey: ['categoryProducts', categoryCode, { keyword, page, size, sort, order }],
    queryFn: () =>
      getCategoryProducts(categoryCode, {
        keyword,
        page,
        size,
        sort,
        order,
      }),
    enabled: enabled && !!categoryCode,
    // 5分間キャッシュ（他のフックと統一）
    staleTime: 5 * 60 * 1000,
  })
}
