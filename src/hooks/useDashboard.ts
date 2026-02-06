/**
 * @fileoverview ダッシュボードデータ取得カスタムフック
 * @module hooks/useDashboard
 *
 * TanStack Queryを使用してマイページダッシュボードデータを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '@/services/mypageService'
import type { DashboardData } from '@/types'

/**
 * ダッシュボードデータ取得フックのオプション
 */
interface UseDashboardOptions {
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * ダッシュボードデータを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useDashboard(options: UseDashboardOptions = {}) {
  const { enabled = true } = options

  return useQuery<DashboardData, Error>({
    queryKey: ['mypage', 'dashboard'],
    queryFn: getDashboardData,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
