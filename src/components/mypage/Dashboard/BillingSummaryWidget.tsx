/**
 * @fileoverview 請求サマリーウィジェットコンポーネント
 * @module components/mypage/Dashboard/BillingSummaryWidget
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { BillingSummary } from '@/types'

interface BillingSummaryWidgetProps {
  billing: BillingSummary
}

export function BillingSummaryWidget({ billing }: BillingSummaryWidgetProps): React.ReactElement {
  const diff = billing.totalAmount - billing.previousMonthAmount
  const diffSign = diff > 0 ? '+' : ''
  const diffColor = diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-slate-400'

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">今月のご利用料金</h3>
        <Link
          href="/mypage/billing"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          詳細を見る →
        </Link>
      </div>
      <div className="mb-4">
        <span className="text-sm text-slate-400">{billing.billingMonth}</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold text-white">
            ¥{billing.totalAmount.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400">（税込）</span>
        </div>
        <div className={`text-sm mt-1 ${diffColor}`}>
          前月比 {diffSign}¥{Math.abs(diff).toLocaleString()}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">基本料金</span>
          <span className="text-white">¥{billing.baseFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">通話・通信料</span>
          <span className="text-white">¥{billing.usageCharges.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">オプション料</span>
          <span className="text-white">¥{billing.optionCharges.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
