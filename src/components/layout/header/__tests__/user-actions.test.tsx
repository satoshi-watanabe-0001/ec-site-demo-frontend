/**
 * @fileoverview UserActionsコンポーネントのユニットテスト
 * @module components/layout/header/__tests__/user-actions.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { UserActions } from '../user-actions'

// useAuthStore をモック
const mockUseAuthStore = jest.fn()
jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

describe('UserActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('未認証時', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false })
    })

    test('UserActions_WhenNotAuthenticated_ShouldRenderSignupButton', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      expect(screen.getByText('新規登録')).toBeInTheDocument()
    })

    test('UserActions_WhenNotAuthenticated_ShouldRenderLoginButton', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      expect(screen.getByText('ログイン')).toBeInTheDocument()
    })

    test('UserActions_WhenNotAuthenticated_ShouldLinkToSignupPage', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      const signupLink = screen.getByText('新規登録').closest('a')
      expect(signupLink).toHaveAttribute('href', '/signup')
    })

    test('UserActions_WhenNotAuthenticated_ShouldLinkToLoginPage', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      const loginLink = screen.getByText('ログイン').closest('a')
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })

  describe('認証時', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true })
    })

    test('UserActions_WhenAuthenticated_ShouldRenderMyPageButton', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      expect(screen.getByText('マイページ')).toBeInTheDocument()
    })

    test('UserActions_WhenAuthenticated_ShouldNotRenderSignupButton', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      expect(screen.queryByText('新規登録')).not.toBeInTheDocument()
    })

    test('UserActions_WhenAuthenticated_ShouldNotRenderLoginButton', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      expect(screen.queryByText('ログイン')).not.toBeInTheDocument()
    })

    test('UserActions_WhenAuthenticated_ShouldLinkToMyPage', () => {
      // Arrange & Act
      render(<UserActions />)

      // Assert
      const myPageLink = screen.getByText('マイページ').closest('a')
      expect(myPageLink).toHaveAttribute('href', '/mypage')
    })
  })

  describe('モバイル表示', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false })
    })

    test('UserActions_WithIsMobileTrue_ShouldApplyMobileStyles', () => {
      // Arrange & Act
      const { container } = render(<UserActions isMobile={true} />)

      // Assert
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('flex-col')
    })

    test('UserActions_WithIsMobileFalse_ShouldApplyDesktopStyles', () => {
      // Arrange & Act
      const { container } = render(<UserActions isMobile={false} />)

      // Assert
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('space-x-3')
    })
  })

  describe('スタイリング', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false })
    })

    test('UserActions_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      const { container } = render(<UserActions className="custom-class" />)

      // Assert
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})
