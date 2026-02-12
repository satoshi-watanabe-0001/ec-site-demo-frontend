/**
 * @fileoverview バッジコンポーネント
 * @module components/ui/badge
 *
 * ステータスやカテゴリ表示に使用する汎用バッジ。
 */

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * バッジのバリアント
 */
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

/**
 * バッジコンポーネントのProps型定義
 */
interface BadgeProps {
  /** バッジのバリアント */
  variant?: BadgeVariant
  /** 追加のCSSクラス */
  className?: string
  /** 子要素 */
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-600 text-slate-200',
  success: 'bg-green-600/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
  error: 'bg-red-600/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
}

/**
 * バッジコンポーネント
 *
 * @param props - バッジのプロパティ
 * @returns バッジ要素
 */
export function Badge({
  variant = 'default',
  className,
  children,
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
