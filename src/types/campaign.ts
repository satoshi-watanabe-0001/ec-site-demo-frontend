/**
 * @fileoverview キャンペーン関連の型定義
 * @module types/campaign
 *
 * キャンペーン情報セクションで使用するキャンペーンデータの型定義。
 */

/**
 * キャンペーンカテゴリの型定義
 */
export type CampaignCategory = '新規契約' | '機種変更' | 'MNP' | 'オプション' | 'その他'

/**
 * キャンペーン情報の型定義
 */
export interface Campaign {
  /** キャンペーンID */
  id: string
  /** キャンペーン名 */
  name: string
  /** バナー画像URL */
  bannerImageUrl: string
  /** 割引概要 */
  discountSummary: string
  /** 割引金額（オプション） */
  discountAmount?: number
  /** 割引率（オプション） */
  discountPercentage?: number
  /** キャンペーン開始日 */
  startDate: string
  /** キャンペーン終了日 */
  endDate: string
  /** キャンペーンカテゴリ */
  category: CampaignCategory
  /** キャンペーン詳細説明 */
  description: string
  /** 詳細ページURL */
  detailUrl: string
  /** 適用条件 */
  conditions?: string[]
}

/**
 * キャンペーンAPIレスポンスの型定義
 */
export interface CampaignsResponse {
  /** キャンペーンリスト */
  campaigns: Campaign[]
  /** 総件数 */
  totalCount: number
}
