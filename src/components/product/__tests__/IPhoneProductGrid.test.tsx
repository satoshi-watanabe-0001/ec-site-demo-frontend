/**
 * @fileoverview IPhoneProductGridコンポーネントのユニットテスト
 * @module components/product/__tests__/IPhoneProductGrid.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 */

import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IPhoneProductGrid } from '../IPhoneProductGrid'

describe('IPhoneProductGrid', () => {
  describe('レンダリング', () => {
    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderProductCount', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByText('5件の製品が見つかりました')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderAllDevices', () => {
      // Arrange
      const expectedDeviceNames = [
        'iPhone 16 Pro Max',
        'iPhone 16 Pro',
        'iPhone 16 Plus',
        'iPhone 16',
        'iPhone 15',
      ]

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expectedDeviceNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument()
      })
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderSortControl', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByLabelText('並び替え:')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderStorageOptions', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getAllByText('128GB').length).toBeGreaterThan(0)
      expect(screen.getAllByText('256GB').length).toBeGreaterThan(0)
      expect(screen.getAllByText('512GB').length).toBeGreaterThan(0)
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderPriceInfo', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByText('189,800円〜')).toBeInTheDocument()
      expect(screen.getByText('159,800円〜')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderMonthlyPayment', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByText('月々7,283円〜（24回払い）')).toBeInTheDocument()
      expect(screen.getByText('月々6,033円〜（24回払い）')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderDocomoShopLinks', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      const shopLinks = screen.getAllByText('ドコモオンラインショップで購入')
      expect(shopLinks.length).toBe(5)
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderDeviceLabels', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getAllByText('NEW').length).toBeGreaterThan(0)
      expect(screen.getAllByText('人気').length).toBeGreaterThan(0)
      expect(screen.getByText('おすすめ')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderDiscountInfo', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      const discountElements = screen.getAllByText(/最大.*円引き/)
      expect(discountElements.length).toBeGreaterThan(0)
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldRenderColorDots', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getAllByText('カラー:').length).toBe(5)
    })
  })

  describe('ソート機能', () => {
    test('IPhoneProductGrid_WithSortByName_ShouldSortDevicesAlphabetically', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<IPhoneProductGrid />)
      const sortSelect = screen.getByRole('combobox')
      await user.selectOptions(sortSelect, 'name')

      // Assert
      const articles = screen.getAllByRole('article')
      const firstArticle = articles[0]
      expect(within(firstArticle).getByText('iPhone 15')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithSortByPrice_ShouldSortDevicesByPriceDescending', async () => {
      // Arrange
      const user = userEvent.setup()

      // Act
      render(<IPhoneProductGrid />)
      const sortSelect = screen.getByRole('combobox')
      await user.selectOptions(sortSelect, 'price')

      // Assert
      const articles = screen.getAllByRole('article')
      const firstArticle = articles[0]
      expect(within(firstArticle).getByText('iPhone 16 Pro Max')).toBeInTheDocument()
    })

    test('IPhoneProductGrid_WithDefaultSort_ShouldHaveNameAsDefaultOption', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      const sortSelect = screen.getByRole('combobox') as HTMLSelectElement
      expect(sortSelect.value).toBe('name')
    })
  })

  describe('スタイリング', () => {
    test('IPhoneProductGrid_WithCustomClassName_ShouldApplyClassName', () => {
      // Arrange
      const customClass = 'custom-grid-class'

      // Act
      const { container } = render(<IPhoneProductGrid className={customClass} />)

      // Assert
      const gridElement = container.firstChild as HTMLElement
      expect(gridElement).toHaveClass(customClass)
    })
  })

  describe('アクセシビリティ', () => {
    test('IPhoneProductGrid_WithDefaultProps_ShouldHaveAccessibleArticles', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBe(5)
    })

    test('IPhoneProductGrid_WithDefaultProps_ShouldHaveAccessibleSortLabel', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      const sortSelect = screen.getByLabelText('並び替え:')
      expect(sortSelect).toBeInTheDocument()
    })
  })
})
