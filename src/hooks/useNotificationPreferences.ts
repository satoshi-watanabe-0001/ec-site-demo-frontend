/**
 * @fileoverview 通知設定取得カスタムフック
 * @module hooks/useNotificationPreferences
 *
 * TanStack Queryを使用して通知設定を取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getNotificationPreferences } from '@/services/mypageService'
import type { NotificationPreferences } from '@/types'

/**
 * 通知設定を取得するカスタムフック
 *
 * @param enabled - 自動取得フラグ
 * @returns TanStack Queryの結果オブジェクト
 */
export function useNotificationPreferences(enabled: boolean = true) {
  return useQuery<NotificationPreferences, Error>({
    queryKey: ['mypage', 'notification-preferences'],
    queryFn: getNotificationPreferences,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
