/**
 * @fileoverview 請求情報取得カスタムフック
 * @module hooks/useBillingInfo
 *
 * TanStack Queryを使用して請求情報を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getBillingInfo } from '@/services/accountService'
import type { BillingInfoResponse } from '@/types'

/**
 * 請求情報取得フックのオプション
 */
interface UseBillingInfoOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * 請求情報を取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useBillingInfo(options: UseBillingInfoOptions = {}) {
  const { enabled = true } = options

  return useQuery<BillingInfoResponse, Error>({
    queryKey: ['billingInfo'],
    queryFn: getBillingInfo,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
