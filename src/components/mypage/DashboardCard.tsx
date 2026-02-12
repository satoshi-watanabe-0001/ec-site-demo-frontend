/**
 * @fileoverview ダッシュボードカードコンポーネント
 * @module components/mypage/DashboardCard
 *
 * マイページダッシュボードの各セクション表示用カード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ダッシュボードカードのProps型定義
 */
interface DashboardCardProps {
  /** カードタイトル */
  title: string
  /** リンク先URL */
  href?: string
  /** アイコン */
  icon?: React.ReactNode
  /** 追加のCSSクラス */
  className?: string
  /** 子要素 */
  children: React.ReactNode
}

/**
 * ダッシュボードカードコンポーネント
 *
 * @param props - カードのプロパティ
 * @returns ダッシュボードカード要素
 */
export function DashboardCard({
  title,
  href,
  icon,
  className,
  children,
}: DashboardCardProps): React.ReactElement {
  const content = (
    <div
      className={cn(
        'rounded-xl bg-slate-800 p-4 sm:p-6 transition-all duration-300',
        href && 'hover:bg-slate-750 hover:shadow-lg cursor-pointer group',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-400">{icon}</span>}
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
        </div>
        {href && (
          <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
        )}
      </div>
      {children}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}
