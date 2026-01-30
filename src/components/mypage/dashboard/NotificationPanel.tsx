'use client'

/**
 * @fileoverview 通知パネルコンポーネント
 * @module components/mypage/dashboard/NotificationPanel
 *
 * マイページダッシュボードに表示する通知パネル。
 */

import Link from 'next/link'
import type { Notification } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 通知パネルコンポーネントのProps
 */
interface NotificationPanelProps {
  /** 通知一覧 */
  notifications: Notification[]
  /** 未読件数 */
  unreadCount: number
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 通知クリック時のコールバック */
  onNotificationClick?: (notification: Notification) => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * 通知種別のアイコンを取得
 */
function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'billing':
      return '💰'
    case 'campaign':
      return '🎉'
    case 'warning':
      return '⚠️'
    case 'alert':
      return '🔔'
    case 'system':
      return '⚙️'
    case 'info':
    default:
      return 'ℹ️'
  }
}

/**
 * 通知の優先度に応じたスタイルを取得
 */
function getPriorityStyle(priority: Notification['priority']): string {
  switch (priority) {
    case 'high':
      return 'border-l-red-500'
    case 'medium':
      return 'border-l-yellow-500'
    case 'low':
    default:
      return 'border-l-slate-500'
  }
}

/**
 * 通知パネルコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 通知パネル表示
 */
export function NotificationPanel({
  notifications,
  unreadCount,
  isLoading,
  onNotificationClick,
  className,
}: NotificationPanelProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-3">
            <div className="h-16 w-full rounded bg-slate-700" />
            <div className="h-16 w-full rounded bg-slate-700" />
            <div className="h-16 w-full rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">お知らせ</h3>
        {unreadCount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            {unreadCount}件の未読
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-slate-400">お知らせはありません</p>
      ) : (
        <div className="space-y-3">
          {notifications.slice(0, 5).map(notification => (
            <div
              key={notification.notificationId}
              className={cn(
                'cursor-pointer rounded border-l-4 bg-slate-700/50 p-3 transition-colors hover:bg-slate-700',
                getPriorityStyle(notification.priority),
                !notification.isRead && 'bg-slate-700'
              )}
              onClick={() => onNotificationClick?.(notification)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNotificationClick?.(notification)
                }
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm font-medium',
                      notification.isRead ? 'text-slate-300' : 'text-white'
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 5 && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <Link href="/mypage/notifications" className="text-sm text-primary hover:underline">
            すべてのお知らせを見る →
          </Link>
        </div>
      )}
    </div>
  )
}
