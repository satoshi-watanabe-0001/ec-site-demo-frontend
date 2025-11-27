/**
 * @fileoverview PopularDevicesSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/PopularDevicesSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { PopularDevicesSection } from '../PopularDevicesSection'

describe('PopularDevicesSection', () => {
  describe('レンダリング', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('人気端末')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText(/ahamoで使える最新スマートフォン/)).toBeInTheDocument()
    })
  })

  describe('端末カード', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSixDeviceCards', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(6)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderIPhone16Pro', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderIPhone16', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('iPhone 16')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderGalaxyS24Ultra', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderGalaxyS24', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderXperia1VI', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('Xperia 1 VI')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderAquosR9', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('AQUOS R9')).toBeInTheDocument()
    })
  })

  describe('メーカー情報', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderAppleManufacturer', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const appleLabels = screen.getAllByText('Apple')
      expect(appleLabels.length).toBeGreaterThan(0)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSamsungManufacturer', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const samsungLabels = screen.getAllByText('Samsung')
      expect(samsungLabels.length).toBeGreaterThan(0)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSonyManufacturer', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('Sony')).toBeInTheDocument()
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderSharpManufacturer', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText('Sharp')).toBeInTheDocument()
    })
  })

  describe('ラベル', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderNewLabels', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const newLabels = screen.getAllByText('NEW')
      expect(newLabels.length).toBeGreaterThan(0)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderPopularLabels', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const popularLabels = screen.getAllByText('人気')
      expect(popularLabels.length).toBeGreaterThan(0)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderRecommendedLabels', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const recommendedLabels = screen.getAllByText('おすすめ')
      expect(recommendedLabels.length).toBeGreaterThan(0)
    })
  })

  describe('価格情報', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderPrices', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText(/159,800円/)).toBeInTheDocument()
      const prices124800 = screen.getAllByText(/124,800円/)
      expect(prices124800.length).toBeGreaterThan(0)
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderOriginalPrice', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      expect(screen.getByText(/199,800円/)).toBeInTheDocument()
    })
  })

  describe('リンク', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldRenderViewAllLink', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const viewAllLink = screen.getByRole('link', { name: 'すべての端末を見る' })
      expect(viewAllLink).toHaveAttribute('href', '/devices')
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderDeviceLinks', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(1)
    })
  })

  describe('アクセシビリティ', () => {
    test('PopularDevicesSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'devices-section-title')
    })

    test('PopularDevicesSection_WithDefaultProps_ShouldRenderImages', () => {
      // Arrange & Act
      render(<PopularDevicesSection />)

      // Assert
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })
})
