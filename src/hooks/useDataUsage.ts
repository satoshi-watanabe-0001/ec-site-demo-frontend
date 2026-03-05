/**
 * @fileoverview データ使用量取得カスタムフック
 * @module hooks/useDataUsage
 *
 * TanStack Queryを使用してデータ使用量を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getDataUsage } from '@/services/accountService'
import type { DataUsageResponse } from '@/types'

/**
 * データ使用量取得フックのオプション
 */
interface UseDataUsageOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * データ使用量を取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useDataUsage(options: UseDataUsageOptions = {}) {
  const { enabled = true } = options

  return useQuery<DataUsageResponse, Error>({
    queryKey: ['dataUsage'],
    queryFn: getDataUsage,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
