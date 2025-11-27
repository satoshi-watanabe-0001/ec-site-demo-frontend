/**
 * @fileoverview iPhoneプロダクトグリッドコンポーネント
 * @module components/product/IPhoneProductGrid
 *
 * PBI-DP-002: iPhoneカテゴリページ閲覧機能 (EC-269)
 *
 * iPhone製品をグリッド形式で表示するコンポーネント。
 * ストレージオプション、カラーバリエーション、価格情報を含む。
 */

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Device, DeviceLabel, ColorOption } from '@/types'

/**
 * モック用iPhoneデータ
 * MSWが有効でない場合のフォールバック
 */
const mockIPhoneDevices: Device[] = [
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-16-pro-max.png',
    price: 189800,
    originalPrice: 204800,
    labels: ['NEW', '人気'],
    description: '最新のA18 Proチップ搭載。最大のディスプレイと最長のバッテリー駆動時間。',
    inStock: true,
    detailUrl: '/devices/iphone-16-pro-max',
    storageOptions: ['256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'ナチュラルチタニウム', hex: '#8E8E93' },
      { name: 'ブルーチタニウム', hex: '#5B9BD5' },
      { name: 'ホワイトチタニウム', hex: '#F2F2F7' },
      { name: 'ブラックチタニウム', hex: '#1C1C1E' },
    ],
    monthlyPayment: 7283,
  },
  {
    id: 'iphone-16-pro',
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
    monthlyPayment: 6033,
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-16-plus.png',
    price: 134800,
    labels: ['NEW'],
    description: 'A18チップ搭載。大画面で楽しむエンターテインメント。',
    inStock: true,
    detailUrl: '/devices/iphone-16-plus',
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ホワイト', hex: '#F2F2F7' },
      { name: 'ピンク', hex: '#FFB6C1' },
      { name: 'ティール', hex: '#008080' },
      { name: 'ウルトラマリン', hex: '#4169E1' },
    ],
    monthlyPayment: 5617,
  },
  {
    id: 'iphone-16',
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
    id: 'iphone-15',
    name: 'iPhone 15',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-15.png',
    price: 112800,
    originalPrice: 124800,
    labels: ['おすすめ'],
    description: 'A16 Bionicチップ搭載。お求めやすい価格で高性能。',
    inStock: true,
    detailUrl: '/devices/iphone-15',
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'ブラック', hex: '#1C1C1E' },
      { name: 'ブルー', hex: '#5B9BD5' },
      { name: 'グリーン', hex: '#90EE90' },
      { name: 'イエロー', hex: '#FFD700' },
      { name: 'ピンク', hex: '#FFB6C1' },
    ],
    monthlyPayment: 4700,
  },
]

/**
 * ラベルの色を取得
 */
function getLabelColor(label: DeviceLabel): string {
  const colors: Record<DeviceLabel, string> = {
    NEW: 'bg-blue-500',
    人気: 'bg-red-500',
    おすすめ: 'bg-green-500',
    在庫わずか: 'bg-yellow-500',
  }
  return colors[label]
}

/**
 * カラードットコンポーネント
 */
interface ColorDotsProps {
  colors: ColorOption[]
  maxVisible?: number
}

function ColorDots({ colors, maxVisible = 5 }: ColorDotsProps): React.ReactElement {
  const visibleColors = colors.slice(0, maxVisible)
  const remainingCount = colors.length - maxVisible

  return (
    <div className="flex items-center gap-1">
      {visibleColors.map((color, index) => (
        <div
          key={index}
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
      {remainingCount > 0 && <span className="text-xs text-gray-500">+{remainingCount}</span>}
    </div>
  )
}

/**
 * iPhoneカードコンポーネント
 */
interface IPhoneCardProps {
  device: Device
}

function IPhoneCard({ device }: IPhoneCardProps): React.ReactElement {
  return (
    <article
      className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      aria-labelledby={`device-${device.id}-title`}
    >
      {/* セールラベル */}
      {device.originalPrice && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 text-center">
          最大{(device.originalPrice - device.price).toLocaleString()}円引き
        </div>
      )}

      <Link href={device.detailUrl} className="block">
        {/* ラベル */}
        {device.labels.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            {device.labels.map(label => (
              <span
                key={label}
                className={cn(
                  'text-white text-xs font-bold px-2 py-1 rounded',
                  getLabelColor(label)
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* 端末画像 */}
        <div className="relative h-48 md:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
          <div className="relative w-32 h-40 md:w-40 md:h-48 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={device.imageUrl}
              alt={device.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 128px, 160px"
              onError={e => {
                const target = e.target as HTMLImageElement
                target.src = '/images/devices/placeholder.png'
              }}
            />
          </div>
        </div>

        {/* 端末情報 */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">{device.manufacturer}</p>
            <h3 id={`device-${device.id}-title`} className="text-lg font-bold text-gray-900 mb-1">
              {device.name}
            </h3>
          </div>

          {/* ストレージオプション */}
          {device.storageOptions && device.storageOptions.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>容量:</span>
              <div className="flex gap-1.5 flex-wrap">
                {device.storageOptions.map((storage, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                    {storage}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* カラーオプション */}
          {device.colorOptions && device.colorOptions.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1.5">カラー:</p>
              <ColorDots colors={device.colorOptions} maxVisible={5} />
            </div>
          )}

          {/* 価格情報 */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {device.price.toLocaleString()}円〜
              </span>
              {device.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {device.originalPrice.toLocaleString()}円
                </span>
              )}
            </div>
            {device.monthlyPayment && (
              <p className="text-sm text-gray-600">
                月々{device.monthlyPayment.toLocaleString()}円〜（24回払い）
              </p>
            )}
          </div>

          {!device.inStock && <p className="text-sm text-red-500">現在在庫切れ</p>}
        </div>
      </Link>

      {/* ドコモオンラインショップリンク */}
      <div className="px-4 pb-4">
        <a
          href="https://onlineshop.smt.docomo.ne.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 rounded-md font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          ドコモオンラインショップで購入
        </a>
      </div>
    </article>
  )
}

/**
 * iPhoneプロダクトグリッドのProps型定義
 */
interface IPhoneProductGridProps {
  /** 追加のCSSクラス */
  className?: string
}

/**
 * iPhoneプロダクトグリッドコンポーネント
 *
 * iPhone製品をグリッド形式で表示。以下の機能を提供:
 * - 3カラムレスポンシブグリッド
 * - ソート機能（名前順、価格順）
 * - 製品数の表示
 *
 * @param props - グリッドのプロパティ
 * @returns iPhoneプロダクトグリッド要素
 */
export function IPhoneProductGrid({ className }: IPhoneProductGridProps): React.ReactElement {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const devices = mockIPhoneDevices

  const sortedDevices = [...devices].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return b.price - a.price
  })

  return (
    <div className={className}>
      {/* ソートコントロール */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{devices.length}件の製品が見つかりました</p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            並び替え:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'price')}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">名前順</option>
            <option value="price">価格順</option>
          </select>
        </div>
      </div>

      {/* 製品グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDevices.map(device => (
          <IPhoneCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  )
}
