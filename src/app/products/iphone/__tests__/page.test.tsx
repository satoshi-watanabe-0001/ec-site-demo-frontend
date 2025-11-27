/**
 * @fileoverview iPhoneカテゴリページのユニットテスト
 * @module app/products/iphone/__tests__/page.test
 *
 * organization-standards準拠:
 * - FIRST原則（Fast, Independent, Repeatable, Self-Validating, Timely）
 * - AAA（Arrange-Act-Assert）パターン
 * - 命名規約: MethodName_StateUnderTest_ExpectedBehavior
 *
 * EC-272: API統合後のテスト
 * useCategoryProductsフックをモックして、ESMモジュール（@t3-oss/env-nextjs）の
 * 解析エラーを回避する。
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import IPhoneCategoryPage from '../page'
import type { CategoryDetailResponse, ProductCardDto } from '@/types/category'

// useCategoryProductsフックをモック（ESMモジュール問題を回避）
jest.mock('@/hooks/useCategoryProducts', () => ({
  useCategoryProducts: jest.fn(),
}))

import { useCategoryProducts } from '@/hooks/useCategoryProducts'

const mockUseCategoryProducts = useCategoryProducts as jest.MockedFunction<
  typeof useCategoryProducts
>

/**
 * モック用iPhone製品データ（ProductCardDto形式）
 */
const mockIPhoneProducts: ProductCardDto[] = [
  {
    productId: 1,
    productName: 'iPhone 16 Pro Max',
    manufacturer: 'Apple',
    price: 189800,
    originalPrice: 199800,
    monthlyPayment: 7283,
    imageUrls: ['/images/devices/iphone-16-pro-max.png'],
    storageOptions: ['256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'ナチュラルチタニウム', hex: '#C4B8A5' },
      { name: 'ブラックチタニウム', hex: '#3C3C3C' },
    ],
    campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
    inStock: true,
  },
  {
    productId: 2,
    productName: 'iPhone 16 Pro',
    manufacturer: 'Apple',
    price: 159800,
    imageUrls: ['/images/devices/iphone-16-pro.png'],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colorOptions: [{ name: 'ナチュラルチタニウム', hex: '#C4B8A5' }],
    campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
    inStock: true,
  },
  {
    productId: 3,
    productName: 'iPhone 16 Plus',
    manufacturer: 'Apple',
    price: 139800,
    imageUrls: ['/images/devices/iphone-16-plus.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [{ name: 'ブラック', hex: '#1C1C1E' }],
    campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
    inStock: true,
  },
  {
    productId: 4,
    productName: 'iPhone 16',
    manufacturer: 'Apple',
    price: 124800,
    imageUrls: ['/images/devices/iphone-16.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [{ name: 'ブラック', hex: '#1C1C1E' }],
    campaigns: [{ campaignCode: 'POPULAR', badgeText: '人気' }],
    inStock: true,
  },
  {
    productId: 5,
    productName: 'iPhone 15',
    manufacturer: 'Apple',
    price: 95800,
    imageUrls: ['/images/devices/iphone-15.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [{ name: 'ブラック', hex: '#1C1C1E' }],
    campaigns: [{ campaignCode: 'RECOMMEND', badgeText: 'おすすめ' }],
    inStock: true,
  },
]

/**
 * モック用カテゴリ詳細レスポンス
 */
const mockCategoryResponse: CategoryDetailResponse = {
  categoryCode: 'iphone',
  categoryName: 'iPhone',
  products: mockIPhoneProducts,
  totalCount: 5,
}

describe('IPhoneCategoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // デフォルトでは成功レスポンスを返す
    mockUseCategoryProducts.mockReturnValue({
      data: mockCategoryResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      isPending: false,
      isFetching: false,
      isRefetching: false,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle',
    } as unknown as ReturnType<typeof useCategoryProducts>)
  })
  describe('レンダリング', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPageTitle', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByRole('heading', { level: 1, name: 'iPhone' })).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPageDescription', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText(/Apple製の高品質なスマートフォン/)).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldShowPhoneEmoji', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('📱')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderCampaignBanner', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('iPhone特別キャンペーン実施中！')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderProductGrid', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('5件の製品が見つかりました')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldRenderDocomoShopLink', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const shopLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      expect(shopLinks.length).toBeGreaterThan(0)
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveCorrectDocomoShopUrl', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const shopLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      shopLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'https://onlineshop.smt.docomo.ne.jp')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('コンポーネント構成', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldIncludeCampaignBannerComponent', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('対象機種が最大15,000円引き')).toBeInTheDocument()
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldIncludeProductGridComponent', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      expect(screen.getByText('iPhone 16 Pro Max')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16 Plus')).toBeInTheDocument()
      expect(screen.getByText('iPhone 16')).toBeInTheDocument()
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveMainHeading', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('iPhone')
    })

    test('IPhoneCategoryPage_WithDefaultRender_ShouldHaveExternalLinksWithProperAttributes', () => {
      // Arrange
      // （特に事前準備なし）

      // Act
      render(<IPhoneCategoryPage />)

      // Assert
      const externalLinks = screen.getAllByRole('link', { name: 'ドコモオンラインショップで購入' })
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
        expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
      })
    })
  })
})
