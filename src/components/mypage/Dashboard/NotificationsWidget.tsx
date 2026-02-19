/**
 * @fileoverview 通知ウィジェットコンポーネント
 * @module components/mypage/Dashboard/NotificationsWidget
 */

'use client'

import React from 'react'
import type { Notification } from '@/types'

interface NotificationsWidgetProps {
  notifications: Notification[]
  unreadCount: number
}

export function NotificationsWidget({ notifications, unreadCount }: NotificationsWidgetProps): React.ReactElement {
  const getTypeIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'important':
        return '📢'
      default:
        return 'ℹ️'
    }
  }

  const getTypeBadgeClass = (type: Notification['type']): string => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'important':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-blue-500/20 text-blue-400'
    }
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">お知らせ</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-colors ${
              notification.isRead
                ? 'border-slate-600 bg-slate-700/50'
                : 'border-cyan-500/30 bg-cyan-500/5'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{getTypeIcon(notification.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadgeClass(notification.type)}`}>
                    {notification.type === 'warning' ? '注意' : notification.type === 'important' ? '重要' : 'お知らせ'}
                  </span>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                  )}
                </div>
                <p className="text-sm text-white font-medium truncate">{notification.title}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
