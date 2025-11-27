/**
 * @fileoverview IPhoneCampaignBannerコンポーネントのユニットテスト
 * @module components/product/__tests__/IPhoneCampaignBanner.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { IPhoneCampaignBanner } from '../IPhoneCampaignBanner'

describe('IPhoneCampaignBanner', () => {
  describe('レンダリング', () => {
    test('IPhoneCampaignBanner_WithDefaultProps_ShouldRenderCampaignTitle', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCampaignBanner />)

      // Assert
      expect(screen.getByText('iPhone特別キャンペーン実施中！')).toBeInTheDocument()
    })

    test('IPhoneCampaignBanner_WithDefaultProps_ShouldRenderDiscountInfo', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCampaignBanner />)

      // Assert
      expect(screen.getByText('対象機種が最大15,000円引き')).toBeInTheDocument()
    })

    test('IPhoneCampaignBanner_WithDefaultProps_ShouldRenderCampaignEmojis', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCampaignBanner />)

      // Assert
      const emojis = screen.getAllByRole('img', { name: 'キャンペーン' })
      expect(emojis).toHaveLength(2)
    })

    test('IPhoneCampaignBanner_WithDefaultProps_ShouldHaveHeading', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCampaignBanner />)

      // Assert
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('iPhone特別キャンペーン実施中！')
    })
  })

  describe('スタイリング', () => {
    test('IPhoneCampaignBanner_WithCustomClassName_ShouldApplyClassName', () => {
      // Arrange
      const customClass = 'custom-test-class'

      // Act
      const { container } = render(<IPhoneCampaignBanner className={customClass} />)

      // Assert
      const bannerElement = container.firstChild as HTMLElement
      expect(bannerElement).toHaveClass(customClass)
    })

    test('IPhoneCampaignBanner_WithDefaultProps_ShouldHaveGradientBackground', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      const { container } = render(<IPhoneCampaignBanner />)

      // Assert
      const bannerElement = container.firstChild as HTMLElement
      expect(bannerElement).toHaveClass('bg-gradient-to-r')
      expect(bannerElement).toHaveClass('from-red-500')
      expect(bannerElement).toHaveClass('to-orange-500')
    })
  })
})
