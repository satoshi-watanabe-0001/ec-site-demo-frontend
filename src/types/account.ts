/**
 * @fileoverview アカウント設定関連の型定義
 * @module types/account
 */

export interface AccountInfo {
  userId: string
  name: string
  email: string
  phoneNumber: string
  postalCode: string
  address: string
  dateOfBirth: string
  registeredAt: string
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
}

export interface ContactUpdateRequest {
  email?: string
  phoneNumber?: string
  postalCode?: string
  address?: string
}

export interface ContactUpdateResponse {
  success: boolean
  message: string
  updatedFields: string[]
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordChangeResponse {
  success: boolean
  message: string
}

export interface NotificationSettingsUpdateRequest {
  email?: boolean
  sms?: boolean
  push?: boolean
  marketing?: boolean
}

export interface NotificationSettingsUpdateResponse {
  success: boolean
  message: string
  settings: NotificationSettings
}

export interface PlanInfo {
  planId: string
  planName: string
  monthlyFee: number
  dataCapacityGB: number
  description: string
  features: string[]
  isCurrentPlan: boolean
}

export interface AvailablePlansResponse {
  plans: PlanInfo[]
}

export interface PlanChangeRequest {
  newPlanId: string
  effectiveDate: 'immediate' | 'next_month'
}

export interface PlanChangeResponse {
  success: boolean
  message: string
  effectiveDate: string
  newPlan: PlanInfo
}

export interface OptionService {
  optionId: string
  optionName: string
  monthlyFee: number
  description: string
  features: string[]
  isSubscribed: boolean
  category: string
}

export interface OptionsResponse {
  options: OptionService[]
}

export interface OptionSubscribeResponse {
  success: boolean
  message: string
  optionId: string
  startDate: string
}
