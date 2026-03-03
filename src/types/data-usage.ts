/**
 * @fileoverview データ使用量関連の型定義
 * @module types/data-usage
 *
 * データ使用量、チャージ履歴、使用量内訳など
 * データ使用量管理に関する型定義。
 */

/**
 * 当月データ使用量情報
 */
export interface DataUsage {
  /** 対象月（YYYY-MM形式） */
  month: string
  /** データ容量上限（GB） */
  totalCapacity: number
  /** 使用済みデータ量（GB） */
  usedData: number
  /** 残りデータ量（GB） */
  remainingData: number
  /** 使用率（%） */
  usagePercentage: number
  /** 追加購入データ量（GB） */
  additionalData: number
  /** 速度制限中フラグ */
  isThrottled: boolean
  /** 日別使用量 */
  dailyUsage: DailyUsage[]
  /** 最終更新日時 */
  updatedAt: string
}

/**
 * 日別データ使用量
 */
export interface DailyUsage {
  /** 日付（YYYY-MM-DD形式） */
  date: string
  /** 使用量（GB） */
  usage: number
}

/**
 * データ使用量履歴項目
 */
export interface DataUsageHistoryItem {
  /** 対象月（YYYY-MM形式） */
  month: string
  /** データ容量上限（GB） */
  totalCapacity: number
  /** 使用済みデータ量（GB） */
  usedData: number
  /** 使用率（%） */
  usagePercentage: number
  /** 追加購入データ量（GB） */
  additionalData: number
}

/**
 * データ使用量履歴レスポンス
 */
export interface DataUsageHistoryResponse {
  /** 使用量履歴リスト */
  history: DataUsageHistoryItem[]
  /** 総件数 */
  totalCount: number
}

/**
 * データチャージ履歴項目
 */
export interface DataChargeHistoryItem {
  /** チャージID */
  id: string
  /** チャージ日時 */
  chargedAt: string
  /** チャージ量（GB） */
  amount: number
  /** チャージ料金 */
  price: number
  /** チャージ種別 */
  type: DataChargeType
}

/**
 * データチャージ種別
 */
export type DataChargeType = 'manual' | 'auto' | 'campaign'

/**
 * データチャージ履歴レスポンス
 */
export interface DataChargeHistoryResponse {
  /** チャージ履歴リスト */
  history: DataChargeHistoryItem[]
  /** 総件数 */
  totalCount: number
}

/**
 * データ使用量内訳
 */
export interface DataUsageBreakdown {
  /** アプリ名 */
  appName: string
  /** 使用量（GB） */
  usage: number
  /** 使用率（%） */
  percentage: number
  /** アイコン名 */
  iconName?: string
}
