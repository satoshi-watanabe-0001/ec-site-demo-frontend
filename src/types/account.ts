/**
 * @fileoverview アカウント関連の型定義
 * @module types/account
 *
 * アカウント情報、プロファイル、設定に関する型を定義。
 * マイページのアカウント管理機能で使用される。
 */

/**
 * アカウントプロファイル情報
 */
export interface AccountProfile {
  /** ユーザーID */
  userId: string
  /** 氏名 */
  name: string
  /** フリガナ */
  nameKana: string
  /** メールアドレス */
  email: string
  /** 電話番号 */
  phoneNumber: string
  /** 生年月日（YYYY-MM-DD形式） */
  birthDate: string
  /** 郵便番号 */
  postalCode: string
  /** 住所 */
  address: string
  /** 登録日時 */
  registeredAt: string
  /** 最終更新日時 */
  updatedAt: string
}

/**
 * アカウントプロファイル更新リクエスト
 */
export interface UpdateAccountProfileRequest {
  /** 氏名 */
  name?: string
  /** フリガナ */
  nameKana?: string
  /** メールアドレス */
  email?: string
  /** 電話番号 */
  phoneNumber?: string
  /** 郵便番号 */
  postalCode?: string
  /** 住所 */
  address?: string
}

/**
 * パスワード変更リクエスト
 */
export interface ChangePasswordRequest {
  /** 現在のパスワード */
  currentPassword: string
  /** 新しいパスワード */
  newPassword: string
  /** 新しいパスワード（確認用） */
  confirmPassword: string
}

/**
 * パスワード変更レスポンス
 */
export interface ChangePasswordResponse {
  /** 成功フラグ */
  success: boolean
  /** メッセージ */
  message: string
}

/**
 * メール通知設定
 */
export interface EmailNotificationSettings {
  /** 請求通知 */
  billing: boolean
  /** キャンペーン通知 */
  campaign: boolean
  /** サービス通知 */
  service: boolean
  /** メンテナンス通知 */
  maintenance: boolean
}

/**
 * プッシュ通知設定
 */
export interface PushNotificationSettings {
  /** 請求通知 */
  billing: boolean
  /** キャンペーン通知 */
  campaign: boolean
  /** データ使用量通知 */
  dataUsage: boolean
}

/**
 * SMS通知設定
 */
export interface SmsNotificationSettings {
  /** セキュリティ通知 */
  security: boolean
  /** 請求通知 */
  billing: boolean
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  /** メール通知設定 */
  email: EmailNotificationSettings
  /** プッシュ通知設定 */
  push: PushNotificationSettings
  /** SMS通知設定 */
  sms: SmsNotificationSettings
}

/**
 * アカウントAPIエラーレスポンス
 */
export interface AccountErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
