/**
 * @fileoverview NotificationsWidgetコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/NotificationsWidget.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { NotificationsWidget } from '../NotificationsWidget'
import type { Notification } from '@/types'

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'データ使用量が80%を超えました',
    message: '今月のデータ使用量が80%を超えました。',
    type: 'warning',
    isRead: false,
    createdAt: '2026-02-19T10:00:00Z',
  },
  {
    id: 'n2',
    title: 'システムメンテナンスのお知らせ',
    message: '2月25日にシステムメンテナンスを実施します。',
    type: 'important',
    isRead: false,
    createdAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'n3',
    title: 'ご利用ありがとうございます',
    message: 'ahamoをご利用いただきありがとうございます。',
    type: 'info',
    isRead: true,
    createdAt: '2026-02-17T08:00:00Z',
  },
]

describe('NotificationsWidget', () => {
  test('NotificationsWidget_WithNotifications_ShouldRenderSectionTitle', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('お知らせ')
  })

  test('NotificationsWidget_WithUnreadCount_ShouldRenderBadge', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('NotificationsWidget_WithZeroUnread_ShouldNotRenderBadge', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={0} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  test('NotificationsWidget_WithNotifications_ShouldRenderAllTitles', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    expect(screen.getByText('データ使用量が80%を超えました')).toBeInTheDocument()
    expect(screen.getByText('システムメンテナンスのお知らせ')).toBeInTheDocument()
    expect(screen.getByText('ご利用ありがとうございます')).toBeInTheDocument()
  })

  test('NotificationsWidget_WithWarningType_ShouldRenderWarningLabel', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    expect(screen.getByText('注意')).toBeInTheDocument()
  })

  test('NotificationsWidget_WithImportantType_ShouldRenderImportantLabel', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    expect(screen.getByText('重要')).toBeInTheDocument()
  })

  test('NotificationsWidget_WithInfoType_ShouldRenderInfoLabel', () => {
    render(<NotificationsWidget notifications={mockNotifications} unreadCount={2} />)

    const badges = screen.getAllByText('お知らせ')
    const spanBadge = badges.find(
      el => el.tagName === 'SPAN' && el.className.includes('rounded-full')
    )
    expect(spanBadge).toBeDefined()
  })

  test('NotificationsWidget_WithEmptyNotifications_ShouldRenderTitle', () => {
    render(<NotificationsWidget notifications={[]} unreadCount={0} />)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('お知らせ')
  })
})
