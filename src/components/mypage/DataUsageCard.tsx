/**
 * @fileoverview データ通信量カードコンポーネント
 * @module components/mypage/DataUsageCard
 *
 * 当月のデータ通信量をプログレスバー付きで表示するカード。
 */

'use client'

import React from 'react'

/**
 * DataUsageCardコンポーネントのProps
 */
interface DataUsageCardProps {
  /** 当月使用量（GB） */
  currentUsageGB: number
  /** 当月データ容量（GB） */
  currentCapacityGB: number
  /** 残りデータ容量（GB） */
  remainingGB: number
}

/**
 * データ通信量カードコンポーネント
 *
 * @param props - コンポーネントのProps
 * @returns データ通信量カード要素
 */
export function DataUsageCard({
  currentUsageGB,
  currentCapacityGB,
  remainingGB,
}: DataUsageCardProps): React.ReactElement {
  const usagePercent = Math.min((currentUsageGB / currentCapacityGB) * 100, 100)
  const isWarning = usagePercent >= 80
  const isCritical = usagePercent >= 95

  return (
    <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">データ通信量</h3>

      {/* 使用量サマリー */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">{currentUsageGB.toFixed(1)}</span>
          <span className="ml-1 text-slate-400">GB</span>
          <span className="mx-2 text-slate-500">/</span>
          <span className="text-slate-400">{currentCapacityGB}GB</span>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">残り</p>
          <p
            className={`text-xl font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-emerald-400'}`}
          >
            {remainingGB.toFixed(1)}GB
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={currentUsageGB}
        aria-valuemin={0}
        aria-valuemax={currentCapacityGB}
        aria-label="データ通信量"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCritical
              ? 'bg-red-500'
              : isWarning
                ? 'bg-yellow-500'
                : 'bg-emerald-500'
          }`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {usagePercent.toFixed(0)}% 使用中
      </p>
    </div>
  )
}
