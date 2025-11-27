/**
 * @fileoverview NewsSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/NewsSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { NewsSection } from '../NewsSection'

describe('NewsSection', () => {
  describe('レンダリング', () => {
    test('NewsSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText('お知らせ・ニュース')).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/ahamoからの最新情報をお届けします/)).toBeInTheDocument()
    })
  })

  describe('ニュースアイテム', () => {
    test('NewsSection_WithDefaultProps_ShouldRenderFiveNewsItems', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(5)
    })

    test('NewsSection_WithDefaultProps_ShouldRenderOomoriCampaignNews', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/ahamo大盛りオプション 1ヶ月無料キャンペーン/)).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderIPhone16News', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/iPhone 16シリーズ 取り扱い開始/)).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderMaintenanceNews', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/システムメンテナンスのお知らせ/)).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderRoamingNews', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/海外ローミング対象エリア追加/)).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderDPointNews', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText(/dポイント還元率アップキャンペーン/)).toBeInTheDocument()
    })
  })

  describe('カテゴリラベル', () => {
    test('NewsSection_WithDefaultProps_ShouldRenderCampaignCategory', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const campaignLabels = screen.getAllByText('キャンペーン')
      expect(campaignLabels.length).toBeGreaterThan(0)
    })

    test('NewsSection_WithDefaultProps_ShouldRenderDeviceCategory', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText('端末')).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderMaintenanceCategory', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText('メンテナンス')).toBeInTheDocument()
    })

    test('NewsSection_WithDefaultProps_ShouldRenderServiceCategory', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      expect(screen.getByText('サービス')).toBeInTheDocument()
    })
  })

  describe('リンク', () => {
    test('NewsSection_WithDefaultProps_ShouldRenderViewAllLink', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const viewAllLink = screen.getByRole('link', { name: 'すべてのお知らせを見る' })
      expect(viewAllLink).toHaveAttribute('href', '/news')
    })

    test('NewsSection_WithDefaultProps_ShouldRenderNewsItemLinks', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(1)
    })
  })

  describe('アクセシビリティ', () => {
    test('NewsSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'news-section-title')
    })

    test('NewsSection_WithDefaultProps_ShouldRenderTimeElements', () => {
      // Arrange & Act
      render(<NewsSection />)

      // Assert
      const timeElements = screen
        .getAllByRole('article')
        .map(article => article.querySelector('time'))
      expect(timeElements.filter(Boolean).length).toBeGreaterThan(0)
    })
  })
})
