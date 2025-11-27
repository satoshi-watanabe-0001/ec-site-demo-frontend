/**
 * @fileoverview Navigationコンポーネントのユニットテスト
 * @module components/layout/header/__tests__/navigation.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation, defaultNavItems } from '../navigation'

// usePathname をモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Navigation', () => {
  describe('レンダリング', () => {
    test('Navigation_WithDefaultNavItems_ShouldRenderAllNavItems', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} />)

      // Assert
      expect(screen.getByText('ホーム')).toBeInTheDocument()
      expect(screen.getByText('申し込みの流れ')).toBeInTheDocument()
      expect(screen.getByText('料金/データ量')).toBeInTheDocument()
      expect(screen.getByText('製品')).toBeInTheDocument()
      expect(screen.getByText('サポート')).toBeInTheDocument()
    })

    test('Navigation_WithDefaultNavItems_ShouldRenderCorrectLinks', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} />)

      // Assert
      expect(screen.getByRole('link', { name: 'ホーム' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: '申し込みの流れ' })).toHaveAttribute(
        'href',
        '/signup-flow'
      )
      expect(screen.getByRole('link', { name: '料金/データ量' })).toHaveAttribute(
        'href',
        '/pricing'
      )
      expect(screen.getByRole('link', { name: '製品' })).toHaveAttribute('href', '/products')
      expect(screen.getByRole('link', { name: 'サポート' })).toHaveAttribute('href', '/support')
    })

    test('Navigation_WithDefaultProps_ShouldRenderNavElement', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} />)

      // Assert
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    test('Navigation_WithDefaultProps_ShouldHaveAriaLabel', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} />)

      // Assert
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'メインナビゲーション')
    })
  })

  describe('モバイル表示', () => {
    test('Navigation_WithIsMobileTrue_ShouldApplyMobileStyles', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} isMobile={true} />)

      // Assert
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex-col')
    })

    test('Navigation_WithIsMobileFalse_ShouldApplyDesktopStyles', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} isMobile={false} />)

      // Assert
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('hidden', 'md:flex')
    })
  })

  describe('インタラクション', () => {
    test('Navigation_WhenNavItemClicked_ShouldCallOnItemClick', () => {
      // Arrange
      const handleItemClick = jest.fn()

      // Act
      render(<Navigation items={defaultNavItems} isMobile={true} onItemClick={handleItemClick} />)
      fireEvent.click(screen.getByText('ホーム'))

      // Assert
      expect(handleItemClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('スタイリング', () => {
    test('Navigation_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<Navigation items={defaultNavItems} className="custom-nav-class" />)

      // Assert
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('custom-nav-class')
    })
  })
})

describe('defaultNavItems', () => {
  test('defaultNavItems_ShouldContainFiveItems', () => {
    // Assert
    expect(defaultNavItems).toHaveLength(5)
  })

  test('defaultNavItems_ShouldHaveCorrectStructure', () => {
    // Assert
    defaultNavItems.forEach(item => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('href')
      expect(typeof item.label).toBe('string')
      expect(typeof item.href).toBe('string')
    })
  })
})
