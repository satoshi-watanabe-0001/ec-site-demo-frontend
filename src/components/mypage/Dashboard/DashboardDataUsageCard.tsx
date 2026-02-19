'use client'

import React from 'react'

interface DashboardDataUsageCardProps {
  usedGB: number
  totalCapacityGB: number
  remainingGB: number
  usagePercent: number
  lastUpdated: string
}

export function DashboardDataUsageCard({
  usedGB,
  totalCapacityGB,
  remainingGB,
  usagePercent,
  lastUpdated,
}: DashboardDataUsageCardProps): React.ReactElement {
  const getProgressColor = (percent: number): string => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-teal-500'
  }

  const formattedDate = new Date(lastUpdated).toLocaleString('ja-JP', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="data-usage-card">
      <h3 className="text-sm font-medium text-slate-400 mb-3">今月のデータ使用量</h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-white">{usedGB}</span>
        <span className="text-sm text-slate-400">/ {totalCapacityGB}GB</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(usagePercent)}`}
          style={{ width: `${Math.min(usagePercent, 100)}%` }}
          role="progressbar"
          aria-valuenow={usagePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`データ使用量 ${usagePercent}%`}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">残り {remainingGB}GB</span>
        <span className="text-slate-500">最終更新: {formattedDate}</span>
      </div>
    </div>
  )
}
