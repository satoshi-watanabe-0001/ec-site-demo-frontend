/**
 * @fileoverview 製品カテゴリトップページ
 * @module app/products/page
 *
 * 製品カテゴリの一覧を表示するページ。
 * iPhone、Android、ドコモ認定リユース品、アクセサリの4カテゴリを表示。
 */

import React from 'react'
import type { Metadata } from 'next'
import { CategoryCard } from '@/components/product'
import type { Category } from '@/types/category'

/**
 * ページメタデータ
 */
export const metadata: Metadata = {
  title: '製品 | ahamo',
  description:
    'ahamoで取り扱っている製品カテゴリ一覧。iPhone、Android、ドコモ認定リユース品、アクセサリをご覧いただけます。',
}

/**
 * 静的カテゴリデータ
 *
 * フロントエンドのみの実装のため、静的データを使用。
 */
const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'iPhone',
    slug: 'iphone',
    imageUrl: '/images/categories/iphone.jpg',
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Android',
    slug: 'android',
    imageUrl: '/images/categories/android.jpg',
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'ドコモ認定リユース品',
    slug: 'docomo-certified',
    imageUrl: '/images/categories/refurbished.jpg',
    description: '30日以内無料交換可能',
    displayOrder: 3,
  },
  {
    id: 4,
    name: 'アクセサリ',
    slug: 'accessories',
    imageUrl: '/images/categories/accessories.jpg',
    displayOrder: 4,
  },
]

/**
 * 製品カテゴリトップページコンポーネント
 *
 * 製品カテゴリの一覧を表示するページ。以下の機能を提供:
 * - パステルカラーの波模様背景
 * - 4つのカテゴリカードをグリッドレイアウトで表示
 * - レスポンシブデザイン（モバイル1列、タブレット2列、デスクトップ2-4列）
 *
 * @returns 製品カテゴリページ要素
 */
export default function ProductsPage(): React.ReactElement {
  return (
    <div className="min-h-screen relative">
      {/* パステルカラーの波模様背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 opacity-90" />
        <svg
          className="absolute bottom-0 left-0 w-full h-64 text-white/30"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-48 text-pink-200/40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-32 text-purple-200/30"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* ページタイトル */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">製品</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ahamoで取り扱っている製品カテゴリをご覧ください。
            お探しの製品カテゴリを選択してください。
          </p>
        </div>

        {/* カテゴリカードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {CATEGORIES.sort((a, b) => a.displayOrder - b.displayOrder).map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
