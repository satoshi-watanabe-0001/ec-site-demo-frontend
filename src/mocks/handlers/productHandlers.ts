/**
 * @fileoverview Product Service用MSWハンドラー
 * @module mocks/handlers/productHandlers
 *
 * 人気端末データのモックハンドラー。
 * Product Serviceが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type { Device, PopularDevicesResponse } from '@/types'

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
    labels: ['NEW', '人気'],
    description: '最新のA18 Proチップ搭載。プロ仕様のカメラシステム。',
    inStock: true,
    detailUrl: '/devices/iphone-16-pro',
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
]
