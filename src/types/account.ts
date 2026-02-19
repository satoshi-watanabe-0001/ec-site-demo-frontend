/**
 * @fileoverview アカウント設定関連の型定義
 * @module types/account
 */

export interface ContactInfo {
  email: string
  phoneNumber: string
  postalCode: string
  address: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  promotionalEmails: boolean
  usageAlerts: boolean
  billingAlerts: boolean
}

export interface AccountInfo {
  userId: string
  name: string
  email: string
  contact: ContactInfo
  notificationSettings: NotificationSettings
  createdAt: string
  lastLoginAt: string
}

export interface AccountResponse {
  account: AccountInfo
}

export interface ContactUpdateRequest {
  email?: string
  phoneNumber?: string
  postalCode?: string
  address?: string
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
}

export interface NotificationUpdateRequest {
  emailNotifications?: boolean
  smsNotifications?: boolean
  promotionalEmails?: boolean
  usageAlerts?: boolean
  billingAlerts?: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'important'
  isRead: boolean
  createdAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

export interface AvailablePlan {
  id: string
  name: string
  type: 'ahamo' | 'ahamo_large'
  monthlyFee: number
  dataCapacityGB: number
  description: string
  features: string[]
}

export interface PlanChangeRequest {
  planId: string
  effectiveDate: string
}

export interface PlanChangeResponse {
  success: boolean
  message: string
  effectiveDate: string
}

export interface OptionService {
  id: string
  name: string
  monthlyFee: number
  description: string
  isSubscribed: boolean
  category: string
}

export interface OptionsResponse {
  options: OptionService[]
}

export interface DashboardSummary {
  plan: {
    name: string
    type: 'ahamo' | 'ahamo_large'
    monthlyFee: number
    dataCapacityGB: number
  }
  dataUsage: {
    usedGB: number
    totalCapacityGB: number
    remainingGB: number
    usagePercent: number
    lastUpdated: string
  }
  billing: {
    currentMonthEstimate: number
    baseFee: number
    usageAndOptionCharges: number
    previousMonthTotal: number
  }
  device: {
    name: string
    imageUrl: string
    purchaseDate: string
    paymentStatus: 'paid' | 'installment'
    remainingBalance?: number
  }
  notifications: {
    unreadCount: number
    importantAnnouncements: {
      id: string
      title: string
      createdAt: string
    }[]
  }
}

export interface DashboardResponse {
  dashboard: DashboardSummary
}
