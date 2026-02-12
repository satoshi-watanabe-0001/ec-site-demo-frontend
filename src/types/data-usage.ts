/**
 * @fileoverview データ使用量関連の型定義
 * @module types/data-usage
 *
 * データ使用量、履歴、チャージに関する型定義。
 * データ使用量APIとの通信で使用される。
 */

/**
 * 今月のデータ使用状況
 */
export interface DataUsage {
  /** 使用済みデータ量（GB） */
  usedData: number
  /** データ容量上限（GB） */
  totalData: number
  /** 残りデータ量（GB） */
  remainingData: number
  /** 使用率（0-100のパーセンテージ） */
  usagePercentage: number
  /** データ更新日時（ISO 8601形式） */
  updatedAt: string
  /** 請求期間開始日 */
  billingPeriodStart: string
  /** 請求期間終了日 */
  billingPeriodEnd: string
}

/**
 * 日別データ使用量
 */
export interface DailyUsage {
  /** 日付（YYYY-MM-DD形式） */
  date: string
  /** 使用データ量（GB） */
  usage: number
}

/**
 * 月別データ使用量
 */
export interface MonthlyUsage {
  /** 月（YYYY-MM形式） */
  month: string
  /** 使用データ量（GB） */
  usage: number
  /** データ容量上限（GB） */
  totalData: number
}

/**
 * データ使用量履歴
 */
export interface DataUsageHistory {
  /** 日別使用量履歴 */
  daily: DailyUsage[]
  /** 月別使用量推移 */
  monthly: MonthlyUsage[]
}

/**
 * データチャージ履歴
 */
export interface DataCharge {
  /** チャージID */
  id: string
  /** チャージ日時（ISO 8601形式） */
  chargedAt: string
  /** チャージデータ量（GB） */
  amount: number
  /** チャージ料金（税込） */
  fee: number
  /** 有効期限（ISO 8601形式） */
  expiresAt: string
}
