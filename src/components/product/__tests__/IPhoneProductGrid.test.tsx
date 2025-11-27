/**
 * @fileoverview IPhoneProductGridコンポーネントのユニットテスト
 * @module components/product/__tests__/IPhoneProductGrid.test
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
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IPhoneProductGrid } from '../IPhoneProductGrid'
import type { CategoryDetailResponse, ProductCardDto } from '@/types/category'

// useCategoryProductsフックをモック（ESMモジュール問題を回避）
jest.mock('@/hooks/useCategoryProducts', () => ({
  useCategoryProducts: jest.fn(),
}))

import { useCategoryProducts } from '@/hooks/useCategoryProducts'

const mockUseCategoryProducts = useCategoryProducts as jest.MockedFunction<typeof useCategoryProducts>

/**
 * モック用iPhone製品データ（ProductCardDto形式）
 * バックエンドAPIから返されるDTO形式でモックデータを定義
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
      { name: 'ホワイトチタニウム', hex: '#F5F5F0' },
      { name: 'デザートチタニウム', hex: '#D4C4B0' },
    ],
    campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
    inStock: true,
    description: '最新のA18 Proチップ搭載',
  },
  {
    productId: 2,
    productName: 'iPhone 16 Pro',
    manufacturer: 'Apple',
    price: 159800,
    originalPrice: 169800,
    monthlyPayment: 6033,
    imageUrls: ['/images/devices/iphone-16-pro.png'],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'ナチュラルチタニウム', hex: '#C4B8A5' },
      { name: 'ブラックチタニウム', hex: '#3C3C3C' },
      { name: 'ホワイトチタニウム', hex: '#F5F5F0' },
      { name: 'デザートチタニウム', hex: '#D4C4B0' },
    ],
    campaigns: [
      { campaignCode: 'NEW', badgeText: 'NEW' },
      { campaignCode: 'POPULAR', badgeText: '人気' },
    ],
    inStock: true,
    description: 'プロ仕様のカメラシステム',
  },
  {
    productId: 3,
    productName: 'iPhone 16 Plus',
    manufacturer: 'Apple',
    price: 139800,
    imageUrls: ['/images/devices/iphone-16-plus.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ホワイト', hex: '#F5F5F7' },
      { name: 'ピンク', hex: '#F9D1CF' },
      { name: 'ティール', hex: '#5DADE2' },
      { name: 'ウルトラマリン', hex: '#3B5998' },
    ],
    campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
    inStock: true,
    description: '大画面で楽しむiPhone',
  },
  {
    productId: 4,
    productName: 'iPhone 16',
    manufacturer: 'Apple',
    price: 124800,
    imageUrls: ['/images/devices/iphone-16.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ホワイト', hex: '#F5F5F7' },
      { name: 'ピンク', hex: '#F9D1CF' },
      { name: 'ティール', hex: '#5DADE2' },
      { name: 'ウルトラマリン', hex: '#3B5998' },
    ],
    campaigns: [{ campaignCode: 'POPULAR', badgeText: '人気' }],
    inStock: true,
    description: 'A18チップ搭載',
  },
  {
    productId: 5,
    productName: 'iPhone 15',
    manufacturer: 'Apple',
    price: 95800,
    imageUrls: ['/images/devices/iphone-15.png'],
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ブルー', hex: '#A7C7E7' },
      { name: 'グリーン', hex: '#A8D5BA' },
      { name: 'イエロー', hex: '#F7DC6F' },
      { name: 'ピンク', hex: '#F9D1CF' },
    ],
    campaigns: [{ campaignCode: 'RECOMMEND', badgeText: 'おすすめ' }],
    inStock: true,
    description: 'お求めやすい価格のiPhone',
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

describe('IPhoneProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // デフォルトでは成功レスポンスを返す
    mockUseCategoryProducts.mockReturnValue({
      data: mockCategoryResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    } as ReturnType<typeof useCategoryProducts>)
  })
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

  describe('ローディング状態', () => {
    test('IPhoneProductGrid_WhenLoading_ShouldShowLoadingIndicator', () => {
      // Arrange
      mockUseCategoryProducts.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
        refetch: jest.fn(),
      } as ReturnType<typeof useCategoryProducts>)

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByText('製品を読み込み中...')).toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    test('IPhoneProductGrid_WhenError_ShouldShowErrorMessage', () => {
      // Arrange
      mockUseCategoryProducts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('API error'),
        isError: true,
        isSuccess: false,
        refetch: jest.fn(),
      } as ReturnType<typeof useCategoryProducts>)

      // Act
      render(<IPhoneProductGrid />)

      // Assert
      expect(screen.getByText('製品の読み込みに失敗しました')).toBeInTheDocument()
      expect(screen.getByText('しばらくしてから再度お試しください')).toBeInTheDocument()
    })
  })
})
