'use client'

import React from 'react'
import type { DataUsageInfo } from '@/types'

interface DataUsageSummaryProps {
  dataUsage: DataUsageInfo
}

export function DataUsageSummary({ dataUsage }: DataUsageSummaryProps): React.ReactElement {
  const getProgressColor = (percent: number): string => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-teal-500'
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="data-usage-summary">
      <h2 className="text-lg font-bold text-white mb-4">データ使用量サマリー</h2>
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-white mb-1">{dataUsage.usedGB}GB</div>
        <div className="text-slate-400">/ {dataUsage.totalCapacityGB}GB</div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 mb-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(dataUsage.usagePercent)}`}
          style={{ width: `${Math.min(dataUsage.usagePercent, 100)}%` }}
          role="progressbar"
          aria-valuenow={dataUsage.usagePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-400">残りデータ量</p>
          <p className="text-xl font-bold text-teal-400">{dataUsage.remainingGB}GB</p>
        </div>
        <div>
          <p className="text-slate-400">使用率</p>
          <p className="text-xl font-bold text-white">{dataUsage.usagePercent}%</p>
        </div>
        <div>
          <p className="text-slate-400">請求期間</p>
          <p className="text-white">
            {new Date(dataUsage.billingPeriodStart).toLocaleDateString('ja-JP')} 〜{' '}
            {new Date(dataUsage.billingPeriodEnd).toLocaleDateString('ja-JP')}
          </p>
        </div>
        <div>
          <p className="text-slate-400">最終更新</p>
          <p className="text-white">
            {new Date(dataUsage.lastUpdated).toLocaleString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  )
}
