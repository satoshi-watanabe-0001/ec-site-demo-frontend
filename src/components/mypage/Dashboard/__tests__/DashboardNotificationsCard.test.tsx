/**
 * @fileoverview DashboardNotificationsCardコンポーネントのユニットテスト
 * @module components/mypage/Dashboard/__tests__/DashboardNotificationsCard.test
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardNotificationsCard } from '../DashboardNotificationsCard'

jest.mock('lucide-react', () => ({
  Bell: ({ className }: { className: string }) => (
    <svg data-testid="bell-icon" className={className} />
  ),
}))

describe('DashboardNotificationsCard', () => {
  const mockAnnouncements = [
    { id: '1', title: 'メンテナンスのお知らせ', createdAt: '2026-02-18T00:00:00Z' },
    { id: '2', title: '新プラン開始のご案内', createdAt: '2026-02-15T00:00:00Z' },
  ]

  test('DashboardNotificationsCard_WithUnread_ShouldShowUnreadCount', () => {
    render(
      <DashboardNotificationsCard unreadCount={3} importantAnnouncements={mockAnnouncements} />
    )

    expect(screen.getByText('3件未読')).toBeInTheDocument()
  })

  test('DashboardNotificationsCard_WithZeroUnread_ShouldNotShowBadge', () => {
    render(
      <DashboardNotificationsCard unreadCount={0} importantAnnouncements={mockAnnouncements} />
    )

    expect(screen.queryByText(/件未読/)).not.toBeInTheDocument()
  })

  test('DashboardNotificationsCard_WithAnnouncements_ShouldRenderTitles', () => {
    render(
      <DashboardNotificationsCard unreadCount={2} importantAnnouncements={mockAnnouncements} />
    )

    expect(screen.getByText('メンテナンスのお知らせ')).toBeInTheDocument()
    expect(screen.getByText('新プラン開始のご案内')).toBeInTheDocument()
  })

  test('DashboardNotificationsCard_WithNoAnnouncements_ShouldShowEmptyMessage', () => {
    render(<DashboardNotificationsCard unreadCount={0} importantAnnouncements={[]} />)

    expect(screen.getByText('新しいお知らせはありません')).toBeInTheDocument()
  })

  test('DashboardNotificationsCard_WithDefaultProps_ShouldRenderSectionTitle', () => {
    render(<DashboardNotificationsCard unreadCount={0} importantAnnouncements={[]} />)

    expect(screen.getByText('お知らせ')).toBeInTheDocument()
  })

  test('DashboardNotificationsCard_WithDefaultProps_ShouldHaveTestId', () => {
    render(<DashboardNotificationsCard unreadCount={0} importantAnnouncements={[]} />)

    expect(screen.getByTestId('notifications-card')).toBeInTheDocument()
  })
})
