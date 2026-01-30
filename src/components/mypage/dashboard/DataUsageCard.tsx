'use client'

/**
 * @fileoverview データ使用量カードコンポーネント
 * @module components/mypage/dashboard/DataUsageCard
 *
 * マイページダッシュボードに表示するデータ使用量のカード。
 */

import Link from 'next/link'
import type { CurrentDataUsage } from '@/types'
import { cn } from '@/lib/utils'

/**
 * データ使用量カードコンポーネントのProps
 */
interface DataUsageCardProps {
  /** 現在のデータ使用量 */
  usage: CurrentDataUsage | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 使用率に応じたカラーを取得
 */
function getUsageColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-primary'
}

/**
 * データ使用量カードコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns データ使用量カード表示
 */
export function DataUsageCard({ usage, isLoading, className }: DataUsageCardProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="mb-4 h-4 w-full rounded-full bg-slate-700" />
          <div className="space-y-2">
            <div className="h-4 w-1/2 rounded bg-slate-700" />
            <div className="h-4 w-1/3 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!usage) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">データ使用量</h3>
        <p className="text-slate-400">データ使用量を取得できませんでした</p>
      </div>
    )
  }

  const usageColor = getUsageColor(usage.usagePercentage)

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <h3 className="mb-4 text-lg font-semibold text-white">データ使用量</h3>

      <div className="mb-2 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">{usage.usedData.toFixed(1)}</span>
          <span className="ml-1 text-slate-400">GB</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400">/ {usage.dataCapacity}GB</span>
        </div>
      </div>

      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={cn('h-full rounded-full transition-all', usageColor)}
          style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
        />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">残りデータ量</span>
          <span className="font-medium text-white">{usage.remainingData.toFixed(1)}GB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">リセット日</span>
          <span className="font-medium text-white">{usage.resetDate}</span>
        </div>
        {usage.additionalData > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-400">追加データ</span>
            <span className="font-medium text-green-400">+{usage.additionalData}GB</span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-slate-700 pt-4">
        <Link href="/mypage/data-usage" className="text-sm text-primary hover:underline">
          詳細を見る →
        </Link>
      </div>
    </div>
  )
}
