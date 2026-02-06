/**
 * @fileoverview 契約情報取得カスタムフック
 * @module hooks/useContractDetails
 *
 * TanStack Queryを使用して契約詳細データを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getContractDetails } from '@/services/mypageService'
import type { ContractInfo } from '@/types'

/**
 * 契約情報を取得するカスタムフック
 *
 * @param enabled - 自動取得フラグ
 * @returns TanStack Queryの結果オブジェクト
 */
export function useContractDetails(enabled: boolean = true) {
  return useQuery<ContractInfo, Error>({
    queryKey: ['mypage', 'contract'],
    queryFn: getContractDetails,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
