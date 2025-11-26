/**
 * @fileoverview 人気端末取得カスタムフック
 * @module hooks/usePopularDevices
 *
 * TanStack Queryを使用して人気端末データを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getPopularDevices } from '@/services/productService'
import type { PopularDevicesResponse } from '@/types'

/**
 * 人気端末取得フックのオプション
 */
interface UsePopularDevicesOptions {
  /** 取得件数（デフォルト: 6） */
  limit?: number
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * 人気端末データを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function usePopularDevices(options: UsePopularDevicesOptions = {}) {
  const { limit = 6, enabled = true } = options

  return useQuery<PopularDevicesResponse, Error>({
    queryKey: ['popularDevices', limit],
    queryFn: () => getPopularDevices(limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
