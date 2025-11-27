/**
 * @fileoverview 人気端末セクションコンポーネント
 * @module components/sections/PopularDevicesSection
 *
 * 人気端末をグリッド形式で表示するセクション。
 * ホバーエフェクトとレスポンシブデザイン対応。
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Device, DeviceLabel, ColorOption } from '@/types'

/**
 * モック用人気端末データ
 * MSWが有効でない場合のフォールバック
 */
const mockDevices: Device[] = [
  {
    id: 'device-001',
    name: 'iPhone 16 Pro',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone-16-pro.png',
    price: 159800,
    labels: ['NEW', '人気'],
    description: '最新のA18 Proチップ搭載',
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
    description: 'A18チップ搭載',
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
    description: 'AIを搭載した究極のGalaxy',
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
    description: 'コンパクトながらパワフル',
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
    description: 'プロフェッショナルなカメラ性能',
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
    description: 'Leicaカメラ搭載',
    inStock: true,
    detailUrl: '/devices/aquos-r9',
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
 * カラードットコンポーネントのProps
 */
interface ColorDotsProps {
  /** カラーオプション配列 */
  colors: ColorOption[]
  /** 表示する最大数 */
  maxVisible?: number
}

/**
 * カラードットコンポーネント
 * カラーオプションを小さな円で表示
 */
function ColorDots({ colors, maxVisible = 4 }: ColorDotsProps): React.ReactElement {
  const visibleColors = colors.slice(0, maxVisible)
  const remainingCount = colors.length - maxVisible

  return (
    <div className="flex items-center gap-1">
      {visibleColors.map((color, index) => (
        <div
          key={index}
          className="w-3 h-3 rounded-full border border-gray-300"
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500">+{remainingCount}</span>
      )}
    </div>
  )
}

/**
 * 端末カードのProps
 */
interface DeviceCardProps {
  device: Device
}

/**
 * 端末カードコンポーネント
 */
function DeviceCard({ device }: DeviceCardProps): React.ReactElement {
  return (
    <article
      className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      aria-labelledby={`device-${device.id}-title`}
    >
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
                // 画像が見つからない場合のフォールバック
                const target = e.target as HTMLImageElement
                target.src = '/images/devices/placeholder.png'
              }}
            />
          </div>
        </div>

        {/* 端末情報 */}
        <div className="p-4 space-y-2">
          <p className="text-sm text-gray-500 mb-1">{device.manufacturer}</p>
          <h3
            id={`device-${device.id}-title`}
            className="text-lg font-bold text-gray-900 mb-1 line-clamp-2"
          >
            {device.name}
          </h3>

          {device.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{device.description}</p>
          )}

          {/* ストレージオプション（オプション） */}
          {device.storageOptions && device.storageOptions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>容量:</span>
              <div className="flex gap-1 flex-wrap">
                {device.storageOptions.slice(0, 3).map((storage, index) => (
                  <span key={index} className="px-1.5 py-0.5 bg-gray-100 rounded">
                    {storage}
                  </span>
                ))}
                {device.storageOptions.length > 3 && (
                  <span className="text-gray-500">+{device.storageOptions.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* カラーオプション（オプション） */}
          {device.colorOptions && device.colorOptions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">カラー:</span>
              <ColorDots colors={device.colorOptions} maxVisible={4} />
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl font-bold text-gray-900">
              {device.price.toLocaleString()}円
            </span>
            {device.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {device.originalPrice.toLocaleString()}円
              </span>
            )}
          </div>

          {/* 月額料金（オプション） */}
          {device.monthlyPayment && (
            <p className="text-sm text-gray-600">
              月々{device.monthlyPayment.toLocaleString()}円〜
            </p>
          )}

          {!device.inStock && <p className="text-sm text-red-500 mt-2">現在在庫切れ</p>}
        </div>
      </Link>
    </article>
  )
}

/**
 * 人気端末セクションコンポーネント
 *
 * @returns 人気端末セクション要素
 */
export function PopularDevicesSection(): React.ReactElement {
  // 静的データを使用（MSWが有効な場合はAPIから取得可能）
  const devices = mockDevices

  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="devices-section-title">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="devices-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            人気端末
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ahamoで使える最新スマートフォンをご紹介。5G対応機種も多数ラインナップ。
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/devices"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-600 bg-transparent hover:bg-slate-700 hover:text-white h-11 rounded-md px-8"
          >
            すべての端末を見る
          </Link>
        </div>
      </div>
    </section>
  )
}
