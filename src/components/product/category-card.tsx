/**
 * @fileoverview カテゴリカードコンポーネント
 * @module components/product/category-card
 *
 * 製品カテゴリを表示するカードコンポーネント。
 * 画像、カテゴリ名、説明（オプション）、矢印アイコンを表示。
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/category'

/**
 * カテゴリカードコンポーネントのProps型定義
 */
interface CategoryCardProps {
  /** カテゴリデータ */
  category: Category
  /** 追加のCSSクラス */
  className?: string
}

/**
 * カテゴリカードコンポーネント
 *
 * 製品カテゴリを表示するカード。以下の機能を提供:
 * - カテゴリ画像の表示
 * - カテゴリ名の表示
 * - 説明文の表示（オプション）
 * - クリック可能な矢印アイコン
 * - ホバーエフェクト
 *
 * @param props - カテゴリカードのプロパティ
 * @returns カテゴリカード要素
 */
export function CategoryCard({ category, className }: CategoryCardProps): React.ReactElement {
  return (
    <Link
      href={`/products/${category.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
    >
      {/* カテゴリ画像 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* カテゴリ情報 */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
          {category.description && (
            <p className="mt-1 text-sm text-gray-600">{category.description}</p>
          )}
        </div>

        {/* 矢印アイコン */}
        <div className="flex-shrink-0 ml-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}
