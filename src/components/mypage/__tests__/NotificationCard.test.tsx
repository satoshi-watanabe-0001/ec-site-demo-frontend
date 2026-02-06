/**
 * @fileoverview NotificationCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/NotificationCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { NotificationCard } from '../NotificationCard'
import type { NotificationInfo } from '@/types'

const mockNotifications: NotificationInfo[] = [
  {
    id: 'notif-001',
    title: 'データ使用量が80%に達しました',
    message: '当月のデータ使用量が80%に達しました。',
    createdAt: '2024-01-14T09:00:00Z',
    isRead: false,
    isImportant: true,
    category: 'system',
  },
  {
    id: 'notif-002',
    title: '新キャンペーンのお知らせ',
    message: '期間限定キャンペーンを実施中です。',
    createdAt: '2024-01-13T09:00:00Z',
    isRead: true,
    isImportant: false,
    category: 'campaign',
  },
  {
    id: 'notif-003',
    title: '請求確定のお知らせ',
    message: '12月分の請求が確定しました。',
    createdAt: '2024-01-10T09:00:00Z',
    isRead: false,
    isImportant: false,
    category: 'billing',
  },
]

describe('NotificationCard', () => {
  test('NotificationCard_WithNotifications_ShouldDisplayTitle', () => {
    render(<NotificationCard notifications={mockNotifications} />)

    expect(screen.getByText('お知らせ')).toBeInTheDocument()
  })

  test('NotificationCard_WithUnread_ShouldDisplayUnreadCount', () => {
    render(<NotificationCard notifications={mockNotifications} />)

    expect(screen.getByText('2件 未読')).toBeInTheDocument()
  })

  test('NotificationCard_WithAllRead_ShouldNotDisplayUnreadBadge', () => {
    const allRead = mockNotifications.map(n => ({ ...n, isRead: true }))
    render(<NotificationCard notifications={allRead} />)

    expect(screen.queryByText(/未読/)).not.toBeInTheDocument()
  })

  test('NotificationCard_WithNotifications_ShouldDisplayNotificationTitles', () => {
    render(<NotificationCard notifications={mockNotifications} />)

    expect(screen.getByText('データ使用量が80%に達しました')).toBeInTheDocument()
    expect(screen.getByText('新キャンペーンのお知らせ')).toBeInTheDocument()
    expect(screen.getByText('請求確定のお知らせ')).toBeInTheDocument()
  })

  test('NotificationCard_WithImportant_ShouldDisplayImportantLabel', () => {
    render(<NotificationCard notifications={mockNotifications} />)

    expect(screen.getByText('重要')).toBeInTheDocument()
  })

  test('NotificationCard_WithCategoryLabels_ShouldDisplayCategories', () => {
    render(<NotificationCard notifications={mockNotifications} />)

    expect(screen.getByText('システム')).toBeInTheDocument()
    expect(screen.getByText('キャンペーン')).toBeInTheDocument()
    expect(screen.getByText('請求')).toBeInTheDocument()
  })

  test('NotificationCard_WithEmptyList_ShouldDisplayNoNotificationMessage', () => {
    render(<NotificationCard notifications={[]} />)

    expect(screen.getByText('お知らせはありません。')).toBeInTheDocument()
  })

  test('NotificationCard_WithClassName_ShouldApplyClassName', () => {
    const { container } = render(
      <NotificationCard notifications={mockNotifications} className="custom" />
    )

    expect(container.firstChild).toHaveClass('custom')
  })
})
