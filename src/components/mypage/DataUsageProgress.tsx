/**
 * @fileoverview データ使用量プログレスバーコンポーネント
 * @module components/mypage/DataUsageProgress
 *
 * ダッシュボードに表示するデータ使用量のプログレスバー。
 */

'use client'

import React from 'react'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { DataUsage } from '@/types/data-usage'

/**
 * データ使用量プログレスのProps型定義
 */
interface DataUsageProgressProps {
  /** データ使用状況 */
  dataUsage: DataUsage
}

/**
 * 使用率に応じたプログレスバーの色を取得
 */
function getProgressColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-blue-500'
}

/**
 * データ使用量プログレスバーコンポーネント
 *
 * @param props - プログレスバーのプロパティ
 * @returns データ使用量プログレスバー要素
 */
export function DataUsageProgress({ dataUsage }: DataUsageProgressProps): React.ReactElement {
  const updatedDate = new Date(dataUsage.updatedAt)
  const formattedDate = new Intl.DateTimeFormat('ja-JP', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(updatedDate)

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl sm:text-3xl font-bold text-white">{dataUsage.usedData}</span>
          <span className="ml-1 text-sm text-slate-400">GB</span>
          <span className="mx-1 text-sm text-slate-500">/</span>
          <span className="text-sm text-slate-400">{dataUsage.totalData}GB</span>
        </div>
        <span className="text-sm text-slate-400">残り {dataUsage.remainingData}GB</span>
      </div>

      <ProgressBar
        value={dataUsage.usagePercentage}
        colorClass={getProgressColor(dataUsage.usagePercentage)}
        label="データ使用量"
      />

      <p className="text-xs text-slate-500">{formattedDate} 時点</p>
    </div>
  )
}
