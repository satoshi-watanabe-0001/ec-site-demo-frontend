/**
 * @fileoverview 契約関連の型定義
 * @module types/contract
 *
 * 契約情報、契約者情報、デバイス情報に関する型を定義。
 * マイページの契約情報表示機能で使用される。
 */

/**
 * 契約ステータス
 */
export type ContractStatus = 'active' | 'suspended' | 'cancelled' | 'pending'

/**
 * 契約サマリー情報
 */
export interface ContractSummary {
  /** 契約ID */
  contractId: string
  /** 契約ステータス */
  status: ContractStatus
  /** プラン名 */
  planName: string
  /** 契約開始日 */
  startDate: string
  /** 電話番号 */
  phoneNumber: string
  /** 月額基本料金 */
  monthlyBaseFee: number
}

/**
 * 契約者情報
 */
export interface ContractorInfo {
  /** 契約者名 */
  name: string
  /** フリガナ */
  nameKana: string
  /** 生年月日 */
  dateOfBirth: string
  /** 郵便番号 */
  postalCode: string
  /** 住所 */
  address: string
  /** 連絡先電話番号 */
  contactPhone: string
  /** メールアドレス */
  email: string
}

/**
 * SIM情報
 */
export interface SimInfo {
  /** SIM種別 */
  simType: 'physical' | 'eSIM'
  /** ICCID */
  iccid: string
  /** アクティベーション日 */
  activationDate: string
}

/**
 * プラン情報
 */
export interface PlanInfo {
  /** プランID */
  planId: string
  /** プラン名 */
  planName: string
  /** 月額料金 */
  monthlyFee: number
  /** データ容量（GB） */
  dataCapacity: number
}

/**
 * 契約詳細情報
 */
export interface ContractDetails {
  /** 契約ID */
  contractId: string
  /** 契約番号 */
  contractNumber: string
  /** 契約ステータス */
  status: ContractStatus
  /** 契約開始日 */
  startDate: string
  /** 契約終了日（省略可） */
  endDate?: string
  /** 電話番号 */
  phoneNumber: string
  /** プラン情報 */
  plan: PlanInfo
  /** SIM情報 */
  simInfo: SimInfo
  /** 契約者情報 */
  contractor: ContractorInfo
  /** 契約オプション */
  options: ContractOption[]
}

/**
 * 契約オプション
 */
export interface ContractOption {
  /** オプションID */
  optionId: string
  /** オプション名 */
  optionName: string
  /** 月額料金 */
  monthlyFee: number
  /** 契約開始日 */
  startDate: string
}

/**
 * デバイス情報
 */
export interface DeviceInfo {
  /** デバイスID */
  deviceId: string
  /** デバイス名 */
  deviceName: string
  /** メーカー */
  manufacturer: string
  /** モデル番号 */
  modelNumber: string
  /** IMEI */
  imei: string
  /** 購入日 */
  purchaseDate: string
  /** 保証期限 */
  warrantyEndDate: string
  /** 分割払い残高 */
  installmentBalance: number
  /** 分割払い残り回数 */
  installmentRemainingCount: number
}

/**
 * 契約APIレスポンス
 */
export interface ContractResponse {
  /** 契約サマリー */
  summary: ContractSummary
  /** 契約詳細 */
  details: ContractDetails
  /** デバイス情報 */
  device: DeviceInfo | null
}
