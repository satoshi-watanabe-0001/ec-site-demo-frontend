/**
 * @fileoverview PricingSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/PricingSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { PricingSection } from '../PricingSection'

describe('PricingSection', () => {
  describe('レンダリング', () => {
    test('PricingSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('料金プラン')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText(/シンプルでわかりやすい料金体系/)).toBeInTheDocument()
    })
  })

  describe('基本プラン', () => {
    test('PricingSection_WithDefaultProps_ShouldRenderAhamoPlanName', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('heading', { name: 'ahamo' })).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderBasicPrice', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('2,970')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderDataCapacity', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('20GB')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderFreeCallMinutes', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('5分')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderRecommendedBadge', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('おすすめ')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderApplyButton', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('button', { name: '申し込む' })).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderDetailsButton', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('button', { name: '詳細を見る' })).toBeInTheDocument()
    })
  })

  describe('大盛りオプション', () => {
    test('PricingSection_WithDefaultProps_ShouldRenderOomoriOptionName', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('heading', { name: '大盛りオプション' })).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderOomoriPrice', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('1,980')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderAdditionalDataCapacity', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText('+80GB')).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderTotalDataCapacity', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText(/合計100GBまで使える/)).toBeInTheDocument()
    })

    test('PricingSection_WithDefaultProps_ShouldRenderAddOptionButton', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByRole('button', { name: 'オプションを追加' })).toBeInTheDocument()
    })
  })

  describe('フッター', () => {
    test('PricingSection_WithDefaultProps_ShouldRenderTaxNote', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      expect(screen.getByText(/料金は税込表示です/)).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('PricingSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'pricing-section-title')
    })

    test('PricingSection_WithDefaultProps_ShouldRenderTwoArticles', () => {
      // Arrange & Act
      render(<PricingSection />)

      // Assert
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(2)
    })
  })
})
