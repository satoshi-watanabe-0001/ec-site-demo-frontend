'use client'

/**
 * @fileoverview データ使用量チャートコンポーネント
 * @module components/account/DataUsageChart
 *
 * rechartsを使用してデータ使用量を棒グラフで表示する。
 * 日別・月別の表示モードに対応。
 */

import { lazy, Suspense } from 'react'
import type { DailyUsage, MonthlyUsage } from '@/types'

// rechartsをlazy loadする（パフォーマンス最適化）
const LazyBarChart = lazy(() =>
  import('recharts').then(mod => ({ default: mod.BarChart }))
)
const LazyBar = lazy(() =>
  import('recharts').then(mod => ({ default: mod.Bar }))
)
const LazyXAxis = lazy(() =>
  import('recharts').then(mod => ({ default: mod.XAxis }))
)
const LazyYAxis = lazy(() =>
  import('recharts').then(mod => ({ default: mod.YAxis }))
)
const LazyTooltip = lazy(() =>
  import('recharts').then(mod => ({ default: mod.Tooltip }))
)
const LazyResponsiveContainer = lazy(() =>
  import('recharts').then(mod => ({ default: mod.ResponsiveContainer }))
)

/**
 * DataUsageChartのProps
 */
interface DataUsageChartProps {
  /** 表示データ（日別または月別） */
  data: DailyUsage[] | MonthlyUsage[]
  /** チャートタイプ */
  type: 'daily' | 'monthly'
}

/**
 * チャートのローディングフォールバック
 */
function ChartFallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded bg-slate-700/50">
      <p className="text-sm text-slate-400">グラフを読み込み中...</p>
    </div>
  )
}

/**
 * データ使用量チャートコンポーネント
 *
 * rechartsの棒グラフを使用してデータ使用量を表示する。
 * lazy loadにより初回表示のパフォーマンスを最適化。
 *
 * @param props - コンポーネントプロパティ
 */
export function DataUsageChart({ data, type }: DataUsageChartProps) {
  // 表示用データの整形
  const chartData = data.map(item => {
    if (type === 'daily') {
      const dailyItem = item as DailyUsage
      // 日付を短い形式に変換（例: 3/5）
      const date = new Date(dailyItem.date)
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        usage: dailyItem.usage,
      }
    }
    const monthlyItem = item as MonthlyUsage
    // 月を短い形式に変換（例: 3月）
    const month = monthlyItem.month.split('-')[1]
    return {
      name: `${parseInt(month)}月`,
      usage: monthlyItem.usage,
      limit: monthlyItem.limit,
    }
  })

  return (
    <Suspense fallback={<ChartFallback />}>
      <div className="h-64 w-full">
        <LazyResponsiveContainer width="100%" height="100%">
          <LazyBarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <LazyXAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <LazyYAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              unit="GB"
            />
            <LazyTooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
              formatter={(value: number | string | ReadonlyArray<number | string> | undefined) => [`${value ?? 0}GB`, '使用量']}
            />
            <LazyBar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </LazyBarChart>
        </LazyResponsiveContainer>
      </div>
    </Suspense>
  )
}
