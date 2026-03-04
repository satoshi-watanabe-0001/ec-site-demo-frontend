/**
 * @fileoverview DashboardCardコンポーネントのユニットテスト
 * @module components/mypage/__tests__/DashboardCard.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardCard } from '../DashboardCard'

describe('DashboardCard', () => {
  describe('レンダリング', () => {
    test('DashboardCard_WithTitle_ShouldRenderTitle', () => {
      // Arrange & Act
      render(<DashboardCard title="テストタイトル">コンテンツ</DashboardCard>)

      // Assert
      expect(screen.getByText('テストタイトル')).toBeInTheDocument()
    })

    test('DashboardCard_WithChildren_ShouldRenderChildren', () => {
      // Arrange & Act
      render(<DashboardCard title="タイトル">子要素テスト</DashboardCard>)

      // Assert
      expect(screen.getByText('子要素テスト')).toBeInTheDocument()
    })

    test('DashboardCard_WithHref_ShouldRenderLink', () => {
      // Arrange & Act
      render(
        <DashboardCard title="タイトル" href="/mypage/contract">
          コンテンツ
        </DashboardCard>
      )

      // Assert
      const link = screen.getByText(/詳細を見る/)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/mypage/contract')
    })

    test('DashboardCard_WithoutHref_ShouldNotRenderLink', () => {
      // Arrange & Act
      render(<DashboardCard title="タイトル">コンテンツ</DashboardCard>)

      // Assert
      expect(screen.queryByText(/詳細を見る/)).not.toBeInTheDocument()
    })

    test('DashboardCard_WithCustomLinkText_ShouldRenderCustomText', () => {
      // Arrange & Act
      render(
        <DashboardCard title="タイトル" href="/test" linkText="カスタムリンク">
          コンテンツ
        </DashboardCard>
      )

      // Assert
      expect(screen.getByText(/カスタムリンク/)).toBeInTheDocument()
    })

    test('DashboardCard_WithClassName_ShouldApplyClassName', () => {
      // Arrange & Act
      const { container } = render(
        <DashboardCard title="タイトル" className="custom-class">
          コンテンツ
        </DashboardCard>
      )

      // Assert
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})
