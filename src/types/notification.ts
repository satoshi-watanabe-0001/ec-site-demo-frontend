/**
 * @fileoverview 通知関連の型定義
 * @module types/notification
 *
 * 通知、アラートに関する型を定義。
 * マイページの通知表示機能で使用される。
 */

/**
 * 通知種別
 */
export type NotificationType = 'info' | 'warning' | 'alert' | 'campaign' | 'billing' | 'system'

/**
 * 通知優先度
 */
export type NotificationPriority = 'low' | 'medium' | 'high'

/**
 * 通知情報
 */
export interface Notification {
  /** 通知ID */
  notificationId: string
  /** 通知種別 */
  type: NotificationType
  /** 優先度 */
  priority: NotificationPriority
  /** タイトル */
  title: string
  /** メッセージ */
  message: string
  /** 詳細URL（省略可） */
  detailUrl?: string
  /** 既読フラグ */
  isRead: boolean
  /** 作成日時 */
  createdAt: string
  /** 有効期限 */
  expiresAt?: string
}

/**
 * 通知一覧レスポンス
 */
export interface NotificationsResponse {
  /** 通知一覧 */
  notifications: Notification[]
  /** 未読件数 */
  unreadCount: number
  /** 総件数 */
  totalCount: number
}

/**
 * 通知既読リクエスト
 */
export interface MarkNotificationReadRequest {
  /** 通知ID（省略時は全件既読） */
  notificationId?: string
}

/**
 * 通知既読レスポンス
 */
export interface MarkNotificationReadResponse {
  /** 成功フラグ */
  success: boolean
  /** 更新後の未読件数 */
  unreadCount: number
}

/**
 * 通知APIエラーレスポンス
 */
export interface NotificationErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
