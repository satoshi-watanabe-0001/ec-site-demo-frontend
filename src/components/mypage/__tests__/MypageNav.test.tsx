/**
 * @fileoverview MypageNavコンポーネントのユニットテスト
 * @module components/mypage/__tests__/MypageNav.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MypageNav } from '../MypageNav'

// Mock next/navigation
const mockUsePathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('MypageNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/mypage')
  })

  describe('レンダリング', () => {
    test('MypageNav_WithDefaultState_ShouldRenderNavigation', () => {
      // Arrange & Act
      render(<MypageNav />)

      // Assert
      expect(screen.getByLabelText('マイページナビゲーション')).toBeInTheDocument()
    })

    test('MypageNav_WithDefaultState_ShouldRenderAllNavItems', () => {
      // Arrange & Act
      render(<MypageNav />)

      // Assert - デスクトップ・モバイル両方のリンクが存在するため getAllByText を使用
      expect(screen.getAllByText('ダッシュボード').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('契約情報').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('データ使用量').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('請求・支払い').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('プラン変更').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('オプション管理').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('アカウント設定').length).toBeGreaterThanOrEqual(1)
    })

    test('MypageNav_WithDefaultState_ShouldRenderCorrectLinks', () => {
      // Arrange & Act
      render(<MypageNav />)

      // Assert
      const links = screen.getAllByRole('link')
      const hrefs = links.map(link => link.getAttribute('href'))
      expect(hrefs).toContain('/mypage')
      expect(hrefs).toContain('/mypage/contract')
      expect(hrefs).toContain('/mypage/data-usage')
      expect(hrefs).toContain('/mypage/billing')
      expect(hrefs).toContain('/mypage/plan-change')
      expect(hrefs).toContain('/mypage/options')
      expect(hrefs).toContain('/mypage/settings')
    })
  })

  describe('モバイルメニュー', () => {
    test('MypageNav_WithMobileMenu_ShouldToggleOnClick', () => {
      // Arrange
      render(<MypageNav />)
      const menuButton = screen.getByLabelText('メニューを開く')

      // Act
      fireEvent.click(menuButton)

      // Assert
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    test('MypageNav_WithMobileMenuOpen_ShouldCloseOnSecondClick', () => {
      // Arrange
      render(<MypageNav />)
      const menuButton = screen.getByLabelText('メニューを開く')

      // Act
      fireEvent.click(menuButton) // open
      fireEvent.click(menuButton) // close

      // Assert
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('MypageNav_WithActiveRoute_ShouldShowActiveLabel', () => {
      // Arrange
      mockUsePathname.mockReturnValue('/mypage/billing')

      // Act
      render(<MypageNav />)

      // Assert - モバイルメニューボタンにアクティブなラベルが表示される
      const menuButton = screen.getByLabelText('メニューを開く')
      expect(menuButton).toHaveTextContent('請求・支払い')
    })
  })

  describe('アクティブ状態', () => {
    test('MypageNav_WhenOnDashboard_ShouldHighlightDashboard', () => {
      // Arrange
      mockUsePathname.mockReturnValue('/mypage')

      // Act
      render(<MypageNav />)

      // Assert - ダッシュボードリンクがアクティブスタイルを持つ
      const dashboardLinks = screen.getAllByText('ダッシュボード')
      const desktopLink = dashboardLinks.find(link => link.closest('a'))
      expect(desktopLink?.closest('a')).toHaveClass('text-primary')
    })

    test('MypageNav_WhenOnContract_ShouldHighlightContract', () => {
      // Arrange
      mockUsePathname.mockReturnValue('/mypage/contract')

      // Act
      render(<MypageNav />)

      // Assert
      const contractLinks = screen.getAllByText('契約情報')
      const activeLink = contractLinks.find(
        link => link.closest('a')?.classList.contains('text-primary')
      )
      expect(activeLink).toBeTruthy()
    })
  })
})
