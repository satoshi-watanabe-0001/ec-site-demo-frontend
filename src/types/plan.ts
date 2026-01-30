/**
 * @fileoverview プラン関連の型定義
 * @module types/plan
 *
 * プラン情報、プラン変更に関する型を定義。
 * マイページのプラン管理機能で使用される。
 */

/**
 * プラン種別
 */
export type PlanType = 'ahamo' | 'ahamo_large'

/**
 * プラン情報
 */
export interface Plan {
  /** プランID */
  planId: string
  /** プラン名 */
  planName: string
  /** プラン種別 */
  planType: PlanType
  /** 月額基本料金 */
  monthlyFee: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 国内通話無料時間（分） */
  freeCallMinutes: number
  /** 5G対応 */
  is5GSupported: boolean
  /** 海外ローミング対応 */
  isInternationalRoamingSupported: boolean
  /** プラン説明 */
  description: string
  /** 特徴リスト */
  features: string[]
}

/**
 * 利用可能プラン一覧レスポンス
 */
export interface AvailablePlansResponse {
  /** 現在のプラン */
  currentPlan: Plan
  /** 利用可能なプラン一覧 */
  availablePlans: Plan[]
}

/**
 * プラン変更リクエスト
 */
export interface ChangePlanRequest {
  /** 変更先プランID */
  newPlanId: string
  /** 変更希望日（YYYY-MM-DD形式、省略時は即時） */
  effectiveDate?: string
}

/**
 * プラン変更レスポンス
 */
export interface ChangePlanResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 変更適用日 */
  effectiveDate: string
  /** 変更後のプラン */
  newPlan: Plan
  /** 差額（プラスは追加料金、マイナスは返金） */
  priceDifference: number
}

/**
 * プラン変更シミュレーション結果
 */
export interface PlanChangeSimulation {
  /** 現在のプラン */
  currentPlan: Plan
  /** 変更後のプラン */
  newPlan: Plan
  /** 現在の月額料金 */
  currentMonthlyFee: number
  /** 新しい月額料金 */
  newMonthlyFee: number
  /** 料金差額 */
  priceDifference: number
  /** 月額料金差額 */
  monthlyFeeDifference: number
  /** 初月の請求額 */
  firstMonthBilling: number
  /** 変更適用日 */
  effectiveDate: string
  /** 注意事項 */
  notes: string[]
}

/**
 * プランAPIエラーレスポンス
 */
export interface PlanErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
