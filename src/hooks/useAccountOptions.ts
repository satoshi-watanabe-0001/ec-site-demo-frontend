/**
 * @fileoverview オプションサービス取得カスタムフック
 * @module hooks/useAccountOptions
 *
 * TanStack Queryを使用してオプションサービス情報を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getAccountOptions } from '@/services/accountService'
import type { AccountOptionsResponse } from '@/types'

/**
 * オプションサービス取得フックのオプション
 */
interface UseAccountOptionsOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * オプションサービス情報を取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useAccountOptions(options: UseAccountOptionsOptions = {}) {
  const { enabled = true } = options

  return useQuery<AccountOptionsResponse, Error>({
    queryKey: ['accountOptions'],
    queryFn: getAccountOptions,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
