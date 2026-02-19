/**
 * @fileoverview データ使用量ウィジェットコンポーネント
 * @module components/mypage/Dashboard/DataUsageWidget
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { DataUsageSummary } from '@/types'

interface DataUsageWidgetProps {
  dataUsage: DataUsageSummary
}

export function DataUsageWidget({ dataUsage }: DataUsageWidgetProps): React.ReactElement {
  const getBarColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-cyan-500'
  }

  const lastUpdated = new Date(dataUsage.lastUpdated)
  const formattedTime = `${lastUpdated.getMonth() + 1}/${lastUpdated.getDate()} ${lastUpdated.getHours()}:${String(lastUpdated.getMinutes()).padStart(2, '0')}`

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">データ使用量</h3>
        <Link
          href="/mypage/data-usage"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          詳細を見る →
        </Link>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-white">{dataUsage.usedGB}</span>
        <span className="text-sm text-slate-400">/ {dataUsage.totalGB}GB</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-3 mb-3" role="progressbar" aria-valuenow={dataUsage.usagePercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getBarColor(dataUsage.usagePercentage)}`}
          style={{ width: `${dataUsage.usagePercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">
          残り <span className="text-white font-medium">{dataUsage.remainingGB}GB</span>
        </span>
        <span className="text-slate-500">最終更新: {formattedTime}</span>
      </div>
    </div>
  )
}
