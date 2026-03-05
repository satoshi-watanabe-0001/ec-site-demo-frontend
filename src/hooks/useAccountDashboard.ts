/**
 * @fileoverview アカウントダッシュボード取得カスタムフック
 * @module hooks/useAccountDashboard
 *
 * TanStack Queryを使用してダッシュボードデータを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getAccountDashboard } from '@/services/accountService'
import type { AccountDashboardResponse } from '@/types'

/**
 * ダッシュボード取得フックのオプション
 */
interface UseAccountDashboardOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * アカウントダッシュボードデータを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useAccountDashboard(options: UseAccountDashboardOptions = {}) {
  const { enabled = true } = options

  return useQuery<AccountDashboardResponse, Error>({
    queryKey: ['accountDashboard'],
    queryFn: getAccountDashboard,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
