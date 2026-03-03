/**
 * @fileoverview アカウント関連の型定義
 * @module types/account
 *
 * ユーザープロフィール、契約情報、通知設定など
 * アカウント管理に関する型定義。
 */

/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  /** ユーザーID */
  id: string
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
  /** 生年月日 */
  dateOfBirth: string
  /** 住所 */
  address: UserAddress
  /** 登録日 */
  registeredAt: string
  /** 最終更新日 */
  updatedAt: string
}

/**
 * ユーザー住所情報
 */
export interface UserAddress {
  /** 郵便番号 */
  postalCode: string
  /** 都道府県 */
  prefecture: string
  /** 市区町村 */
  city: string
  /** 番地 */
  street: string
  /** 建物名・部屋番号 */
  building?: string
}

/**
 * プロフィール更新リクエスト
 */
export interface UpdateProfileRequest {
  /** ユーザー名 */
  name?: string
  /** 電話番号 */
  phoneNumber?: string
  /** 住所 */
  address?: Partial<UserAddress>
}

/**
 * パスワード変更リクエスト
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
  /** 新しいパスワード（確認） */
  confirmPassword: string
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  /** メール通知 */
  emailNotification: boolean
  /** SMS通知 */
  smsNotification: boolean
  /** プッシュ通知 */
  pushNotification: boolean
  /** キャンペーン情報の受信 */
  campaignInfo: boolean
  /** 請求通知 */
  billingNotification: boolean
  /** データ使用量アラート */
  dataUsageAlert: boolean
  /** データ使用量アラートの閾値（%） */
  dataUsageAlertThreshold: number
}

/**
 * 通知情報
 */
export interface Notification {
  /** 通知ID */
  id: string
  /** 通知タイトル */
  title: string
  /** 通知本文 */
  message: string
  /** 通知種別 */
  type: NotificationType
  /** 既読フラグ */
  isRead: boolean
  /** 通知日時 */
  createdAt: string
  /** リンクURL */
  linkUrl?: string
}

/**
 * 通知種別
 */
export type NotificationType = 'info' | 'warning' | 'billing' | 'campaign' | 'system'

/**
 * 通知一覧レスポンス
 */
export interface NotificationsResponse {
  /** 通知リスト */
  notifications: Notification[]
  /** 未読件数 */
  unreadCount: number
  /** 総件数 */
  totalCount: number
}

/**
 * APIの共通成功レスポンス
 */
export interface ApiSuccessResponse {
  /** ステータス */
  status: 'success'
  /** メッセージ */
  message: string
}

/**
 * APIの共通エラーレスポンス
 */
export interface ApiErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** エラーコード */
  errorCode?: string
  /** タイムスタンプ */
  timestamp: string
}
