/**
 * @fileoverview アカウント管理APIクライアント
 * @module services/accountService
 *
 * アカウント管理関連のAPIサービス。
 * ダッシュボード情報取得、アカウント設定更新を提供。
 */

import type { ContractInfo } from '@/types/contract'
import type { DataUsage } from '@/types/data-usage'
import type { BillingInfo, PaymentMethod } from '@/types/billing'
import type { NotificationList } from '@/types/notification'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 端末情報
 */
export interface DeviceInfoData {
  /** 端末名 */
  name: string
  /** 端末画像URL */
  imageUrl: string
  /** 購入日 */
  purchaseDate: string
  /** 支払い状況 */
  paymentStatus: string
  /** 残債額（税込） */
  remainingBalance: number
  /** 支払い回数（残り） */
  remainingInstallments: number
}

/**
 * ダッシュボード情報レスポンス
 */
export interface DashboardResponse {
  /** 契約情報サマリー */
  contract: ContractInfo
  /** データ使用状況 */
  dataUsage: DataUsage
  /** 請求予定額 */
  billing: BillingInfo
  /** 端末情報 */
  device: DeviceInfoData
  /** 通知・お知らせ */
  notifications: NotificationList
  /** 支払い方法 */
  paymentMethod: PaymentMethod
}

/**
 * アカウント設定
 */
export interface AccountSettings {
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
  /** 通知設定 */
  notificationPreferences: {
    /** メール通知 */
    email: boolean
    /** SMS通知 */
    sms: boolean
    /** プッシュ通知 */
    push: boolean
  }
}

/**
 * アカウント設定更新リクエスト
 */
export interface UpdateSettingsRequest {
  /** メールアドレス */
  email?: string
  /** 電話番号 */
  phoneNumber?: string
  /** パスワード変更 */
  password?: {
    /** 現在のパスワード */
    current: string
    /** 新しいパスワード */
    newPassword: string
  }
  /** 通知設定 */
  notificationPreferences?: {
    email?: boolean
    sms?: boolean
    push?: boolean
  }
}

/**
 * ダッシュボード情報を取得
 *
 * @param token - 認証トークン
 * @returns ダッシュボード情報
 */
export async function getDashboard(token: string): Promise<DashboardResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('ダッシュボード情報の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('ダッシュボード情報取得エラー:', error)
    throw error
  }
}

/**
 * アカウント設定を取得
 *
 * @param token - 認証トークン
 * @returns アカウント設定
 */
export async function getAccountSettings(token: string): Promise<AccountSettings> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('アカウント設定の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('アカウント設定取得エラー:', error)
    throw error
  }
}

/**
 * アカウント設定を更新
 *
 * @param token - 認証トークン
 * @param settings - 更新するアカウント設定
 * @returns 更新後のアカウント設定
 */
export async function updateAccountSettings(
  token: string,
  settings: UpdateSettingsRequest
): Promise<AccountSettings> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/settings`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      throw new Error('アカウント設定の更新に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('アカウント設定更新エラー:', error)
    throw error
  }
}
