/**
 * @fileoverview Product Service用MSWハンドラー
 * @module mocks/handlers/productHandlers
 *
 * 人気端末データのモックハンドラー。
 * Product Serviceが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type {
  Device,
  PopularDevicesResponse,
  CategoryDetailResponse,
  ProductCardDto,
} from '@/types'

/**
 * モック用人気端末データ
 * 実際のahamo端末ラインナップを反映
 */
const mockPopularDevices: Device[] = [
  {
    id: 'device-001',
    name: 'iPhone 16 Pro',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-16-pro.png',
    price: 159800,
    originalPrice: 174800,
    labels: ['NEW', '人気'],
    description: '最新のA18 Proチップ搭載。プロ仕様のカメラシステム。',
    inStock: true,
    detailUrl: '/devices/iphone-16-pro',
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'ナチュラルチタニウム', hex: '#8E8E93' },
      { name: 'ブルーチタニウム', hex: '#5B9BD5' },
      { name: 'ホワイトチタニウム', hex: '#F2F2F7' },
      { name: 'ブラックチタニウム', hex: '#1C1C1E' },
    ],
    monthlyPayment: 6658,
  },
  {
    id: 'device-002',
    name: 'iPhone 16',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-16.png',
    price: 124800,
    labels: ['NEW'],
    description: 'A18チップ搭載。進化したカメラとバッテリー。',
    inStock: true,
    detailUrl: '/devices/iphone-16',
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ホワイト', hex: '#F2F2F7' },
      { name: 'ピンク', hex: '#FFB6C1' },
      { name: 'ティール', hex: '#008080' },
      { name: 'ウルトラマリン', hex: '#4169E1' },
    ],
    monthlyPayment: 5200,
  },
  {
    id: 'device-003',
    name: 'Galaxy S24 Ultra',
    manufacturer: 'Samsung',
    imageUrl: '/images/devices/galaxy-s24-ultra.png',
    price: 189800,
    originalPrice: 199800,
    labels: ['人気'],
    description: 'AIを搭載した究極のGalaxy体験。',
    inStock: true,
    detailUrl: '/devices/galaxy-s24-ultra',
  },
  {
    id: 'device-004',
    name: 'Galaxy S24',
    manufacturer: 'Samsung',
    imageUrl: '/images/devices/galaxy-s24.png',
    price: 124800,
    labels: ['おすすめ'],
    description: 'コンパクトながらパワフルな性能。',
    inStock: true,
    detailUrl: '/devices/galaxy-s24',
  },
  {
    id: 'device-005',
    name: 'Xperia 1 VI',
    manufacturer: 'Sony',
    imageUrl: '/images/devices/xperia-1-vi.png',
    price: 174800,
    labels: ['NEW'],
    description: 'プロフェッショナルなカメラ性能。',
    inStock: true,
    detailUrl: '/devices/xperia-1-vi',
  },
  {
    id: 'device-006',
    name: 'AQUOS R9',
    manufacturer: 'Sharp',
    imageUrl: '/images/devices/aquos-r9.png',
    price: 99800,
    labels: ['おすすめ'],
    description: 'Leicaカメラ搭載の高性能モデル。',
    inStock: true,
    detailUrl: '/devices/aquos-r9',
  },
]

/**
 * Product Service用MSWハンドラー
 */
