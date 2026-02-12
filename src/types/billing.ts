/**
 * @fileoverview 請求情報関連の型定義
 * @module types/billing
 *
 * 請求情報、履歴、支払い方法に関する型定義。
 * 請求情報APIとの通信で使用される。
 */

/**
 * 請求明細項目
 */
export interface BillingItem {
  /** 項目名 */
  label: string
  /** 金額（税込） */
  amount: number
}

/**
 * 請求情報
 */
export interface BillingInfo {
  /** 今月の請求予定額（税込） */
  currentMonthTotal: number
  /** 基本料金（税込） */
  basicFee: number
  /** 通話料（税込） */
  callCharge: number
  /** オプション料金合計（税込） */
  optionFee: number
  /** その他料金（税込） */
  otherCharges: number
  /** 割引合計（税込） */
  discount: number
  /** 前月請求額（税込） */
  previousMonthTotal: number
  /** 前月比較（差額） */
  monthOverMonthDiff: number
  /** 請求明細 */
  details: BillingItem[]
  /** 請求期間開始日 */
  billingPeriodStart: string
  /** 請求期間終了日 */
  billingPeriodEnd: string
}

/**
 * 請求履歴
 */
export interface BillingHistory {
  /** 請求ID */
  id: string
  /** 請求月（YYYY-MM形式） */
  billingMonth: string
  /** 請求額（税込） */
  amount: number
  /** 支払い状況 */
  paymentStatus: 'paid' | 'pending' | 'overdue'
  /** 支払い日（ISO 8601形式、未払いの場合null） */
  paidAt: string | null
  /** 明細書ダウンロードURL */
  invoiceUrl: string
}

/**
 * 支払い方法
 */
export interface PaymentMethod {
  /** 支払い方法ID */
  id: string
  /** 支払い方法タイプ */
  type: 'credit_card' | 'bank_transfer'
  /** カード下4桁（クレジットカードの場合） */
  lastFourDigits: string | null
  /** カードブランド（クレジットカードの場合） */
  cardBrand: string | null
  /** カード有効期限（MM/YY形式、クレジットカードの場合） */
  expiryDate: string | null
  /** 銀行名（口座振替の場合） */
  bankName: string | null
  /** 口座種別（口座振替の場合） */
  accountType: string | null
  /** 口座番号下4桁（口座振替の場合） */
  accountLastFourDigits: string | null
  /** デフォルト支払い方法かどうか */
  isDefault: boolean
}
