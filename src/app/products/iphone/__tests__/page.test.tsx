/**
 * @fileoverview iPhoneカテゴリページのユニットテスト
 * @module app/products/iphone/__tests__/page.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import IPhoneCategoryPage from '../page'

describe('IPhoneCategoryPage', () => {
  describe('レンダリング', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPageTitle', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByRole('heading', { level: 1, name: 'iPhone' })).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPageDescription', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText(/Apple製の高品質なスマートフォン/)).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPhoneEmoji', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('📱')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderCampaignBanner', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('iPhone特別キャンペーン実施中！')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderProductGrid', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('5件の製品が見つかりました')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderDocomoShopLink', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const shopLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      expect(shopLinks.length).toBeGreaterThan(0)
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveCorrectDocomoShopUrl', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const shopLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      shopLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'https://onlineshop.smt.docomo.ne.jp')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('コンポーネント構成', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldIncludeCampaignBannerComponent', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('対象機種が最大15,000円引き')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldIncludeProductGridComponent', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('iPhone 16 Pro Max')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16 Plus')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16')).toBeInTheDocument()
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveMainHeading', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('iPhone')
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveExternalLinksWithProperAttributes', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const externalLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
        expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
      })
    })
  })
})
