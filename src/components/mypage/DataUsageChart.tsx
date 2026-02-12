/**
 * @fileoverview データ使用量グラフコンポーネント
 * @module components/mypage/DataUsageChart
 *
 * データ使用量の日別・月別推移を棒グラフで表示。
 * CSS のみで実装し、外部ライブラリ不要。
 */

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { DailyUsage, MonthlyUsage } from '@/types/data-usage'

/**
 * データ使用量グラフのProps型定義
 */
interface DataUsageChartProps {
  /** 日別使用量 */
  daily: DailyUsage[]
  /** 月別使用量 */
  monthly: MonthlyUsage[]
}

type TabType = 'daily' | 'monthly'

/**
 * データ使用量グラフコンポーネント
 *
 * @param props - グラフのプロパティ
 * @returns データ使用量グラフ要素
 */
export function DataUsageChart({ daily, monthly }: DataUsageChartProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('daily')

  const maxDaily = Math.max(...daily.map(d => d.usage), 1)
  const maxMonthly = Math.max(...monthly.map(m => m.usage), 1)

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="tablist" aria-label="データ使用量表示切替">
        <button
          role="tab"
          aria-selected={activeTab === 'daily'}
          onClick={() => setActiveTab('daily')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          )}
        >
          日別
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'monthly'}
          onClick={() => setActiveTab('monthly')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          )}
        >
          月別
        </button>
      </div>

      <div role="tabpanel" className="overflow-x-auto">
        {activeTab === 'daily' ? (
          <div className="flex items-end gap-1 sm:gap-2 min-w-[300px] h-48">
            {daily.map(d => {
              const height = (d.usage / maxDaily) * 100
              const dateLabel = new Date(d.date).toLocaleDateString('ja-JP', {
                month: 'numeric',
                day: 'numeric',
              })
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400">{d.usage}GB</span>
                  <div className="w-full flex items-end" style={{ height: '120px' }}>
                    <div
                      className="w-full rounded-t bg-blue-500 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{dateLabel}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-end gap-2 sm:gap-4 min-w-[300px] h-48">
            {monthly.map(m => {
              const height = (m.usage / maxMonthly) * 100
              const monthLabel = m.month.replace('-', '/')
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">{m.usage}GB</span>
                  <div className="w-full flex items-end" style={{ height: '120px' }}>
                    <div
                      className="w-full rounded-t bg-blue-500 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{monthLabel}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
