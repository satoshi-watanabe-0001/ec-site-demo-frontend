/**
 * @fileoverview MypageSidebarのユニットテスト
 * @module components/layout/mypage/__tests__/sidebar.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MypageSidebar } from '../sidebar'

// Mock next/navigation
const mockPathname = jest.fn().mockReturnValue('/mypage')
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('MypageSidebar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/mypage')
  })

  describe('レンダリング', () => {
    test('MypageSidebar_Render_ShouldDisplayAllNavItems', () => {
      // Arrange & Act
      render(<MypageSidebar />)

      // Assert - Each nav item appears twice (desktop + mobile)
      const dashboardLinks = screen.getAllByText('ダッシュボード')
      expect(dashboardLinks.length).toBeGreaterThanOrEqual(2)

      const contractLinks = screen.getAllByText('契約情報')
      expect(contractLinks.length).toBeGreaterThanOrEqual(2)

      const dataUsageLinks = screen.getAllByText('データ使用量')
      expect(dataUsageLinks.length).toBeGreaterThanOrEqual(2)

      const billingLinks = screen.getAllByText('請求・支払い')
      expect(billingLinks.length).toBeGreaterThanOrEqual(2)

      const settingsLinks = screen.getAllByText('アカウント設定')
      expect(settingsLinks.length).toBeGreaterThanOrEqual(2)

      const planLinks = screen.getAllByText('プラン変更')
      expect(planLinks.length).toBeGreaterThanOrEqual(2)

      const optionsLinks = screen.getAllByText('オプション管理')
      expect(optionsLinks.length).toBeGreaterThanOrEqual(2)
    })

    test('MypageSidebar_Render_ShouldDisplaySidebarTitle', () => {
      render(<MypageSidebar />)
      expect(screen.getByText('マイページ')).toBeInTheDocument()
    })

    test('MypageSidebar_Render_ShouldHaveNavigationAria', () => {
      render(<MypageSidebar />)
      const navs = screen.getAllByRole('navigation', { name: 'マイページナビゲーション' })
      expect(navs).toHaveLength(2) // desktop + mobile
    })
  })

  describe('アクティブ状態', () => {
    test('MypageSidebar_OnDashboard_ShouldHighlightDashboardLink', () => {
      // Arrange
      mockPathname.mockReturnValue('/mypage')

      // Act
      render(<MypageSidebar />)

      // Assert
      const dashboardLinks = screen.getAllByText('ダッシュボード')
      const activeLink = dashboardLinks.find(
        el => el.closest('a')?.getAttribute('aria-current') === 'page'
      )
      expect(activeLink).toBeTruthy()
    })

    test('MypageSidebar_OnContractPage_ShouldHighlightContractLink', () => {
      // Arrange
      mockPathname.mockReturnValue('/mypage/contract')

      // Act
      render(<MypageSidebar />)

      // Assert
      const contractLinks = screen.getAllByText('契約情報')
      const activeLink = contractLinks.find(
        el => el.closest('a')?.getAttribute('aria-current') === 'page'
      )
      expect(activeLink).toBeTruthy()
    })

    test('MypageSidebar_OnBillingPage_ShouldHighlightBillingLink', () => {
      // Arrange
      mockPathname.mockReturnValue('/mypage/billing')

      // Act
      render(<MypageSidebar />)

      // Assert
      const billingLinks = screen.getAllByText('請求・支払い')
      const activeLink = billingLinks.find(
        el => el.closest('a')?.getAttribute('aria-current') === 'page'
      )
      expect(activeLink).toBeTruthy()
    })

    test('MypageSidebar_OnSettingsPage_ShouldNotHighlightDashboard', () => {
      // Arrange
      mockPathname.mockReturnValue('/mypage/settings')

      // Act
      render(<MypageSidebar />)

      // Assert
      const dashboardLinks = screen.getAllByText('ダッシュボード')
      const activeLink = dashboardLinks.find(
        el => el.closest('a')?.getAttribute('aria-current') === 'page'
      )
      expect(activeLink).toBeUndefined()
    })
  })

  describe('リンク', () => {
    test('MypageSidebar_Links_ShouldHaveCorrectHrefs', () => {
      // Arrange & Act
      render(<MypageSidebar />)

      // Assert
      const links = screen.getAllByRole('link')
      const hrefs = links.map(link => link.getAttribute('href'))

      expect(hrefs).toContain('/mypage')
      expect(hrefs).toContain('/mypage/contract')
      expect(hrefs).toContain('/mypage/data-usage')
      expect(hrefs).toContain('/mypage/billing')
      expect(hrefs).toContain('/mypage/settings')
      expect(hrefs).toContain('/mypage/plan')
      expect(hrefs).toContain('/mypage/options')
    })
  })
})
