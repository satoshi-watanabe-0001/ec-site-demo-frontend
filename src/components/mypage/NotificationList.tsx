/**
 * @fileoverview 通知・お知らせ一覧コンポーネント
 * @module components/mypage/NotificationList
 *
 * ダッシュボードに表示する通知・お知らせ一覧。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, AlertTriangle, Info, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { NotificationList as NotificationListType } from '@/types/notification'

/**
 * 通知一覧コンポーネントのProps型定義
 */
interface NotificationListProps {
  /** 通知一覧 */
  notifications: NotificationListType
}

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  important: <AlertTriangle className="h-4 w-4" />,
  campaign: <Tag className="h-4 w-4" />,
}

const typeVariants: Record<string, 'info' | 'warning' | 'error' | 'success'> = {
  info: 'info',
  warning: 'warning',
  important: 'error',
  campaign: 'success',
}

/**
 * 通知・お知らせ一覧コンポーネント
 *
 * @param props - 通知一覧のプロパティ
 * @returns 通知一覧要素
 */
export function NotificationList({ notifications }: NotificationListProps): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-slate-400" />
        {notifications.unreadCount > 0 && (
          <Badge variant="error">{notifications.unreadCount}件の未読</Badge>
        )}
      </div>

      <div className="space-y-2">
        {notifications.items.slice(0, 3).map(item => {
          const content = (
            <div
              key={item.id}
              className={`rounded-lg p-3 transition-colors ${
                item.isRead ? 'bg-slate-700/50' : 'bg-slate-700 border-l-2 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={item.isRead ? 'text-slate-500' : 'text-blue-400'}>
                  {typeIcons[item.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm truncate ${item.isRead ? 'text-slate-400' : 'font-medium text-white'}`}
                    >
                      {item.title}
                    </p>
                    <Badge variant={typeVariants[item.type]} className="shrink-0 text-[10px]">
                      {item.type === 'important'
                        ? '重要'
                        : item.type === 'campaign'
                          ? 'キャンペーン'
                          : item.type === 'warning'
                            ? '注意'
                            : 'お知らせ'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>
          )

          if (item.linkUrl) {
            return (
              <Link key={item.id} href={item.linkUrl} className="block hover:opacity-80">
                {content}
              </Link>
            )
          }

          return <React.Fragment key={item.id}>{content}</React.Fragment>
        })}
      </div>
    </div>
  )
}
