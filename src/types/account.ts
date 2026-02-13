/**
 * @fileoverview アカウント管理関連の型定義
 * @module types/account
 *
 * マイページダッシュボード・契約情報・データ使用量・請求情報の型を定義。
 */

/**
 * 契約オプションの型定義
 */
export interface ContractOption {
  id: string
  name: string
  monthlyFee: number
  description: string
}

/**
 * 契約情報の型定義
 */
export interface ContractInfo {
  id: string
  planName: string
  monthlyFee: number
  dataCapacity: string
  contractDate: string
  phoneNumber: string
  options: ContractOption[]
}

/**
 * 日別データ使用量の型定義
 */
export interface DailyUsage {
  date: string
  used: number
}

/**
 * データ使用状況の型定義
 */
export interface DataUsage {
  contractId: string
  currentMonth: {
    used: number
    total: number
    lastUpdated: string
  }
  dailyUsage: DailyUsage[]
}

/**
 * 請求履歴の型定義
 */
export interface BillingHistory {
  month: string
  basicFee: number
  optionFee: number
  callFee: number
  total: number
}

/**
 * 請求情報の型定義
 */
export interface BillingInfo {
  contractId: string
  currentBill: {
    basicFee: number
    optionFee: number
    callFee: number
    total: number
    previousMonthTotal: number
  }
  history: BillingHistory[]
}

/**
 * 端末情報の型定義
 */
export interface DeviceInfo {
  id: string
  name: string
  imageUrl: string
  purchaseDate: string
  remainingBalance?: number
}

/**
 * 通知の型定義
 */
export interface AccountNotification {
  id: string
  title: string
  message: string
  date: string
  isRead: boolean
  type: 'info' | 'warning' | 'important'
}

/**
 * 通知情報の型定義
 */
export interface NotificationInfo {
  unreadCount: number
  notifications: AccountNotification[]
}

/**
 * ダッシュボードデータの型定義
 */
export interface DashboardData {
  contract: ContractInfo
  dataUsage: DataUsage
  billing: BillingInfo
  device: DeviceInfo
  notifications: NotificationInfo
}
