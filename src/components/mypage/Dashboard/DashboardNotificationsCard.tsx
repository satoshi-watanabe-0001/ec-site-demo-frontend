'use client'

import React from 'react'
import { Bell } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  createdAt: string
}

interface DashboardNotificationsCardProps {
  unreadCount: number
  importantAnnouncements: Announcement[]
}

export function DashboardNotificationsCard({
  unreadCount,
  importantAnnouncements,
}: DashboardNotificationsCardProps): React.ReactElement {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="notifications-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400">お知らせ</h3>
        {unreadCount > 0 && (
          <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Bell className="w-3 h-3" />
            {unreadCount}件未読
          </span>
        )}
      </div>
      <div className="space-y-3">
        {importantAnnouncements.map(announcement => {
          const date = new Date(announcement.createdAt).toLocaleDateString('ja-JP', {
            month: 'long',
            day: 'numeric',
          })
          return (
            <div
              key={announcement.id}
              className="border-l-2 border-teal-500 pl-3 py-1"
            >
              <p className="text-sm text-white">{announcement.title}</p>
              <p className="text-xs text-slate-500">{date}</p>
            </div>
          )
        })}
        {importantAnnouncements.length === 0 && (
          <p className="text-sm text-slate-500">新しいお知らせはありません</p>
        )}
      </div>
    </div>
  )
}
