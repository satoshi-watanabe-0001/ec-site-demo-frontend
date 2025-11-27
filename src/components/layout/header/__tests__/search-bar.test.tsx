/**
 * @fileoverview SearchBarコンポーネントのユニットテスト
 * @module components/layout/header/__tests__/search-bar.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SearchBar } from '../search-bar'

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('レンダリング', () => {
    test('SearchBar_WithDefaultProps_ShouldRenderSearchButton', () => {
      // Arrange & Act
      render(<SearchBar />)

      // Assert
      expect(screen.getByRole('button', { name: '検索を開く' })).toBeInTheDocument()
    })

    test('SearchBar_WithDefaultProps_ShouldHaveSearchRole', () => {
      // Arrange & Act
      render(<SearchBar />)

      // Assert
      expect(screen.getByRole('search')).toBeInTheDocument()
    })

    test('SearchBar_WithDefaultProps_ShouldHaveAriaLabel', () => {
      // Arrange & Act
      render(<SearchBar />)

      // Assert
      expect(screen.getByRole('search')).toHaveAttribute('aria-label', 'サイト内検索')
    })
  })

  describe('展開/折りたたみ', () => {
    test('SearchBar_WhenSearchButtonClicked_ShouldExpandSearchInput', () => {
      // Arrange
      render(<SearchBar />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Assert
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    test('SearchBar_WhenExpanded_ShouldShowCloseButton', () => {
      // Arrange
      render(<SearchBar />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Assert
      expect(screen.getByRole('button', { name: '検索を閉じる' })).toBeInTheDocument()
    })

    test('SearchBar_WhenCloseButtonClicked_ShouldCollapseSearchInput', () => {
      // Arrange
      render(<SearchBar />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Act
      fireEvent.click(screen.getByRole('button', { name: '検索を閉じる' }))

      // Assert
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: '検索を開く' })).toBeInTheDocument()
    })

    test('SearchBar_WhenEscapePressed_ShouldCollapseSearchInput', () => {
      // Arrange
      render(<SearchBar />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Act
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' })

      // Assert
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    })
  })

  describe('検索機能', () => {
    test('SearchBar_WhenTyping_ShouldUpdateInputValue', () => {
      // Arrange
      render(<SearchBar />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Act
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'iPhone' } })

      // Assert
      expect(screen.getByRole('searchbox')).toHaveValue('iPhone')
    })

    test('SearchBar_WhenTypingWithDebounce_ShouldCallOnSearchAfterDelay', async () => {
      // Arrange
      const handleSearch = jest.fn()
      render(<SearchBar onSearch={handleSearch} />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Act
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'iPhone' } })

      // Assert - before debounce
      expect(handleSearch).not.toHaveBeenCalled()

      // Act - advance timers
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Assert - after debounce
      expect(handleSearch).toHaveBeenCalledWith('iPhone')
    })

    test('SearchBar_WhenEnterPressed_ShouldCallOnSearchImmediately', () => {
      // Arrange
      const handleSearch = jest.fn()
      render(<SearchBar onSearch={handleSearch} />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Galaxy' } })

      // Act
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' })

      // Assert
      expect(handleSearch).toHaveBeenCalledWith('Galaxy')
    })

    test('SearchBar_WhenEnterPressedWithEmptyQuery_ShouldNotCallOnSearch', () => {
      // Arrange
      const handleSearch = jest.fn()
      render(<SearchBar onSearch={handleSearch} />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Act
      fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' })

      // Assert
      expect(handleSearch).not.toHaveBeenCalled()
    })
  })

  describe('プレースホルダー', () => {
    test('SearchBar_WithDefaultPlaceholder_ShouldShowDefaultPlaceholder', () => {
      // Arrange
      render(<SearchBar />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Assert
      expect(screen.getByPlaceholderText('機種名やキーワードで検索')).toBeInTheDocument()
    })

    test('SearchBar_WithCustomPlaceholder_ShouldShowCustomPlaceholder', () => {
      // Arrange
      render(<SearchBar placeholder="カスタムプレースホルダー" />)
      fireEvent.click(screen.getByRole('button', { name: '検索を開く' }))

      // Assert
      expect(screen.getByPlaceholderText('カスタムプレースホルダー')).toBeInTheDocument()
    })
  })

  describe('スタイリング', () => {
    test('SearchBar_WithClassName_ShouldMergeClassNames', () => {
      // Arrange & Act
      render(<SearchBar className="custom-search-class" />)

      // Assert
      const searchContainer = screen.getByRole('search')
      expect(searchContainer).toHaveClass('custom-search-class')
    })
  })
})
