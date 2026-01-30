/**
 * @fileoverview 通知管理用MSWハンドラー
 * @module mocks/handlers/notificationHandlers
 *
 * 通知情報、既読管理のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  Notification,
  NotificationsResponse,
  MarkNotificationReadRequest,
  MarkNotificationReadResponse,
} from '@/types'

/**
 * モック用通知データ
 */
const mockNotifications: Notification[] = [
  {
    notificationId: 'notif-001',
    type: 'billing',
    priority: 'high',
    title: '請求金額確定のお知らせ',
    message: '2025年1月分の請求金額が確定しました。',
    detailUrl: '/mypage/billing',
    isRead: false,
    createdAt: '2025-01-25T09:00:00Z',
  },
  {
    notificationId: 'notif-002',
    type: 'campaign',
    priority: 'medium',
    title: '新機種発売キャンペーン',
    message: 'iPhone 16シリーズ発売記念キャンペーン実施中！',
    detailUrl: '/campaigns/iphone16',
    isRead: false,
    createdAt: '2025-01-20T10:00:00Z',
    expiresAt: '2025-02-28T23:59:59Z',
  },
  {
    notificationId: 'notif-003',
    type: 'info',
    priority: 'low',
    title: 'メンテナンスのお知らせ',
    message: '2025年2月1日 2:00〜5:00にシステムメンテナンスを実施します。',
    isRead: true,
    createdAt: '2025-01-15T14:00:00Z',
  },
  {
    notificationId: 'notif-004',
    type: 'warning',
    priority: 'high',
    title: 'データ使用量のお知らせ',
    message: '今月のデータ使用量が80%を超えました。',
    detailUrl: '/mypage/data-usage',
    isRead: true,
    createdAt: '2025-01-10T08:30:00Z',
  },
  {
    notificationId: 'notif-005',
    type: 'system',
    priority: 'medium',
    title: 'アプリアップデートのお知らせ',
    message: '新しいバージョンが利用可能です。',
    isRead: true,
    createdAt: '2025-01-05T12:00:00Z',
  },
]

/**
 * 通知管理用MSWハンドラー
 */
export const notificationHandlers = [
  // 通知一覧取得
  http.get('*/api/v1/notifications', () => {
    const unreadCount = mockNotifications.filter(n => !n.isRead).length
    const response: NotificationsResponse = {
      notifications: mockNotifications,
      unreadCount,
      totalCount: mockNotifications.length,
    }
    return HttpResponse.json(response)
  }),

  // 通知既読
  http.put('*/api/v1/notifications/read', async ({ request }) => {
    const body = (await request.json()) as MarkNotificationReadRequest

    if (body.notificationId) {
      const notification = mockNotifications.find(n => n.notificationId === body.notificationId)
      if (notification) {
        notification.isRead = true
      }
    } else {
      mockNotifications.forEach(n => {
        n.isRead = true
      })
    }

    const unreadCount = mockNotifications.filter(n => !n.isRead).length
    const response: MarkNotificationReadResponse = {
      success: true,
      unreadCount,
    }

    return HttpResponse.json(response)
  }),
]
