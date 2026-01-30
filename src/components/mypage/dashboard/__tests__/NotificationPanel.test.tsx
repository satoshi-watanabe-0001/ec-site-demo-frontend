/**
 * @fileoverview NotificationPanelコンポーネントのユニットテスト
 * @module components/mypage/dashboard/__tests__/NotificationPanel.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationPanel } from '../NotificationPanel'
import type { Notification } from '@/types'

describe('NotificationPanel', () => {
  const mockNotifications: Notification[] = [
    {
      notificationId: 'notif-001',
      title: '請求確定のお知らせ',
      message: '1月分の請求が確定しました。',
      type: 'billing',
      priority: 'medium',
      isRead: false,
      createdAt: '2025-01-27T10:00:00Z',
    },
    {
      notificationId: 'notif-002',
      title: 'キャンペーンのお知らせ',
      message: '新しいキャンペーンが始まりました。',
      type: 'campaign',
      priority: 'low',
      isRead: true,
      createdAt: '2025-01-26T10:00:00Z',
    },
  ]

  describe('レンダリング', () => {
    test('NotificationPanel_WithNotifications_ShouldRenderNotificationList', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={mockNotifications} unreadCount={1} />)

      // Assert
      expect(screen.getByText('お知らせ')).toBeInTheDocument()
      expect(screen.getByText('請求確定のお知らせ')).toBeInTheDocument()
      expect(screen.getByText('キャンペーンのお知らせ')).toBeInTheDocument()
    })

    test('NotificationPanel_WithNotifications_ShouldRenderNotificationMessages', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={mockNotifications} unreadCount={1} />)

      // Assert
      expect(screen.getByText('1月分の請求が確定しました。')).toBeInTheDocument()
      expect(screen.getByText('新しいキャンペーンが始まりました。')).toBeInTheDocument()
    })
  })

  describe('未読件数表示', () => {
    test('NotificationPanel_WithUnreadCount_ShouldShowUnreadBadge', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={mockNotifications} unreadCount={3} />)

      // Assert
      expect(screen.getByText('3件の未読')).toBeInTheDocument()
    })

    test('NotificationPanel_WithZeroUnreadCount_ShouldNotShowUnreadBadge', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={mockNotifications} unreadCount={0} />)

      // Assert
      expect(screen.queryByText(/件の未読/)).not.toBeInTheDocument()
    })
  })

  describe('空の通知リスト', () => {
    test('NotificationPanel_WithEmptyNotifications_ShouldShowEmptyMessage', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={[]} unreadCount={0} />)

      // Assert
      expect(screen.getByText('お知らせはありません')).toBeInTheDocument()
    })
  })

  describe('通知クリック', () => {
    test('NotificationPanel_WhenNotificationClicked_ShouldCallOnNotificationClick', () => {
      // Arrange
      const handleClick = jest.fn()
      render(
        <NotificationPanel
          notifications={mockNotifications}
          unreadCount={1}
          onNotificationClick={handleClick}
        />
      )

      // Act
      fireEvent.click(screen.getByText('請求確定のお知らせ'))

      // Assert
      expect(handleClick).toHaveBeenCalledWith(mockNotifications[0])
    })

    test('NotificationPanel_WhenEnterKeyPressed_ShouldCallOnNotificationClick', () => {
      // Arrange
      const handleClick = jest.fn()
      render(
        <NotificationPanel
          notifications={mockNotifications}
          unreadCount={1}
          onNotificationClick={handleClick}
        />
      )

      // Act
      const notificationElement = screen.getByText('請求確定のお知らせ').closest('[role="button"]')
      fireEvent.keyDown(notificationElement!, { key: 'Enter' })

      // Assert
      expect(handleClick).toHaveBeenCalledWith(mockNotifications[0])
    })
  })

  describe('ローディング状態', () => {
    test('NotificationPanel_WhenLoading_ShouldShowLoadingState', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={[]} unreadCount={0} isLoading={true} />)

      // Assert
      expect(screen.queryByText('お知らせ')).not.toBeInTheDocument()
      expect(screen.queryByText('お知らせはありません')).not.toBeInTheDocument()
    })
  })

  describe('すべて表示リンク', () => {
    test('NotificationPanel_WithMoreThan5Notifications_ShouldShowViewAllLink', () => {
      // Arrange
      const manyNotifications: Notification[] = Array.from({ length: 6 }, (_, i) => ({
        notificationId: `notif-${i}`,
        title: `通知 ${i + 1}`,
        message: `メッセージ ${i + 1}`,
        type: 'info' as const,
        priority: 'low' as const,
        isRead: false,
        createdAt: '2025-01-27T10:00:00Z',
      }))

      // Act
      render(<NotificationPanel notifications={manyNotifications} unreadCount={6} />)

      // Assert
      expect(screen.getByText('すべてのお知らせを見る →')).toBeInTheDocument()
    })

    test('NotificationPanel_With5OrFewerNotifications_ShouldNotShowViewAllLink', () => {
      // Arrange & Act
      render(<NotificationPanel notifications={mockNotifications} unreadCount={1} />)

      // Assert
      expect(screen.queryByText('すべてのお知らせを見る →')).not.toBeInTheDocument()
    })
  })
})
