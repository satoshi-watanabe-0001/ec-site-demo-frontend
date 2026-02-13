/**
 * @fileoverview NotificationCardコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/NotificationCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { NotificationCard } from '../NotificationCard'
import type { NotificationInfo } from '@/types'

const mockNotifications: NotificationInfo = {
  unreadCount: 2,
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量のお知らせ',
      message: '今月のデータ使用量が70%に達しました。',
      date: '2025-01-20',
      isRead: false,
      type: 'warning',
    },
    {
      id: 'notif-002',
      title: 'メンテナンスのお知らせ',
      message: 'システムメンテナンスを実施予定です。',
      date: '2025-01-18',
      isRead: true,
      type: 'info',
    },
    {
      id: 'notif-003',
      title: '重要なお知らせ',
      message: '利用規約が更新されました。',
      date: '2025-01-15',
      isRead: false,
      type: 'important',
    },
  ],
}

describe('NotificationCard', () => {
  describe('レンダリング', () => {
    test('NotificationCard_WithNotifications_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('通知・お知らせ')).toBeInTheDocument()
    })

    test('NotificationCard_WithUnreadCount_ShouldRenderBadge', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('2件 未読')).toBeInTheDocument()
    })

    test('NotificationCard_WithZeroUnread_ShouldNotRenderBadge', () => {
      // Arrange
      const noUnread: NotificationInfo = {
        unreadCount: 0,
        notifications: mockNotifications.notifications,
      }

      // Act
      render(<NotificationCard notifications={noUnread} />)

      // Assert
      expect(screen.queryByText(/未読/)).not.toBeInTheDocument()
    })
  })

  describe('通知一覧', () => {
    test('NotificationCard_WithNotifications_ShouldRenderNotificationTitles', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('データ使用量のお知らせ')).toBeInTheDocument()
      expect(screen.getByText('メンテナンスのお知らせ')).toBeInTheDocument()
      expect(screen.getByText('重要なお知らせ')).toBeInTheDocument()
    })

    test('NotificationCard_WithNotifications_ShouldRenderNotificationMessages', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('今月のデータ使用量が70%に達しました。')).toBeInTheDocument()
    })
  })

  describe('通知タイプラベル', () => {
    test('NotificationCard_WithWarningType_ShouldRenderWarningLabel', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('注意')).toBeInTheDocument()
    })

    test('NotificationCard_WithInfoType_ShouldRenderInfoLabel', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('お知らせ')).toBeInTheDocument()
    })

    test('NotificationCard_WithImportantType_ShouldRenderImportantLabel', () => {
      // Arrange & Act
      render(<NotificationCard notifications={mockNotifications} />)

      // Assert
      expect(screen.getByText('重要')).toBeInTheDocument()
    })
  })
})
