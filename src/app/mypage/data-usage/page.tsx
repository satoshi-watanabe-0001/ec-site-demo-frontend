/**
 * @fileoverview データ使用量詳細ページ
 * @module app/mypage/data-usage/page
 *
 * 現在のデータ使用量、日別使用量グラフ、月別使用量履歴を表示。
 * CSSのみの実装（外部チャートライブラリ不使用）。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { DataUsageProgressBar } from '@/components/mypage'
import { getDataUsageDetail } from '@/services/accountService'
import type { DataUsageDetailResponse } from '@/types/account'

/**
 * データ使用量詳細ページコンポーネント
 */
export default function DataUsagePage() {
  const [data, setData] = useState<DataUsageDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDataUsageDetail()
        setData(result)
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const maxDailyUsage = Math.max(...data.dailyHistory.map(d => d.usage), 1)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">データ使用量</h2>

      {/* 現在の使用量 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">今月の使用量</h3>
        <DataUsageProgressBar usedData={data.current.usedData} totalData={data.current.totalData} />
        <p className="mt-2 text-xs text-slate-500">
          最終更新: {new Date(data.current.updatedAt).toLocaleString('ja-JP')}
        </p>
      </section>

      {/* 日別使用量グラフ */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">日別使用量（直近15日間）</h3>
        <div className="flex items-end gap-1 sm:gap-2" style={{ height: '200px' }}>
          {data.dailyHistory.map(day => {
            const height = (day.usage / maxDailyUsage) * 100
            const dateStr = day.date.slice(5) // MM-DD
            return (
              <div
                key={day.date}
                className="group relative flex flex-1 flex-col items-center"
                style={{ height: '100%' }}
              >
                <div className="flex flex-1 w-full items-end">
                  <div
                    className="w-full rounded-t bg-primary transition-colors group-hover:bg-primary/80"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    title={`${day.date}: ${day.usage}GB`}
                  />
                </div>
                <span className="mt-1 text-[10px] text-slate-500 sm:text-xs">{dateStr}</span>
                {/* ツールチップ */}
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {day.usage}GB
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 月別使用量履歴 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">月別使用量履歴</h3>
        <div className="space-y-3">
          {data.monthlyHistory.map(month => {
            const percentage =
              month.capacity > 0 ? Math.min((month.usage / month.capacity) * 100, 100) : 0
            return (
              <div key={month.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{month.month}</span>
                  <span className="text-white">
                    {month.usage.toFixed(1)}GB / {month.capacity}GB
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
