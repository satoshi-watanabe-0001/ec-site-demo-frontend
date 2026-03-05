/**
 * @fileoverview CategoryCardのユニットテスト
 * @module components/product/__tests__/category-card.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CategoryCard } from '../category-card'
import type { Category } from '@/types/category'

describe('CategoryCard', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'iPhone',
    slug: 'iphone',
    imageUrl: '/images/categories/iphone.jpg',
    description: '最新のiPhoneシリーズ',
    displayOrder: 1,
  }

  describe('レンダリング', () => {
    test('CategoryCard_WithCategory_ShouldDisplayCategoryName', () => {
      // Arrange & Act
      render(<CategoryCard category={mockCategory} />)

      // Assert
      expect(screen.getByText('iPhone')).toBeInTheDocument()
    })

    test('CategoryCard_WithDescription_ShouldDisplayDescription', () => {
      // Arrange & Act
      render(<CategoryCard category={mockCategory} />)

      // Assert
      expect(screen.getByText('最新のiPhoneシリーズ')).toBeInTheDocument()
    })

    test('CategoryCard_WithoutDescription_ShouldNotDisplayDescription', () => {
      // Arrange
      const categoryWithoutDesc: Category = {
        ...mockCategory,
        description: undefined,
      }

      // Act
      render(<CategoryCard category={categoryWithoutDesc} />)

      // Assert
      expect(screen.getByText('iPhone')).toBeInTheDocument()
      expect(screen.queryByText('最新のiPhoneシリーズ')).not.toBeInTheDocument()
    })

    test('CategoryCard_WithCategory_ShouldHaveCorrectLink', () => {
      // Arrange & Act
      render(<CategoryCard category={mockCategory} />)

      // Assert
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/products/iphone')
    })

    test('CategoryCard_WithImage_ShouldHaveAltText', () => {
      // Arrange & Act
      render(<CategoryCard category={mockCategory} />)

      // Assert
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'iPhone')
    })

    test('CategoryCard_WithClassName_ShouldApplyCustomClass', () => {
      // Arrange & Act
      render(<CategoryCard category={mockCategory} className="custom-class" />)

      // Assert
      const link = screen.getByRole('link')
      expect(link.className).toContain('custom-class')
    })
  })
})
