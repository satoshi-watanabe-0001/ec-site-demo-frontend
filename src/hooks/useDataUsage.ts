/**
 * @fileoverview データ使用量取得カスタムフック
 * @module hooks/useDataUsage
 *
 * TanStack Queryを使用してデータ使用量を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getDataUsage } from '@/services/mypageService'
import type { DataUsage } from '@/types'

/**
 * データ使用量を取得するカスタムフック
 *
 * @param enabled - 自動取得フラグ
 * @returns TanStack Queryの結果オブジェクト
 */
export function useDataUsage(enabled: boolean = true) {
  return useQuery<DataUsage, Error>({
    queryKey: ['mypage', 'data-usage'],
    queryFn: getDataUsage,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
