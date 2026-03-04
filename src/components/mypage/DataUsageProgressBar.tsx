/**
 * @fileoverview データ使用量プログレスバーコンポーネント
 * @module components/mypage/DataUsageProgressBar
 *
 * データ使用量を視覚的に表示するプログレスバー。
 * CSSのみで実装（外部ライブラリ不要）。
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * データ使用量プログレスバーのProps
 */
interface DataUsageProgressBarProps {
  /** 使用済みデータ量（GB） */
  usedData: number
  /** 合計データ量（GB） */
  totalData: number
  /** 追加のCSSクラス */
  className?: string
}

/**
 * 使用率に基づいてバーの色を返す
 */
function getBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-primary'
}

/**
 * データ使用量プログレスバーコンポーネント
 *
 * データ使用量を棒グラフで視覚的に表示。
 * 使用率に応じて色が変化する。
 */
export function DataUsageProgressBar({
  usedData,
  totalData,
  className,
}: DataUsageProgressBarProps): React.ReactElement {
  const percentage = totalData > 0 ? Math.min((usedData / totalData) * 100, 100) : 0
  const remainingData = Math.max(totalData - usedData, 0)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-white">{usedData.toFixed(1)}</span>
          <span className="ml-1 text-sm text-slate-400">GB 使用済み</span>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-400">残り </span>
          <span className="text-lg font-semibold text-white">{remainingData.toFixed(1)}</span>
          <span className="ml-1 text-sm text-slate-400">GB</span>
        </div>
      </div>
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`データ使用量: ${usedData.toFixed(1)}GB / ${totalData}GB`}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', getBarColor(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>0 GB</span>
        <span>{totalData} GB</span>
      </div>
    </div>
  )
}
