/**
 * @fileoverview 通知カードコンポーネント
 * @module components/mypage/dashboard/NotificationCard
 *
 * 未読通知件数・お知らせ一覧を表示するカード。
 */

'use client'

import React from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { NotificationInfo } from '@/types'
import { cn } from '@/lib/utils'

interface NotificationCardProps {
  notifications: NotificationInfo
}

export function NotificationCard({
  notifications,
}: NotificationCardProps): React.ReactElement {
  const getTypeStyle = (type: 'info' | 'warning' | 'important'): string => {
    switch (type) {
      case 'important':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    }
  }

  const getTypeLabel = (type: 'info' | 'warning' | 'important'): string => {
    switch (type) {
      case 'important':
        return '重要'
      case 'warning':
        return '注意'
      default:
        return 'お知らせ'
    }
  }

  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">通知・お知らせ</h2>
        {notifications.unreadCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {notifications.unreadCount}件 未読
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.notifications.slice(0, 5).map(notification => (
          <div
            key={notification.id}
            className={cn(
              'rounded-lg border p-3',
              notification.isRead ? 'border-slate-700 bg-slate-700/30' : 'border-slate-600 bg-slate-700/60'
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex rounded px-1.5 py-0.5 text-xs font-medium',
                  getTypeStyle(notification.type)
                )}
              >
                {getTypeLabel(notification.type)}
              </span>
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
              <span className="ml-auto text-xs text-slate-500">
                {format(new Date(notification.date), 'M月d日', { locale: ja })}
              </span>
            </div>
            <p className="text-sm font-medium text-white">{notification.title}</p>
            <p className="mt-1 text-xs text-slate-400">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
