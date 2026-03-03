/**
 * @fileoverview 契約関連の型定義
 * @module types/contract
 *
 * 契約詳細、端末情報、サービスオプションなど
 * 契約管理に関する型定義。
 */

/**
 * 契約詳細情報
 */
export interface ContractDetail {
  /** 契約ID */
  id: string
  /** 契約番号 */
  contractNumber: string
  /** 契約状態 */
  status: ContractStatus
  /** 契約開始日 */
  startDate: string
  /** 現在のプラン */
  currentPlan: ContractPlan
  /** 契約端末 */
  device: ContractDevice
  /** 契約オプション */
  options: ContractOption[]
  /** SIM情報 */
  simInfo: SimInfo
  /** 最終更新日 */
  updatedAt: string
}

/**
 * 契約状態
 */
export type ContractStatus = 'active' | 'suspended' | 'cancelled' | 'pending'

/**
 * 契約プラン情報
 */
export interface ContractPlan {
  /** プランID */
  id: string
  /** プラン名 */
  name: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** データ容量（GB） */
  dataCapacity: number
  /** 無料通話時間（分） */
  freeCallMinutes: number
  /** プランの説明 */
  description: string
  /** 特徴リスト */
  features: string[]
}

/**
 * 契約端末情報
 */
export interface ContractDevice {
  /** 端末ID */
  id: string
  /** 端末名 */
  name: string
  /** メーカー名 */
  manufacturer: string
  /** 端末画像URL */
  imageUrl: string
  /** IMEI番号 */
  imei: string
  /** 購入日 */
  purchaseDate: string
  /** 分割支払い情報 */
  installmentInfo?: InstallmentInfo
  /** カラー */
  color: string
  /** ストレージ容量 */
  storage: string
}

/**
 * 分割支払い情報
 */
export interface InstallmentInfo {
  /** 分割回数 */
  totalInstallments: number
  /** 残り回数 */
  remainingInstallments: number
  /** 月額分割金額 */
  monthlyAmount: number
  /** 端末総額 */
  totalAmount: number
  /** 残債額 */
  remainingAmount: number
}

/**
 * 契約オプション情報
 */
export interface ContractOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** オプションの説明 */
  description: string
  /** 申込日 */
  subscribedAt: string
  /** オプション状態 */
  status: 'active' | 'pending' | 'cancelled'
}

/**
 * SIM情報
 */
export interface SimInfo {
  /** SIM種別 */
  simType: 'physical' | 'esim'
  /** 電話番号 */
  phoneNumber: string
  /** ICCID（下4桁） */
  iccidLast4: string
}

/**
 * 利用可能なオプション一覧
 */
export interface AvailableOption {
  /** オプションID */
  id: string
  /** オプション名 */
  name: string
  /** 月額料金（税込） */
  monthlyPrice: number
  /** オプションの説明 */
  description: string
  /** 特徴リスト */
  features: string[]
  /** 契約済みフラグ */
  isSubscribed: boolean
  /** カテゴリ */
  category: OptionCategory
}

/**
 * オプションカテゴリ
 */
export type OptionCategory = 'data' | 'call' | 'insurance' | 'entertainment' | 'security'

/**
 * オプション一覧レスポンス
 */
export interface AvailableOptionsResponse {
  /** オプションリスト */
  options: AvailableOption[]
  /** 総件数 */
  totalCount: number
}

/**
 * 利用可能なプラン一覧レスポンス
 */
export interface AvailablePlansResponse {
  /** プランリスト */
  plans: ContractPlan[]
  /** 現在のプランID */
  currentPlanId: string
}

/**
 * プラン変更リクエスト
 */
export interface ChangePlanRequest {
  /** 新しいプランID */
  planId: string
}

/**
 * 端末情報レスポンス
 */
export interface DevicesResponse {
  /** 端末リスト */
  devices: ContractDevice[]
  /** 総件数 */
  totalCount: number
}
