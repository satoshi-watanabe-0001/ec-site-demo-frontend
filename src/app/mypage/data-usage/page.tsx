/**
 * @fileoverview データ使用量ページ
 * @module app/mypage/data-usage/page
 *
 * 今月のデータ使用量、日別推移、月別推移、チャージ履歴を表示するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getDataUsageDetail } from '@/services/accountService'
import type { DataUsageDetailResponse } from '@/types'

/**
 * データ使用量ページコンポーネント
 *
 * @returns データ使用量ページ要素
 */
export default function DataUsagePage(): React.ReactElement {
  const [dataUsage, setDataUsage] = useState<DataUsageDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDataUsage = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getDataUsageDetail()
        setDataUsage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データ使用量の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDataUsage()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-40 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!dataUsage) return <></>

  /**
   * 日別使用量の最大値を取得（グラフスケーリング用）
   */
  const maxDailyUsage = Math.max(...dataUsage.dailyUsage.map(d => d.amount), 1)

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">データ使用量</h2>

      {/* 今月使用量サマリー */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="current-usage-title">
        <h3 id="current-usage-title" className="text-lg font-bold text-white mb-4">
          今月の使用量
        </h3>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-white">{dataUsage.summary.usedAmount}</span>
              <span className="text-slate-400 ml-1">/ {dataUsage.summary.totalCapacity}GB</span>
            </div>
            <span className="text-slate-400 text-sm">
              残り {dataUsage.summary.remainingAmount}GB
            </span>
          </div>
          {/* プログレスバー */}
          <div
            className="w-full bg-slate-700 rounded-full h-4"
            role="progressbar"
            aria-valuenow={dataUsage.summary.usagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="データ使用率"
          >
            <div
              className={cn(
                'h-4 rounded-full transition-all duration-500',
                dataUsage.summary.usagePercentage > 80
                  ? 'bg-red-500'
                  : dataUsage.summary.usagePercentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-primary'
              )}
              style={{ width: `${dataUsage.summary.usagePercentage}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs">
            最終更新: {new Date(dataUsage.summary.lastUpdated).toLocaleString('ja-JP')}
          </p>
        </div>
      </section>

      {/* 日別使用量グラフ */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="daily-usage-title">
        <h3 id="daily-usage-title" className="text-lg font-bold text-white mb-4">
          日別使用量
        </h3>
        <div className="space-y-2">
          {dataUsage.dailyUsage.map(daily => {
            const percentage = (daily.amount / maxDailyUsage) * 100
            const dateStr = new Date(daily.date).toLocaleDateString('ja-JP', {
              month: 'short',
              day: 'numeric',
            })
            return (
              <div key={daily.date} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-16 flex-shrink-0 text-right">
                  {dateStr}
                </span>
                <div className="flex-1 bg-slate-700 rounded-full h-5">
                  <div
                    className="bg-primary h-5 rounded-full flex items-center justify-end pr-2 min-w-[2rem]"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  >
                    <span className="text-white text-xs font-medium">{daily.amount}GB</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 月別使用量推移 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="monthly-usage-title">
        <h3 id="monthly-usage-title" className="text-lg font-bold text-white mb-4">
          過去の使用量推移
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {dataUsage.monthlyUsage.map(monthly => {
            const percentage = (monthly.amount / monthly.capacity) * 100
            const monthStr = new Date(monthly.month + '-01').toLocaleDateString('ja-JP', {
              month: 'short',
            })
            return (
              <div key={monthly.month} className="text-center">
                <div className="h-32 flex items-end justify-center mb-2">
                  <div
                    className={cn(
                      'w-10 rounded-t-md transition-all',
                      percentage > 90
                        ? 'bg-red-500'
                        : percentage > 70
                          ? 'bg-yellow-500'
                          : 'bg-primary'
                    )}
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                <p className="text-white text-sm font-medium">{monthly.amount}GB</p>
                <p className="text-slate-400 text-xs">{monthStr}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* データチャージ履歴 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="charge-history-title">
        <h3 id="charge-history-title" className="text-lg font-bold text-white mb-4">
          データチャージ履歴
        </h3>
        {dataUsage.chargeHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="データチャージ履歴一覧">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 py-2 px-3">チャージ日時</th>
                  <th className="text-right text-slate-400 py-2 px-3">容量</th>
                  <th className="text-right text-slate-400 py-2 px-3">料金</th>
                  <th className="text-right text-slate-400 py-2 px-3">有効期限</th>
                </tr>
              </thead>
              <tbody>
                {dataUsage.chargeHistory.map(charge => (
                  <tr key={charge.chargeId} className="border-b border-slate-700/50">
                    <td className="text-white py-3 px-3">
                      {new Date(charge.chargeDate).toLocaleString('ja-JP')}
                    </td>
                    <td className="text-white py-3 px-3 text-right">{charge.amount}GB</td>
                    <td className="text-white py-3 px-3 text-right">
                      ¥{charge.price.toLocaleString()}
                    </td>
                    <td className="text-slate-400 py-3 px-3 text-right">
                      {new Date(charge.expirationDate).toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">チャージ履歴はありません。</p>
        )}
      </section>
    </div>
  )
}
