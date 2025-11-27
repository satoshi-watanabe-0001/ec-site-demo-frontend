/**
 * @fileoverview Footerコンポーネントのユニットテスト
 * @module components/layout/footer/__tests__/footer.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer', () => {
  describe('レンダリング', () => {
    test('Footer_WithDefaultProps_ShouldRenderFooterElement', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    test('Footer_WithDefaultProps_ShouldRenderCopyright', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      expect(screen.getByText(/NTT DOCOMO, INC./)).toBeInTheDocument()
    })
  })

  describe('ソーシャルメディアリンク', () => {
    test('Footer_WithDefaultProps_ShouldRenderLINELink', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const lineLink = screen.getByLabelText('LINE')
      expect(lineLink).toBeInTheDocument()
      expect(lineLink).toHaveAttribute('href', 'https://line.me/')
      expect(lineLink).toHaveAttribute('target', '_blank')
      expect(lineLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('Footer_WithDefaultProps_ShouldRenderFacebookLink', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const facebookLink = screen.getByLabelText('Facebook')
      expect(facebookLink).toBeInTheDocument()
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/')
    })

    test('Footer_WithDefaultProps_ShouldRenderInstagramLink', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const instagramLink = screen.getByLabelText('Instagram')
      expect(instagramLink).toBeInTheDocument()
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/')
    })

    test('Footer_WithDefaultProps_ShouldRenderTikTokLink', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const tiktokLink = screen.getByLabelText('TikTok')
      expect(tiktokLink).toBeInTheDocument()
      expect(tiktokLink).toHaveAttribute('href', 'https://tiktok.com/')
    })

    test('Footer_WithDefaultProps_ShouldRenderYouTubeLink', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const youtubeLink = screen.getByLabelText('YouTube')
      expect(youtubeLink).toBeInTheDocument()
      expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/')
    })

    test('Footer_WithDefaultProps_ShouldRenderAllFiveSocialLinks', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const socialLinks = screen.getAllByRole('link')
      expect(socialLinks).toHaveLength(5)
    })
  })

  describe('スタイリング', () => {
    test('Footer_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<Footer className="custom-footer-class" />)

      // Assert
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('custom-footer-class')
    })

    test('Footer_WithDefaultProps_ShouldApplyGradientBackground', () => {
      // Arrange & Act
      render(<Footer />)

      // Assert
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-gradient-to-r')
    })
  })
})
