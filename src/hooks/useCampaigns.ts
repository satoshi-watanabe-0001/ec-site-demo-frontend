/**
 * @fileoverview キャンペーン取得カスタムフック
 * @module hooks/useCampaigns
 *
 * TanStack Queryを使用してキャンペーンデータを取得するカスタムフック。
 */

import { useQuery } from '@tanstack/react-query'
import { getCampaigns } from '@/services/marketingService'
import type { CampaignsResponse, CampaignCategory } from '@/types'

/**
 * キャンペーン取得フックのオプション
 */
interface UseCampaignsOptions {
  /** 取得件数（デフォルト: 4） */
  limit?: number
  /** カテゴリフィルター */
  category?: CampaignCategory
  /** 自動取得を無効化 */
  enabled?: boolean
}

/**
 * キャンペーンデータを取得するカスタムフック
 *
 * @param options - フックオプション
 * @returns TanStack Queryの結果オブジェクト
 */
export function useCampaigns(options: UseCampaignsOptions = {}) {
  const { limit = 4, category, enabled = true } = options

  return useQuery<CampaignsResponse, Error>({
    queryKey: ['campaigns', limit, category],
    queryFn: () => getCampaigns({ limit, category }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  })
}
