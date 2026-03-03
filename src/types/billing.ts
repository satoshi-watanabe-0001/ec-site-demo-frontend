/**
 * @fileoverview 請求・支払い関連の型定義
 * @module types/billing
 *
 * 請求情報、支払い方法、請求履歴など
 * 請求管理に関する型定義。
 */

/**
 * 現在の請求情報
 */
export interface CurrentBilling {
  /** 請求月（YYYY-MM形式） */
  billingMonth: string
  /** 基本料金 */
  basicCharge: number
  /** オプション料金合計 */
  optionCharges: number
  /** 通話料金 */
  callCharges: number
  /** データ追加料金 */
  dataAdditionalCharges: number
  /** 割引額 */
  discountAmount: number
  /** 消費税 */
  tax: number
  /** 合計金額（税込） */
  totalAmount: number
  /** 請求確定フラグ */
  isConfirmed: boolean
  /** 請求確定日 */
  confirmedAt?: string
  /** 請求明細 */
  details: BillingDetail[]
}

/**
 * 請求明細項目
 */
export interface BillingDetail {
  /** 項目名 */
  name: string
  /** 金額 */
  amount: number
  /** 項目種別 */
  category: BillingCategory
}

/**
 * 請求項目カテゴリ
 */
export type BillingCategory = 'basic' | 'option' | 'call' | 'data' | 'discount' | 'tax' | 'other'

/**
 * 請求履歴項目
 */
export interface BillingHistoryItem {
  /** 請求月（YYYY-MM形式） */
  billingMonth: string
  /** 合計金額（税込） */
  totalAmount: number
  /** 支払い状態 */
  paymentStatus: PaymentStatus
  /** 支払い日 */
  paidAt?: string
  /** 請求確定フラグ */
  isConfirmed: boolean
}

/**
 * 支払い状態
 */
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'processing'

/**
 * 請求履歴レスポンス
 */
export interface BillingHistoryResponse {
  /** 請求履歴リスト */
  history: BillingHistoryItem[]
  /** 総件数 */
  totalCount: number
}

/**
 * 支払い方法情報
 */
export interface PaymentMethod {
  /** 支払い方法ID */
  id: string
  /** 支払い方法種別 */
  type: PaymentMethodType
  /** カード情報（クレジットカードの場合） */
  cardInfo?: CardInfo
  /** 口座情報（口座振替の場合） */
  bankAccountInfo?: BankAccountInfo
  /** デフォルト支払い方法フラグ */
  isDefault: boolean
  /** 登録日 */
  registeredAt: string
}

/**
 * 支払い方法種別
 */
export type PaymentMethodType = 'credit_card' | 'bank_transfer' | 'convenience_store'

/**
 * クレジットカード情報
 */
export interface CardInfo {
  /** カードブランド */
  brand: string
  /** カード番号の下4桁 */
  last4: string
  /** 有効期限（MM/YY形式） */
  expiryDate: string
  /** カード名義人 */
  holderName: string
}

/**
 * 口座振替情報
 */
export interface BankAccountInfo {
  /** 銀行名 */
  bankName: string
  /** 支店名 */
  branchName: string
  /** 口座種別 */
  accountType: '普通' | '当座'
  /** 口座番号の下4桁 */
  accountLast4: string
  /** 口座名義人 */
  accountHolder: string
}

/**
 * 支払い方法更新リクエスト
 */
export interface UpdatePaymentMethodRequest {
  /** 支払い方法種別 */
  type: PaymentMethodType
  /** カードトークン（クレジットカードの場合） */
  cardToken?: string
  /** 口座情報（口座振替の場合） */
  bankAccountInfo?: BankAccountInfo
}
