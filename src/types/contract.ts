/**
 * @fileoverview 契約情報関連の型定義
 * @module types/contract
 */

export interface ContractPlan {
  planId: string
  planName: string
  monthlyFee: number
  dataCapacityGB: number
  description: string
}

export interface DataUsageSummary {
  usedGB: number
  totalGB: number
  usagePercentage: number
  remainingGB: number
  lastUpdated: string
}

export interface BillingSummary {
  baseFee: number
  usageCharges: number
  optionCharges: number
  totalAmount: number
  previousMonthAmount: number
  billingMonth: string
}

export interface DeviceInfo {
  deviceName: string
  imageUrl: string
  purchaseDate: string
  paymentStatus: string
  remainingBalance: number | null
  monthlyPayment: number | null
  remainingMonths: number | null
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'important'
  isRead: boolean
  createdAt: string
}

export interface DashboardResponse {
  plan: ContractPlan
  dataUsage: DataUsageSummary
  billing: BillingSummary
  device: DeviceInfo
  notifications: Notification[]
  unreadCount: number
}

export interface ContractDetail {
  contractId: string
  contractDate: string
  plan: ContractPlan
  phoneNumber: string
  simType: string
  contractStatus: string
  autoRenewal: boolean
  nextRenewalDate: string
  device: DeviceInfo
  options: ContractOption[]
}

export interface ContractOption {
  optionId: string
  optionName: string
  monthlyFee: number
  status: 'active' | 'inactive'
  startDate: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  totalCount: number
  unreadCount: number
}
