'use client'

/**
 * @fileoverview データ使用量プログレスバーコンポーネント
 * @module components/account/DataUsageBar
 *
 * データ使用量を視覚的なプログレスバーで表示する。
 */

/**
 * DataUsageBarのProps
 */
interface DataUsageBarProps {
  /** 使用量（GB） */
  used: number
  /** 上限（GB） */
  limit: number
}

/**
 * データ使用量プログレスバーコンポーネント
 *
 * 使用量と上限からパーセンテージを算出し、プログレスバーで表示する。
 * 80%以上で警告色、90%以上で危険色に変わる。
 *
 * @param props - コンポーネントプロパティ
 */
export function DataUsageBar({ used, limit }: DataUsageBarProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0

  // 使用率に応じた色の決定
  const getBarColor = () => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-2xl font-bold">{used}GB</span>
        <span className="text-sm text-slate-400">/ {limit}GB</span>
      </div>
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label={`データ使用量: ${used}GB / ${limit}GB`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">{percentage.toFixed(1)}%</p>
    </div>
  )
}
