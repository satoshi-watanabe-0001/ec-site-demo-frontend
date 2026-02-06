/**
 * @fileoverview 通知カードコンポーネント
 * @module components/mypage/NotificationCard
 *
 * お知らせ・通知一覧を表示するカード。
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { NotificationInfo } from '@/types'

interface NotificationCardProps {
  notifications: NotificationInfo[]
  className?: string
}

const categoryLabels: Record<NotificationInfo['category'], string> = {
  system: 'システム',
  campaign: 'キャンペーン',
  billing: '請求',
  contract: '契約',
}

export function NotificationCard({
  notifications,
  className,
}: NotificationCardProps): React.ReactElement {
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">お知らせ</h2>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {unreadCount}件 未読
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">お知らせはありません。</p>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 5).map(notification => (
            <li
              key={notification.id}
              className={cn(
                'p-3 rounded-lg border transition-colors',
                notification.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
              )}
            >
              <div className="flex items-start gap-2">
                {notification.isImportant && (
                  <span className="text-red-500 text-xs font-bold mt-0.5 flex-shrink-0">重要</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">
                      {categoryLabels[notification.category]}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
