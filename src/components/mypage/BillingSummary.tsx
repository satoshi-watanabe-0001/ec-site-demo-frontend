/**
 * @fileoverview 請求予定額表示コンポーネント
 * @module components/mypage/BillingSummary
 *
 * ダッシュボードに表示する請求予定額のサマリー。
 */

'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { BillingInfo } from '@/types/billing'

/**
 * 請求サマリーのProps型定義
 */
interface BillingSummaryProps {
  /** 請求情報 */
  billing: BillingInfo
}

/**
 * 請求予定額表示コンポーネント
 *
 * @param props - サマリーのプロパティ
 * @returns 請求サマリー要素
 */
export function BillingSummary({ billing }: BillingSummaryProps): React.ReactElement {
  const diff = billing.monthOverMonthDiff

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl sm:text-3xl font-bold text-white">
            ¥{billing.currentMonthTotal.toLocaleString()}
          </span>
          <span className="ml-1 text-sm text-slate-400">（税込）</span>
        </div>
        <div className="flex items-center gap-1">
          {diff > 0 && <TrendingUp className="h-4 w-4 text-red-400" />}
          {diff < 0 && <TrendingDown className="h-4 w-4 text-green-400" />}
          {diff === 0 && <Minus className="h-4 w-4 text-slate-400" />}
          <span
            className={
              diff > 0
                ? 'text-sm text-red-400'
                : diff < 0
                  ? 'text-sm text-green-400'
                  : 'text-sm text-slate-400'
            }
          >
            {diff > 0 ? '+' : ''}
            {diff !== 0 ? `¥${diff.toLocaleString()}` : '前月同額'}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {billing.details.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{item.label}</span>
            <span className="text-slate-300">¥{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
