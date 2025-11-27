/**
 * @fileoverview SupportSectionコンポーネントのユニットテスト
 * @module components/sections/__tests__/SupportSection.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { SupportSection } from '../SupportSection'

describe('SupportSection', () => {
  describe('レンダリング', () => {
    test('SupportSection_WithDefaultProps_ShouldRenderSectionElement', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('SupportSection_WithDefaultProps_ShouldRenderSectionTitle', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('サポート')).toBeInTheDocument()
    })

    test('SupportSection_WithDefaultProps_ShouldRenderSectionDescription', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(
        screen.getByText(/お困りのことがあれば、いつでもお気軽にご相談ください/)
      ).toBeInTheDocument()
    })
  })

  describe('サポートカード', () => {
    test('SupportSection_WithDefaultProps_ShouldRenderFAQCard', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('よくあるご質問')).toBeInTheDocument()
      const faqLink = screen.getByRole('link', { name: /よくあるご質問/ })
      expect(faqLink).toHaveAttribute('href', '/support/faq')
    })

    test('SupportSection_WithDefaultProps_ShouldRenderChatSupportCard', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('チャットサポート')).toBeInTheDocument()
      const chatLink = screen.getByRole('link', { name: /チャットサポート/ })
      expect(chatLink).toHaveAttribute('href', '/support/chat')
    })

    test('SupportSection_WithDefaultProps_ShouldRenderContactCard', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('お問い合わせ')).toBeInTheDocument()
      const contactLink = screen.getByRole('link', { name: /お問い合わせ/ })
      expect(contactLink).toHaveAttribute('href', '/support/contact')
    })

    test('SupportSection_WithDefaultProps_ShouldRenderProceduresCard', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('各種手続き')).toBeInTheDocument()
      const proceduresLink = screen.getByRole('link', { name: /各種手続き/ })
      expect(proceduresLink).toHaveAttribute('href', '/support/procedures')
    })

    test('SupportSection_WithDefaultProps_ShouldRenderFourSupportCards', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(4)
    })
  })

  describe('電話サポート情報', () => {
    test('SupportSection_WithDefaultProps_ShouldRenderPhoneNumber', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText('0120-XXX-XXX')).toBeInTheDocument()
    })

    test('SupportSection_WithDefaultProps_ShouldRenderPhoneHours', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      expect(screen.getByText(/受付時間: 9:00〜20:00/)).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('SupportSection_WithDefaultProps_ShouldHaveAriaLabelledBy', () => {
      // Arrange & Act
      render(<SupportSection />)

      // Assert
      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'support-section-title')
    })
  })
})
