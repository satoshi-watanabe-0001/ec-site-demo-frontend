/**
 * @fileoverview 通知関連の型定義
 * @module types/notification
 *
 * 通知・お知らせに関する型定義。
 * アカウント管理APIとの通信で使用される。
 */

/**
 * 通知アイテム
 */
export interface NotificationItem {
  /** 通知ID */
  id: string
  /** タイトル */
  title: string
  /** 本文 */
  body: string
  /** 通知種別 */
  type: 'info' | 'warning' | 'important' | 'campaign'
  /** 既読かどうか */
  isRead: boolean
  /** 作成日時（ISO 8601形式） */
  createdAt: string
  /** リンクURL（オプション） */
  linkUrl: string | null
}

/**
 * 通知一覧
 */
export interface NotificationList {
  /** 未読件数 */
  unreadCount: number
  /** 通知一覧 */
  items: NotificationItem[]
}
