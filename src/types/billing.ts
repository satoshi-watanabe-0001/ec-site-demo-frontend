/**
 * @fileoverview 請求情報関連の型定義
 * @module types/billing
 */

export interface BillingDetail {
  billingMonth: string
  billingDate: string
  paymentDueDate: string
  paymentMethod: string
  cardLastFour: string
  items: BillingItem[]
  subtotal: number
  tax: number
  totalAmount: number
  isPaid: boolean
}

export interface BillingItem {
  itemName: string
  category: 'base' | 'usage' | 'option' | 'discount' | 'device'
  amount: number
  description: string
}

export interface BillingHistoryEntry {
  billingMonth: string
  totalAmount: number
  isPaid: boolean
  paymentDate: string | null
}

export interface BillingHistoryResponse {
  history: BillingHistoryEntry[]
  totalCount: number
}
