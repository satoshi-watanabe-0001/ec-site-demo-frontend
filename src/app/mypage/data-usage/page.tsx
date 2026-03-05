'use client'

/**
 * @fileoverview データ使用量ページ
 * @module app/mypage/data-usage/page
 *
 * データ使用量の詳細を表示するページ。
 * 日別・月別のグラフと使用量バーを表示する。
 */

import { useDataUsage } from '@/hooks/useDataUsage'
import { DataUsageBar } from '@/components/account/DataUsageBar'
import { DataUsageChart } from '@/components/account/DataUsageChart'

/**
 * データ使用量ページコンポーネント
 */
export default function DataUsagePage() {
  const { data, isLoading, error } = useDataUsage()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">データ使用量</h1>
        <div className="animate-pulse space-y-4">
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 h-4 w-1/4 rounded bg-slate-700" />
            <div className="h-6 w-full rounded bg-slate-700" />
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="h-64 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">データ使用量</h1>
        <div className="rounded-lg bg-red-900/20 p-6 text-center" role="alert">
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">データ使用量</h1>

      {/* 使用量サマリー */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">今月の使用量</h2>
        <DataUsageBar used={data.currentUsage} limit={data.dataLimit} />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-slate-400">使用量</p>
            <p className="text-xl font-bold">{data.currentUsage}GB</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">残りデータ</p>
            <p className="text-xl font-bold text-green-400">{data.remainingData}GB</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">データ容量</p>
            <p className="text-xl font-bold">{data.dataLimit}GB</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">使用率</p>
            <p className="text-xl font-bold">{data.usagePercentage}%</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          請求期間: {data.billingPeriodStart} 〜 {data.billingPeriodEnd}
        </p>
      </div>

      {/* 日別使用量グラフ */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">日別データ使用量（過去30日）</h2>
        <DataUsageChart data={data.dailyUsage} type="daily" />
      </div>

      {/* 月別使用量グラフ */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">月別データ使用量（過去6ヶ月）</h2>
        <DataUsageChart data={data.monthlyUsage} type="monthly" />
      </div>
    </div>
  )
}
