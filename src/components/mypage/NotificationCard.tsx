/**
 * @fileoverview 通知カードコンポーネント
 * @module components/mypage/NotificationCard
 *
 * 通知一覧を表示するカード。
 */

'use client'

import React from 'react'
import type { Notification } from '@/types'

/**
 * 通知種別に対応するスタイル
 */
const notificationStyles: Record<Notification['type'], { icon: string; color: string }> = {
  info: { icon: 'ℹ️', color: 'text-blue-400' },
  warning: { icon: '⚠️', color: 'text-yellow-400' },
  campaign: { icon: '🎉', color: 'text-emerald-400' },
  system: { icon: '🔧', color: 'text-slate-400' },
}

/**
 * NotificationCardコンポーネントのProps
 */
interface NotificationCardProps {
  /** 通知一覧 */
  notifications: Notification[]
  /** 未読数 */
  unreadCount: number
}

/**
 * 通知カードコンポーネント
 *
 * @param props - コンポーネントのProps
 * @returns 通知カード要素
 */
export function NotificationCard({
  notifications,
  unreadCount,
}: NotificationCardProps): React.ReactElement {
  return (
    <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">お知らせ</h3>
        {unreadCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
            {unreadCount}件の未読
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map(notification => {
          const style = notificationStyles[notification.type]
          return (
            <div
              key={notification.id}
              className={`rounded-md border p-3 ${
                notification.isRead
                  ? 'border-slate-700 bg-slate-800/50'
                  : 'border-slate-600 bg-slate-700/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">
                  {style.icon}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${notification.isRead ? 'text-slate-300' : 'text-white'}`}
                  >
                    {notification.title}
                    {!notification.isRead && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{notification.body}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
