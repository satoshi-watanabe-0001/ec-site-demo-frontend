/**
 * @fileoverview 契約情報関連の型定義
 * @module types/contract
 *
 * 契約者情報と契約内容に関する型定義。
 * アカウント管理APIとの通信で使用される。
 */

/**
 * 契約者情報
 */
export interface ContractorInfo {
  /** 氏名（姓） */
  lastName: string
  /** 氏名（名） */
  firstName: string
  /** 氏名カナ（姓） */
  lastNameKana: string
  /** 氏名カナ（名） */
  firstNameKana: string
  /** 生年月日（YYYY-MM-DD形式） */
  dateOfBirth: string
  /** 郵便番号 */
  postalCode: string
  /** 住所 */
  address: string
  /** 電話番号 */
  phoneNumber: string
  /** メールアドレス */
  email: string
}

/**
 * オプションサービス情報
 */
export interface OptionService {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyFee: number
  /** オプション説明 */
  description: string
  /** 契約開始日 */
  startDate: string
  /** 契約状態 */
  status: 'active' | 'pending' | 'cancelled'
}

/**
 * 追加可能なオプションサービス情報
 */
export interface AvailableOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyFee: number
  /** オプション説明 */
  description: string
  /** カテゴリ */
  category: string
}

/**
 * 契約内容詳細
 */
export interface ContractDetails {
  /** 電話番号 */
  phoneNumber: string
  /** 契約日（YYYY-MM-DD形式） */
  contractDate: string
  /** 現在のプラン名 */
  planName: string
  /** プランのデータ容量（GB） */
  dataCapacity: number
  /** 月額基本料金（税込） */
  monthlyBasicFee: number
  /** オプションサービス一覧 */
  options: OptionService[]
}

/**
 * 契約情報（契約者情報と契約内容の統合型）
 */
export interface ContractInfo {
  /** 契約ID */
  contractId: string
  /** 契約者情報 */
  contractor: ContractorInfo
  /** 契約内容 */
  details: ContractDetails
}

/**
 * プラン情報
 */
export interface PlanInfo {
  /** プランID */
  id: string
  /** プラン名 */
  name: string
  /** データ容量（GB） */
  dataCapacity: number
  /** 月額料金（税込） */
  monthlyFee: number
  /** プラン説明 */
  description: string
  /** 5分かけ放題の有無 */
  fiveMinuteCallFree: boolean
  /** かけ放題オプション料金（税込） */
  unlimitedCallFee: number
}

/**
 * プラン変更リクエスト
 */
export interface PlanChangeRequest {
  /** 変更先プランID */
  planId: string
  /** 適用時期 */
  effectiveDate: 'next_month' | 'immediate'
}

/**
 * プラン変更レスポンス
 */
export interface PlanChangeResponse {
  /** 変更受付状態 */
  status: 'accepted' | 'error'
  /** メッセージ */
  message: string
  /** 適用予定日 */
  effectiveDate: string
}
