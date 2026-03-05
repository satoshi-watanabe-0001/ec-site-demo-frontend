/**
 * @fileoverview データ使用量ページ
 * @module app/mypage/data-usage/page
 *
 * 当月のデータ使用量、日別推移、月別トレンド、チャージ履歴を表示。
 * CSS/SVGベースのチャートで可視化。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getDataUsage } from '@/services/accountService'
import type { DataUsage, DailyDataUsage, MonthlyDataUsage } from '@/types'

/**
 * 日別データ使用量バーチャートコンポーネント
 */
function DailyUsageChart({ data }: { data: DailyDataUsage[] }): React.ReactElement {
  const maxUsage = Math.max(...data.map(d => d.usageGb), 1)

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-1 min-w-max h-40 px-2">
        {data.map(day => {
          const height = (day.usageGb / maxUsage) * 100
          const dayLabel = new Date(day.date).getDate().toString()
          return (
            <div key={day.date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]">
              <span className="text-xs text-slate-400">{day.usageGb.toFixed(1)}</span>
              <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                <div
                  className="w-5 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-sm transition-all duration-300 hover:from-orange-400 hover:to-orange-300"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${day.usageGb.toFixed(1)}GB`}
                />
              </div>
              <span className="text-xs text-slate-500">{dayLabel}日</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 月別データ使用量チャートコンポーネント
 */
function MonthlyUsageChart({ data }: { data: MonthlyDataUsage[] }): React.ReactElement {
  const maxCapacity = Math.max(...data.map(d => d.capacityGb))

  return (
    <div className="space-y-3">
      {data.map(month => {
        const percentage = (month.usageGb / month.capacityGb) * 100
        const monthLabel = month.month.replace('-', '年') + '月'
        return (
          <div key={month.month} className="flex items-center gap-3">
            <span className="text-sm text-slate-400 w-24 flex-shrink-0">{monthLabel}</span>
            <div className="flex-1">
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    percentage >= 90
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : percentage >= 70
                        ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  )}
                  style={{ width: `${Math.min(percentage, 100) * (month.capacityGb / maxCapacity)}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-white w-20 text-right flex-shrink-0">
              {month.usageGb.toFixed(1)}GB
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * データ使用量ページコンポーネント
 *
 * @returns データ使用量ページ要素
 */
export default function DataUsagePage(): React.ReactElement {
  const [data, setData] = useState<DataUsage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const usage = await getDataUsage()
        setData(usage)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (!data) return <div />

  const usagePercentage = (data.usedGb / data.totalGb) * 100

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">データ使用量</h1>
        <p className="text-slate-400 mt-1">今月のデータ使用量と履歴をご確認いただけます</p>
      </div>

      {/* 現在の使用量サマリー */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">今月のデータ使用量</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* 円グラフ風の表示 */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#usageGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${usagePercentage * 3.14} ${(100 - usagePercentage) * 3.14}`}
                />
                <defs>
                  <linearGradient id="usageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">{usagePercentage.toFixed(0)}</span>
                  <span className="text-sm text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 数値情報 */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">使用済み</p>
              <p className="text-2xl font-bold text-orange-500">{data.usedGb.toFixed(1)}GB</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">残り</p>
              <p className="text-2xl font-bold text-cyan-400">{data.remainingGb.toFixed(1)}GB</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">合計</p>
              <p className="text-2xl font-bold text-white">{data.totalGb}GB</p>
            </div>
          </div>
        </div>
      </section>

      {/* 日別使用量チャート */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">日別使用量（今月）</h2>
        <DailyUsageChart data={data.dailyUsage} />
      </section>

      {/* 月別使用量チャート */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">月別使用量（過去6ヶ月）</h2>
        <MonthlyUsageChart data={data.monthlyUsage} />
      </section>

      {/* データチャージ履歴 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">データチャージ履歴</h2>
        {data.chargeHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">チャージ日</th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">容量</th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">料金</th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">有効期限</th>
                </tr>
              </thead>
              <tbody>
                {data.chargeHistory.map((charge, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-2 text-white">{charge.date}</td>
                    <td className="py-3 px-2 text-white text-right">{charge.amountGb}GB</td>
                    <td className="py-3 px-2 text-white text-right">{charge.price.toLocaleString()}円</td>
                    <td className="py-3 px-2 text-slate-400 text-right">{charge.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400">データチャージ履歴はありません</p>
        )}
      </section>
    </div>
  )
}
