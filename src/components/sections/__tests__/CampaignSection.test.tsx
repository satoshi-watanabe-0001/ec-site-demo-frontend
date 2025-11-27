/**
 * @fileoverview CampaignSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/CampaignSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CampaignSection } from '../CampaignSection'

describe('CampaignSection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('レンダリング', () => {
    test('CampaignSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByRole('region', { name: 'キャンペーンカルーセル' })).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText('キャンペーン情報')).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText(/お得なキャンペーンを実施中/)).toBeInTheDocument()
    })
  })

  describe('キャンペーンカード', () => {
    test('CampaignSection_WithDefaultProps_ShouldRenderCampaignCards', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert - only one card is visible at a time (carousel)
      const visibleArticle = screen.getByRole('article', { hidden: false })
      expect(visibleArticle).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRender5GWelcomeCampaign', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText('5G WELCOME割')).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderPointKatsudoCampaign', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText('ahamoポイ活')).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderOomoriFreeOption', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText('大盛りオプション実質0円')).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderGalaxyCampaign', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByText('Galaxy購入キャンペーン')).toBeInTheDocument()
    })
  })

  describe('ナビゲーションボタン', () => {
    test('CampaignSection_WithDefaultProps_ShouldRenderPrevButton', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByRole('button', { name: '前のキャンペーン' })).toBeInTheDocument()
    })

    test('CampaignSection_WithDefaultProps_ShouldRenderNextButton', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      expect(screen.getByRole('button', { name: '次のキャンペーン' })).toBeInTheDocument()
    })

    test('CampaignSection_WhenNextButtonClicked_ShouldAdvanceSlide', () => {
      // Arrange
      render(<CampaignSection />)
      const nextButton = screen.getByRole('button', { name: '次のキャンペーン' })

      // Act
      fireEvent.click(nextButton)

      // Assert - check that the second slide indicator is now active
      const indicators = screen.getAllByRole('tab')
      expect(indicators[1]).toHaveAttribute('aria-selected', 'true')
    })

    test('CampaignSection_WhenPrevButtonClicked_ShouldGoToPreviousSlide', () => {
      // Arrange
      render(<CampaignSection />)
      const nextButton = screen.getByRole('button', { name: '次のキャンペーン' })
      const prevButton = screen.getByRole('button', { name: '前のキャンペーン' })

      // Act - go to second slide then back to first
      fireEvent.click(nextButton)
      fireEvent.click(prevButton)

      // Assert
      const indicators = screen.getAllByRole('tab')
      expect(indicators[0]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('インジケーター', () => {
    test('CampaignSection_WithDefaultProps_ShouldRenderFourIndicators', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      const indicators = screen.getAllByRole('tab')
      expect(indicators).toHaveLength(4)
    })

    test('CampaignSection_WhenIndicatorClicked_ShouldGoToThatSlide', () => {
      // Arrange
      render(<CampaignSection />)
      const indicators = screen.getAllByRole('tab')

      // Act
      fireEvent.click(indicators[2])

      // Assert
      expect(indicators[2]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('キーボードナビゲーション', () => {
    test('CampaignSection_WhenArrowRightPressed_ShouldAdvanceSlide', () => {
      // Arrange
      render(<CampaignSection />)
      const carousel = screen.getByRole('region', { name: 'キャンペーンカルーセル' })

      // Act
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })

      // Assert
      const indicators = screen.getAllByRole('tab')
      expect(indicators[1]).toHaveAttribute('aria-selected', 'true')
    })

    test('CampaignSection_WhenArrowLeftPressed_ShouldGoToPreviousSlide', () => {
      // Arrange
      render(<CampaignSection />)
      const carousel = screen.getByRole('region', { name: 'キャンペーンカルーセル' })

      // Act - go to second slide then back
      fireEvent.keyDown(carousel, { key: 'ArrowRight' })
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

      // Assert
      const indicators = screen.getAllByRole('tab')
      expect(indicators[0]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('自動スライド', () => {
    test('CampaignSection_AfterFiveSeconds_ShouldAutoAdvanceSlide', () => {
      // Arrange
      render(<CampaignSection />)

      // Act
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Assert
      const indicators = screen.getAllByRole('tab')
      expect(indicators[1]).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('リンク', () => {
    test('CampaignSection_WithDefaultProps_ShouldRenderViewAllLink', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      const viewAllLink = screen.getByRole('link', { name: 'すべてのキャンペーンを見る' })
      expect(viewAllLink).toHaveAttribute('href', '/campaigns')
    })
  })

  describe('アクセシビリティ', () => {
    test('CampaignSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      const section = screen
        .getByRole('region', { name: 'キャンペーンカルーセル' })
        .closest('section')
      expect(section).toHaveAttribute('aria-labelledby', 'campaign-section-title')
    })

    test('CampaignSection_WithDefaultProps_ShouldHaveAriaRoledescription', () => {
      // Arrange & Act
      render(<CampaignSection />)

      // Assert
      const section = screen
        .getByRole('region', { name: 'キャンペーンカルーセル' })
        .closest('section')
      expect(section).toHaveAttribute('aria-roledescription', 'カルーセル')
    })
  })
})
