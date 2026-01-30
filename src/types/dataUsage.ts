/**
 * @fileoverview データ使用量関連の型定義
 * @module types/dataUsage
 *
 * データ使用量、使用履歴に関する型を定義。
 * マイページのデータ使用量表示機能で使用される。
 */

/**
 * 現在のデータ使用量
 */
export interface CurrentDataUsage {
  /** 契約データ容量（GB） */
  dataCapacity: number
  /** 使用済みデータ量（GB） */
  usedData: number
  /** 残りデータ量（GB） */
  remainingData: number
  /** 使用率（%） */
  usagePercentage: number
  /** 集計期間開始日 */
  periodStartDate: string
  /** 集計期間終了日 */
  periodEndDate: string
  /** リセット日 */
  resetDate: string
  /** 追加データ購入量（GB） */
  additionalData: number
  /** 繰り越しデータ量（GB） */
  carryOverData: number
}

/**
 * 日別データ使用量
 */
export interface DailyDataUsage {
  /** 日付（YYYY-MM-DD形式） */
  date: string
  /** 使用データ量（GB） */
  usedData: number
}

/**
 * 月別データ使用量
 */
export interface MonthlyDataUsage {
  /** 月（YYYY-MM形式） */
  month: string
  /** 使用データ量（GB） */
  usedData: number
  /** 契約データ容量（GB） */
  dataCapacity: number
  /** 追加データ購入量（GB） */
  additionalData: number
}

/**
 * データ使用量履歴レスポンス
 */
export interface DataUsageHistoryResponse {
  /** 日別使用量（直近30日） */
  dailyUsage: DailyDataUsage[]
  /** 月別使用量（直近12ヶ月） */
  monthlyUsage: MonthlyDataUsage[]
}

/**
 * データ追加購入オプション
 */
export interface DataAddOnOption {
  /** オプションID */
  optionId: string
  /** データ容量（GB） */
  dataAmount: number
  /** 価格 */
  price: number
  /** 有効期限（日数） */
  validityDays: number
  /** 利用可能かどうか */
  isAvailable: boolean
  /** 説明 */
  description: string
}

/**
 * データ追加購入リクエスト
 */
export interface PurchaseDataAddOnRequest {
  /** オプションID */
  optionId: string
}

/**
 * データ追加購入レスポンス
 */
export interface PurchaseDataAddOnResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 購入後の残りデータ量（GB） */
  newRemainingData: number
}

/**
 * データ使用量APIエラーレスポンス
 */
export interface DataUsageErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
