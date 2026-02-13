/**
 * @fileoverview 請求予定額カードコンポーネント
 * @module components/mypage/dashboard/BillingCard
 *
 * 今月の請求予定額・内訳・前月比較を表示するカード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { BillingInfo } from '@/types'

interface BillingCardProps {
  billing: BillingInfo
}

export function BillingCard({ billing }: BillingCardProps): React.ReactElement {
  const { currentBill } = billing
  const diff = currentBill.total - currentBill.previousMonthTotal
  const diffSign = diff > 0 ? '+' : ''

  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">今月の請求予定額</h2>
        <Link href="/mypage/billing" className="text-sm text-primary hover:underline">
          詳細を見る →
        </Link>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-white">¥{currentBill.total.toLocaleString()}</p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`text-sm font-medium ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-slate-400'}`}
          >
            前月比 {diffSign}¥{Math.abs(diff).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-700 pt-4">
        <div className="flex justify-between">
          <span className="text-sm text-slate-400">基本料金</span>
          <span className="text-sm text-white">¥{currentBill.basicFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-400">オプション料金</span>
          <span className="text-sm text-white">¥{currentBill.optionFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-slate-400">通話料</span>
          <span className="text-sm text-white">¥{currentBill.callFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-slate-700 pt-2">
          <span className="text-sm font-bold text-white">合計</span>
          <span className="text-sm font-bold text-white">
            ¥{currentBill.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
