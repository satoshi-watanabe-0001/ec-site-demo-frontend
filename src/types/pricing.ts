/**
 * @fileoverview 料金プラン関連の型定義
 * @module types/pricing
 *
 * ahamoの料金プランとオプションに関する型定義。
 */

/**
 * 料金プランの型定義
 */
export interface PricingPlan {
  /** プランID */
  id: string
  /** プラン名 */
  name: string
  /** 月額料金（税込） */
  price: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 無料通話時間（分） */
  freeCallMinutes: number
  /** プランの説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** 推奨フラグ */
  isRecommended?: boolean
}

/**
 * オプションプランの型定義
 */
export interface PricingOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 追加料金（税込） */
  additionalPrice: number
  /** 追加データ容量（GB） */
  additionalDataCapacity: number
  /** オプションの説明 */
  description: string
}

/**
 * 料金プランセクションで使用するデータ型
 */
export interface PricingData {
  /** 基本プラン */
  basicPlan: PricingPlan
  /** オプションプラン */
  options: PricingOption[]
}
