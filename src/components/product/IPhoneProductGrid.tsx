/**
 * @fileoverview iPhoneプロダクトグリッドコンポーネント
 * @module components/product/IPhoneProductGrid
 *
 * PBI-DP-002: iPhoneカテゴリページ閲覧機能 (EC-269)
 * EC-272: API統合実装
 *
 * iPhone製品をグリッド形式で表示するコンポーネント。
 * ストレージオプション、カラーバリエーション、価格情報を含む。
 * バックエンドAPIからデータを取得し、クライアントサイドでソートを行う。
 */

'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useCategoryProducts } from '@/hooks/useCategoryProducts'
import { mapProductCardDtosToDevices } from '@/lib/productMapper'
import type { Device, DeviceLabel, ColorOption } from '@/types'

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
 * - ソート機能（名前順、価格順）- クライアントサイドソートを採用（シンプルさとUX向上のため）
 * - 製品数の表示
 * - ローディング状態の表示
 * - エラー状態の表示
 *
 * @param props - グリッドのプロパティ
 * @returns iPhoneプロダクトグリッド要素
 */
export function IPhoneProductGrid({ className }: IPhoneProductGridProps): React.ReactElement {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // バックエンドAPIからiPhoneカテゴリの製品を取得
  const { data, isLoading, error } = useCategoryProducts('iphone')

  // APIレスポンスをDevice型に変換
  const devices: Device[] = useMemo(() => {
    if (!data?.products) return []
    return mapProductCardDtosToDevices(data.products)
  }, [data?.products])

  // クライアントサイドでソート（シンプルさとUX向上のため）
  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      // 価格順は高い順（降順）
      return b.price - a.price
    })
  }, [devices, sortBy])

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600">製品を読み込み中...</span>
        </div>
      </div>
    )
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">製品の読み込みに失敗しました</p>
          <p className="text-sm text-red-500 mt-1">しばらくしてから再度お試しください</p>
        </div>
      </div>
    )
  }

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
