/**
 * @fileoverview FeaturesSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/FeaturesSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { FeaturesSection } from '../FeaturesSection'

describe('FeaturesSection', () => {
  describe('レンダリング', () => {
    test('FeaturesSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('ahamoの特徴')).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(
        screen.getByText(/シンプルでおトク、そして安心。ahamoが選ばれる5つの理由/)
      ).toBeInTheDocument()
    })
  })

  describe('特徴カード', () => {
    test('FeaturesSection_WithDefaultProps_ShouldRenderFiveFeatureCards', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(5)
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderSimplePricingFeature', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('シンプルな料金体系')).toBeInTheDocument()
      expect(screen.getByText(/月額2,970円（税込）のワンプラン/)).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRender5GNetworkFeature', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('高品質な5G通信')).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderGlobalRoamingFeature', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('海外でもそのまま使える')).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderDCardBenefitFeature', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('dカード特典')).toBeInTheDocument()
    })

    test('FeaturesSection_WithDefaultProps_ShouldRenderChatSupportFeature', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      expect(screen.getByText('24時間チャットサポート')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('FeaturesSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'features-section-title')
    })

    test('FeaturesSection_WithDefaultProps_ShouldHaveProperHeadingHierarchy', () => {
      // Arrange & Act
      render(<FeaturesSection />)

      // Assert
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'ahamoの特徴' })
      expect(mainHeading).toBeInTheDocument()
    })
  })
})
