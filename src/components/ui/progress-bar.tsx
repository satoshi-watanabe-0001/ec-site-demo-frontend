/**
 * @fileoverview プログレスバーコンポーネント
 * @module components/ui/progress-bar
 *
 * データ使用量などの進捗表示に使用する汎用プログレスバー。
 * アクセシビリティ対応済み。
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * プログレスバーコンポーネントのProps型定義
 */
interface ProgressBarProps {
  /** 進捗値（0-100） */
  value: number
  /** 最大値（デフォルト100） */
  max?: number
  /** バーの色クラス */
  colorClass?: string
  /** 追加のCSSクラス */
  className?: string
  /** ラベル（アクセシビリティ用） */
  label?: string
}

/**
 * プログレスバーコンポーネント
 *
 * @param props - プログレスバーのプロパティ
 * @returns プログレスバー要素
 */
export function ProgressBar({
  value,
  max = 100,
  colorClass = 'bg-blue-500',
  className,
  label = '進捗',
}: ProgressBarProps): React.ReactElement {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
