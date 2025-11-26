/**
 * @fileoverview ニュース取得カスタムフック
 * @module hooks/useNews
 *
 * TanStack Queryを使用してニュースデータを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getNews } from '@/services/marketingService'
import type { NewsResponse, NewsCategory } from '@/types'

/**
 * ニュース取得フックのオプション
 */
interface UseNewsOptions {
  /** 取得件数（デフォルト: 5） */
  limit?: number
  /** カテゴリフィルター */
  category?: NewsCategory
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * ニュースデータを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useNews(options: UseNewsOptions = {}) {
  const { limit = 5, category, enabled = true } = options

  return useQuery<NewsResponse, Error>({
    queryKey: ['news', limit, category],
    queryFn: () => getNews({ limit, category }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
