/**
 * @fileoverview データ使用状況カードコンポーネント
 * @module components/mypage/dashboard/DataUsageCard
 *
 * 今月のデータ使用量・残りデータ量をプログレスバー付きで表示。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { DataUsage } from '@/types'

interface DataUsageCardProps {
  dataUsage: DataUsage
}

export function DataUsageCard({ dataUsage }: DataUsageCardProps): React.ReactElement {
  const { used, total, lastUpdated } = dataUsage.currentMonth
  const usedGB = (used / 1024).toFixed(1)
  const totalGB = (total / 1024).toFixed(0)
  const remainingGB = ((total - used) / 1024).toFixed(1)
  const usagePercent = Math.min((used / total) * 100, 100)

  const getBarColor = (percent: number): string => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formattedDate = format(new Date(lastUpdated), 'yyyy年M月d日 HH:mm', { locale: ja })

  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">データ使用状況</h2>
        <Link
          href="/mypage/data-usage"
          className="text-sm text-primary hover:underline"
        >
          詳細を見る →
        </Link>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">{usedGB}</span>
          <span className="ml-1 text-sm text-slate-400">GB</span>
          <span className="mx-2 text-slate-500">/</span>
          <span className="text-lg text-slate-300">{totalGB}GB</span>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">残り</p>
          <p className="text-lg font-bold text-green-400">{remainingGB}GB</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(usagePercent)}`}
            style={{ width: `${usagePercent}%` }}
            role="progressbar"
            aria-valuenow={used}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`データ使用量: ${usedGB}GB / ${totalGB}GB`}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>0GB</span>
          <span>{usagePercent.toFixed(0)}% 使用済み</span>
          <span>{totalGB}GB</span>
        </div>
      </div>

      <p className="text-xs text-slate-500">最終更新: {formattedDate}</p>
    </div>
  )
}
