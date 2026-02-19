/**
 * @fileoverview 請求情報関連の型定義
 * @module types/billing
 */

export interface BillingBreakdown {
  baseFee: number
  usageCharges: number
  optionCharges: number
  discount: number
  tax: number
  total: number
}

export interface BillingInfo {
  billingMonth: string
  breakdown: BillingBreakdown
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'overdue'
  dueDate: string
  previousMonthTotal: number
}

export interface BillingHistoryItem {
  billingMonth: string
  total: number
  paymentStatus: 'paid' | 'overdue'
  paidDate?: string
}

export interface BillingResponse {
  billing: BillingInfo
}

export interface BillingHistoryResponse {
  history: BillingHistoryItem[]
  totalCount: number
}