export const productHandlers = [
  // 人気端末一覧取得
  http.get('*/api/v1/products/popular', () => {
    const response: PopularDevicesResponse = {
      devices: mockPopularDevices,
      totalCount: mockPopularDevices.length,
    }
    return HttpResponse.json(response)
  }),

  // 端末検索（既存のProduct Service APIと互換）
  http.get('*/api/v1/inventory/search', ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '6')

    const response: PopularDevicesResponse = {
      devices: mockPopularDevices.slice(0, limit),
      totalCount: mockPopularDevices.length,
    }
    return HttpResponse.json(response)
  }),

  // カテゴリ別製品一覧取得
  http.get('*/api/v1/products/categories/:categoryCode', ({ params }) => {
    const { categoryCode } = params

    // iPhoneカテゴリの場合、E2Eテストが期待する5件のデータを返す
    if (categoryCode === 'iphone') {
      const mockIPhoneProducts: ProductCardDto[] = [
        {
          productId: 1,
          productName: 'iPhone 16 Pro Max',
          manufacturer: 'Apple',
          price: 189800,
          originalPrice: 204800,
          monthlyPayment: 7283,
          imageUrls: ['/images/devices/iphone-16-pro-max.png'],
          storageOptions: ['256GB', '512GB', '1TB'],
          colorOptions: [
            { name: 'ナチュラルチタニウム', hex: '#8E8E93' },
            { name: 'ブルーチタニウム', hex: '#5B9BD5' },
            { name: 'ホワイトチタニウム', hex: '#F2F2F7' },
            { name: 'ブラックチタニウム', hex: '#1C1C1E' },
          ],
          campaigns: [
            { campaignCode: 'NEW', badgeText: 'NEW' },
            { campaignCode: 'POPULAR', badgeText: '人気' },
          ],
          inStock: true,
          description: '最新のA18 Proチップ搭載。最大のディスプレイと最長のバッテリー駆動時間。',
        },
        {
          productId: 2,
          productName: 'iPhone 16 Pro',
          manufacturer: 'Apple',
          price: 159800,
          originalPrice: 174800,
          monthlyPayment: 6033,
          imageUrls: ['/images/devices/iphone-16-pro.png'],
          storageOptions: ['128GB', '256GB', '512GB', '1TB'],
          colorOptions: [
            { name: 'ナチュラルチタニウム', hex: '#8E8E93' },
            { name: 'ブルーチタニウム', hex: '#5B9BD5' },
            { name: 'ホワイトチタニウム', hex: '#F2F2F7' },
            { name: 'ブラックチタニウム', hex: '#1C1C1E' },
          ],
          campaigns: [
            { campaignCode: 'NEW', badgeText: 'NEW' },
            { campaignCode: 'POPULAR', badgeText: '人気' },
          ],
          inStock: true,
          description: '最新のA18 Proチップ搭載。プロ仕様のカメラシステム。',
        },
        {
          productId: 3,
          productName: 'iPhone 16 Plus',
          manufacturer: 'Apple',
          price: 134800,
          monthlyPayment: 5617,
          imageUrls: ['/images/devices/iphone-16-plus.png'],
          storageOptions: ['128GB', '256GB', '512GB'],
          colorOptions: [
            { name: 'ブラック', hex: '#1C1C1E' },
            { name: 'ホワイト', hex: '#F2F2F7' },
            { name: 'ピンク', hex: '#FFB6C1' },
            { name: 'ティール', hex: '#008080' },
            { name: 'ウルトラマリン', hex: '#4169E1' },
          ],
          campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
          inStock: true,
          description: 'A18チップ搭載。大画面で楽しむエンターテインメント。',
        },
        {
          productId: 4,
          productName: 'iPhone 16',
          manufacturer: 'Apple',
          price: 124800,
          monthlyPayment: 5200,
          imageUrls: ['/images/devices/iphone-16.png'],
          storageOptions: ['128GB', '256GB', '512GB'],
          colorOptions: [
            { name: 'ブラック', hex: '#1C1C1E' },
            { name: 'ホワイト', hex: '#F2F2F7' },
            { name: 'ピンク', hex: '#FFB6C1' },
            { name: 'ティール', hex: '#008080' },
            { name: 'ウルトラマリン', hex: '#4169E1' },
          ],
          campaigns: [{ campaignCode: 'NEW', badgeText: 'NEW' }],
          inStock: true,
          description: 'A18チップ搭載。進化したカメラとバッテリー。',
        },
        {
          productId: 5,
          productName: 'iPhone 15',
          manufacturer: 'Apple',
          price: 112800,
          originalPrice: 124800,
          monthlyPayment: 4700,
          imageUrls: ['/images/devices/iphone-15.png'],
          storageOptions: ['128GB', '256GB', '512GB'],
          colorOptions: [
            { name: 'ブラック', hex: '#1C1C1E' },
            { name: 'ブルー', hex: '#5B9BD5' },
            { name: 'グリーン', hex: '#90EE90' },
            { name: 'イエロー', hex: '#FFD700' },
            { name: 'ピンク', hex: '#FFB6C1' },
          ],
          campaigns: [{ campaignCode: 'RECOMMEND', badgeText: 'おすすめ' }],
          inStock: true,
          description: 'A16 Bionicチップ搭載。お求めやすい価格で高性能。',
        },
      ]

      const response: CategoryDetailResponse = {
        categoryCode: 'iphone',
        categoryName: 'iPhone',
        products: mockIPhoneProducts,
        totalCount: mockIPhoneProducts.length,
      }
      return HttpResponse.json(response)
    }

    // その他のカテゴリは空のレスポンスを返す
    const response: CategoryDetailResponse = {
      categoryCode: categoryCode as string,
      categoryName: '',
      products: [],
      totalCount: 0,
    }
    return HttpResponse.json(response)
  }),
]
