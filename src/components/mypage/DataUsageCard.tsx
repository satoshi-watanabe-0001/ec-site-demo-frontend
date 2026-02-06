/**
 * @fileoverview データ使用量カードコンポーネント
 * @module components/mypage/DataUsageCard
 *
 * 当月のデータ使用量をプログレスバー付きで表示するカード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DataUsage } from '@/types'

interface DataUsageCardProps {
  dataUsage: DataUsage
  className?: string
}

export function DataUsageCard({ dataUsage, className }: DataUsageCardProps): React.ReactElement {
  const { currentUsage, remaining, totalCapacity, lastUpdated } = dataUsage
  const usagePercentage = Math.round((currentUsage / totalCapacity) * 100)

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const formattedLastUpdated = new Date(lastUpdated).toLocaleString('ja-JP', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">データ使用量</h2>
        <Link
          href="/mypage/data-usage"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          詳細
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900">
          {currentUsage.toFixed(1)}
          <span className="text-lg text-gray-500 ml-1">GB</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">/ {totalCapacity}GB 中</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className={cn(
            'h-3 rounded-full transition-all duration-500',
            getProgressColor(usagePercentage)
          )}
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">使用済み: {usagePercentage}%</span>
        <span className="font-medium text-gray-900">残り {remaining.toFixed(1)}GB</span>
      </div>

      <div className="mt-3 text-xs text-gray-400 text-right">最終更新: {formattedLastUpdated}</div>
    </div>
  )
}
