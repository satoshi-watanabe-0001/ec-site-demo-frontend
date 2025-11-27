/**
 * @fileoverview Headerコンポーネントのユニットテスト
 * @module components/layout/header/__tests__/header.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../header'

// usePathname をモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

// useAuthStore をモック
jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({ isAuthenticated: false }),
}))

describe('Header', () => {
  describe('レンダリング', () => {
    test('Header_WithDefaultProps_ShouldRenderHeaderElement', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    test('Header_WithDefaultProps_ShouldRenderLogo', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      expect(screen.getByText('ahamo')).toBeInTheDocument()
    })

    test('Header_WithDefaultProps_ShouldRenderNavigation', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    test('Header_WithDefaultProps_ShouldRenderSearchButton', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      expect(screen.getByRole('button', { name: '検索を開く' })).toBeInTheDocument()
    })

    test('Header_WithDefaultProps_ShouldRenderHamburgerMenuButton', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      expect(screen.getByRole('button', { name: /メニューを(開く|閉じる)/ })).toBeInTheDocument()
    })
  })

  describe('ハンバーガーメニュー', () => {
    test('Header_WhenHamburgerClicked_ShouldOpenMobileMenu', () => {
      // Arrange
      render(<Header />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('Header_WhenMenuOpen_ShouldShowCloseButton', () => {
      // Arrange
      render(<Header />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))

      // Assert
      expect(screen.getByRole('button', { name: 'メニューを閉じる' })).toBeInTheDocument()
    })

    test('Header_WhenCloseButtonClicked_ShouldCloseMobileMenu', () => {
      // Arrange
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'メニューを閉じる' }))

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('Header_WhenEscapePressed_ShouldCloseMobileMenu', () => {
      // Arrange
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))

      // Act
      fireEvent.keyDown(document, { key: 'Escape' })

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('スタイリング', () => {
    test('Header_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<Header className="custom-header-class" />)

      // Assert
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('custom-header-class')
    })

    test('Header_WithDefaultProps_ShouldBeStickyPositioned', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('sticky', 'top-0')
    })
  })

  describe('アクセシビリティ', () => {
    test('Header_WhenMenuOpen_ShouldHaveAriaExpanded', () => {
      // Arrange
      render(<Header />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))

      // Assert
      const menuButton = screen.getByRole('button', { name: 'メニューを閉じる' })
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    test('Header_WhenMenuClosed_ShouldHaveAriaExpandedFalse', () => {
      // Arrange & Act
      render(<Header />)

      // Assert
      const menuButton = screen.getByRole('button', { name: 'メニューを開く' })
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
