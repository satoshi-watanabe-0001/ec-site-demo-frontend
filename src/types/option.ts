/**
 * @fileoverview オプションサービス関連の型定義
 * @module types/option
 *
 * オプションサービス情報、契約・解約に関する型を定義。
 * マイページのオプション管理機能で使用される。
 */

/**
 * オプションカテゴリ
 */
export type OptionCategory = 'call' | 'data' | 'security' | 'entertainment' | 'support'

/**
 * オプションステータス
 */
export type OptionStatus = 'subscribed' | 'available' | 'unavailable'

/**
 * オプションサービス情報
 */
export interface OptionService {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** カテゴリ */
  category: OptionCategory
  /** 月額料金 */
  monthlyFee: number
  /** 説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** ステータス */
  status: OptionStatus
  /** 契約開始日（契約中の場合） */
  subscribedDate?: string
  /** 解約可能かどうか */
  isCancellable: boolean
  /** 注意事項 */
  notes?: string
}

/**
 * オプション一覧レスポンス
 */
export interface OptionsResponse {
  /** 契約中のオプション */
  subscribedOptions: OptionService[]
  /** 利用可能なオプション */
  availableOptions: OptionService[]
}

/**
 * オプション契約リクエスト
 */
export interface SubscribeOptionRequest {
  /** オプションID */
  optionId: string
  /** 契約開始日（YYYY-MM-DD形式、省略時は即時） */
  startDate?: string
}

/**
 * オプション契約レスポンス
 */
export interface SubscribeOptionResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 契約開始日 */
  startDate: string
  /** 契約したオプション */
  option: OptionService
}

/**
 * オプション解約リクエスト
 */
export interface UnsubscribeOptionRequest {
  /** オプションID */
  optionId: string
  /** 解約日（YYYY-MM-DD形式、省略時は月末） */
  endDate?: string
}

/**
 * オプション解約レスポンス
 */
export interface UnsubscribeOptionResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
  /** 解約日 */
  endDate: string
}

/**
 * オプションAPIエラーレスポンス
 */
export interface OptionErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
