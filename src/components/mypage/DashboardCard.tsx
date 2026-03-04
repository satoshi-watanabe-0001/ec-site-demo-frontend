/**
 * @fileoverview ダッシュボードカードコンポーネント
 * @module components/mypage/DashboardCard
 *
 * マイページダッシュボードで使用する再利用可能なカードコンポーネント。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * ダッシュボードカードのProps
 */
interface DashboardCardProps {
  /** カードタイトル */
  title: string
  /** リンク先（詳細ページ） */
  href?: string
  /** リンクテキスト */
  linkText?: string
  /** 追加のCSSクラス */
  className?: string
  /** 子要素 */
  children: React.ReactNode
}

/**
 * ダッシュボードカードコンポーネント
 *
 * 各セクションの情報を表示するカード。
 * オプションで詳細ページへのリンクを含む。
 */
export function DashboardCard({
  title,
  href,
  linkText = '詳細を見る',
  className,
  children,
}: DashboardCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-md',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {linkText} &rarr;
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
