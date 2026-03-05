/**
 * @fileoverview 契約情報取得カスタムフック
 * @module hooks/useContractInfo
 *
 * TanStack Queryを使用して契約情報データを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getContractInfo } from '@/services/accountService'
import type { ContractInfoResponse } from '@/types'

/**
 * 契約情報取得フックのオプション
 */
interface UseContractInfoOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * 契約情報データを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useContractInfo(options: UseContractInfoOptions = {}) {
  const { enabled = true } = options

  return useQuery<ContractInfoResponse, Error>({
    queryKey: ['contractInfo'],
    queryFn: getContractInfo,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
