/**
 * @fileoverview 請求情報取得カスタムフック
 * @module hooks/useBillingInfo
 *
 * TanStack Queryを使用して請求情報を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getBillingInfo } from '@/services/mypageService'
import type { BillingInfo } from '@/types'

/**
 * 請求情報を取得するカスタムフック
 *
 * @param enabled - 自動取得フラグ
 * @returns TanStack Queryの結果オブジェクト
 */
export function useBillingInfo(enabled: boolean = true) {
  return useQuery<BillingInfo, Error>({
    queryKey: ['mypage', 'billing'],
    queryFn: getBillingInfo,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
