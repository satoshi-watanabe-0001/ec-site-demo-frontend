'use client'

import React from 'react'
import type { DailyUsage } from '@/types'

interface DataUsageChartProps {
  dailyUsage: DailyUsage[]
}

export function DataUsageChart({ dailyUsage }: DataUsageChartProps): React.ReactElement {
  const maxUsage = Math.max(...dailyUsage.map(d => d.usageGB), 1)

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="data-usage-chart">
      <h2 className="text-lg font-bold text-white mb-4">日別データ使用量</h2>
      <div className="flex items-end gap-1 h-40">
        {dailyUsage.map(day => {
          const heightPercent = (day.usageGB / maxUsage) * 100
          const dateLabel = new Date(day.date).getDate()
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative" style={{ height: '120px' }}>
                <div
                  className="absolute bottom-0 w-full bg-teal-500 rounded-t transition-all duration-300 hover:bg-teal-400"
                  style={{ height: `${heightPercent}%` }}
                  title={`${day.date}: ${day.usageGB}GB`}
                />
              </div>
              <span className="text-xs text-slate-500">{dateLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
