/**
 * @fileoverview データ通信量詳細ページ
 * @module app/mypage/data-usage/page
 *
 * データ通信量の詳細情報、日別・月別の使用量履歴、チャージ履歴を表示するページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useDataUsage } from '@/hooks'
import { DataUsageCard } from '@/components/mypage'

/**
 * データ通信量詳細ページコンポーネント
 *
 * @returns データ通信量詳細ページ要素
 */
export default function DataUsagePage(): React.ReactElement {
  const { data: dataUsage, isLoading, error } = useDataUsage()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
        <span className="ml-3 text-slate-400">読み込み中...</span>
      </div>
    )
  }

  if (error || !dataUsage) {
    return (
      <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm" role="alert">
        データ通信量の取得に失敗しました。
      </div>
    )
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">データ通信量</h1>
      </div>

      <div className="space-y-6">
        {/* 当月サマリー */}
        <DataUsageCard
          currentUsageGB={dataUsage.currentUsageGB}
          currentCapacityGB={dataUsage.currentCapacityGB}
          remainingGB={dataUsage.remainingGB}
        />

        {/* 日別使用量 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">日別使用量（当月）</h2>
          <div className="space-y-2">
            {dataUsage.dailyUsage.map(day => {
              const barWidth = Math.min((day.usageGB / 3) * 100, 100) // 3GBを最大幅とする
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="w-24 flex-shrink-0 text-sm text-slate-400">
                    {new Date(day.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1">
                    <div className="h-6 w-full rounded bg-slate-700">
                      <div
                        className="flex h-full items-center rounded bg-blue-500/60 px-2 text-xs text-white transition-all duration-300"
                        style={{ width: `${Math.max(barWidth, 8)}%` }}
                      >
                        {day.usageGB.toFixed(1)}GB
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 月別履歴 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">月別使用量履歴</h2>
          <div className="space-y-3">
            {dataUsage.monthlyHistory.map(month => {
              const usagePercent = (month.usageGB / month.capacityGB) * 100
              return (
                <div key={month.month} className="rounded-lg border border-slate-700 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{month.month}</span>
                    <span className="text-sm text-slate-400">
                      {month.usageGB.toFixed(1)}GB / {month.capacityGB}GB
                    </span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-slate-700"
                    role="progressbar"
                    aria-valuenow={month.usageGB}
                    aria-valuemin={0}
                    aria-valuemax={month.capacityGB}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent >= 95 ? 'bg-red-500' : usagePercent >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* チャージ履歴 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">データチャージ履歴</h2>
          {dataUsage.chargeHistory.length === 0 ? (
            <p className="text-sm text-slate-400">チャージ履歴はありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">日時</th>
                    <th className="px-4 py-3 text-right text-slate-400 font-medium">容量</th>
                    <th className="px-4 py-3 text-right text-slate-400 font-medium">料金</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUsage.chargeHistory.map(charge => (
                    <tr key={charge.chargeId} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">
                        {new Date(charge.chargedAt).toLocaleString('ja-JP')}
                      </td>
                      <td className="px-4 py-3 text-right text-white">+{charge.amountGB}GB</td>
                      <td className="px-4 py-3 text-right text-white">
                        ¥{charge.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
