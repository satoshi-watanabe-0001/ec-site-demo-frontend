/**
 * @fileoverview 請求関連の型定義
 * @module types/billing
 *
 * 請求情報、支払い方法、請求履歴に関する型を定義。
 * マイページの請求・支払い機能で使用される。
 */

/**
 * 請求ステータス
 */
export type BillingStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

/**
 * 支払い方法種別
 */
export type PaymentMethodType =
  | 'credit_card'
  | 'bank_transfer'
  | 'convenience_store'
  | 'carrier_billing'

/**
 * 現在月の請求情報
 */
export interface CurrentBilling {
  /** 請求ID */
  billingId: string
  /** 請求月（YYYY-MM形式） */
  billingMonth: string
  /** 請求ステータス */
  status: BillingStatus
  /** 基本料金 */
  baseFee: number
  /** 通話料金 */
  callFee: number
  /** データ追加料金 */
  dataAdditionalFee: number
  /** オプション料金 */
  optionFee: number
  /** 端末分割払い */
  deviceInstallment: number
  /** 割引額 */
  discount: number
  /** 税抜合計 */
  subtotal: number
  /** 消費税 */
  tax: number
  /** 税込合計 */
  total: number
  /** 支払期限 */
  dueDate: string
  /** 支払い方法 */
  paymentMethod: PaymentMethodType
}

/**
 * 請求履歴項目
 */
export interface BillingHistoryItem {
  /** 請求ID */
  billingId: string
  /** 請求月（YYYY-MM形式） */
  billingMonth: string
  /** 請求ステータス */
  status: BillingStatus
  /** 基本料金 */
  baseFee: number
  /** オプション料金 */
  optionFee: number
  /** 通話料金 */
  callCharges: number
  /** データ超過料金 */
  dataOverageCharges: number
  /** 端末分割払い */
  deviceInstallment: number
  /** 税込合計 */
  total: number
  /** 支払日 */
  paidDate: string | null
  /** 支払い方法 */
  paymentMethod: PaymentMethodType
}

/**
 * 請求履歴レスポンス
 */
export interface BillingHistoryResponse {
  /** 請求履歴一覧 */
  items: BillingHistoryItem[]
  /** 総件数 */
  totalCount: number
  /** 現在のページ */
  page: number
  /** 1ページあたりの件数 */
  pageSize: number
}

/**
 * クレジットカード情報
 */
export interface CreditCardInfo {
  /** カードID */
  cardId: string
  /** カードブランド */
  brand: string
  /** カード番号下4桁 */
  lastFourDigits: string
  /** 有効期限（MM/YY形式） */
  expiryDate: string
  /** カード名義人 */
  holderName: string
}

/**
 * 銀行口座情報
 */
export interface BankAccountInfo {
  /** 口座ID */
  accountId: string
  /** 銀行名 */
  bankName: string
  /** 支店名 */
  branchName: string
  /** 口座種別 */
  accountType: 'checking' | 'savings'
  /** 口座番号下4桁 */
  accountNumberLast4: string
  /** 口座名義人 */
  accountHolderName: string
}

/**
 * 支払い方法情報
 */
export interface PaymentMethod {
  /** 支払い方法種別 */
  type: PaymentMethodType
  /** クレジットカード情報（type='credit_card'の場合） */
  cardInfo?: CreditCardInfo
  /** 銀行口座情報（type='bank_transfer'の場合） */
  bankInfo?: BankAccountInfo
  /** デフォルトの支払い方法かどうか */
  isDefault?: boolean
}

/**
 * 支払い方法更新リクエスト
 */
export interface UpdatePaymentMethodRequest {
  /** 支払い方法種別 */
  type: PaymentMethodType
  /** クレジットカードトークン（新規カード登録時） */
  cardToken?: string
  /** 既存カードID（既存カード選択時） */
  cardId?: string
}

/**
 * 請求APIエラーレスポンス
 */
export interface BillingErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
