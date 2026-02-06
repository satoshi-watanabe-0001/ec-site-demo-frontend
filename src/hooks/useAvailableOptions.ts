/**
 * @fileoverview 利用可能オプション取得カスタムフック
 * @module hooks/useAvailableOptions
 *
 * TanStack Queryを使用して利用可能オプション一覧を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getAvailableOptions } from '@/services/mypageService'
import type { AvailableOption } from '@/types'

/**
 * 利用可能オプション一覧を取得するカスタムフック
 *
 * @param enabled - 自動取得フラグ
 * @returns TanStack Queryの結果オブジェクト
 */
export function useAvailableOptions(enabled: boolean = true) {
  return useQuery<AvailableOption[], Error>({
    queryKey: ['mypage', 'options'],
    queryFn: getAvailableOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
