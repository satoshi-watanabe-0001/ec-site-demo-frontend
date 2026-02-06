/**
 * @fileoverview 請求サマリーカードコンポーネント
 * @module components/mypage/BillingSummaryCard
 *
 * 当月の請求見込みを表示するカード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BillingInfo } from '@/types'

interface BillingSummaryCardProps {
  billing: BillingInfo
  className?: string
}

export function BillingSummaryCard({
  billing,
  className,
}: BillingSummaryCardProps): React.ReactElement {
  const { currentMonthEstimate, history, paymentMethod } = billing
  const lastMonth = history[0]
  const diff = lastMonth
    ? currentMonthEstimate.totalAmount - lastMonth.totalAmount
    : 0

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">今月のご利用料金</h2>
        <Link
          href="/mypage/billing"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          詳細
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900">
          ¥{currentMonthEstimate.totalAmount.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {currentMonthEstimate.isConfirmed ? '確定' : '見込み（税込）'}
        </div>
        {diff !== 0 && (
          <div
            className={cn(
              'text-sm mt-2 font-medium',
              diff > 0 ? 'text-red-500' : 'text-green-600'
            )}
          >
            前月比 {diff > 0 ? '+' : ''}¥{diff.toLocaleString()}
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {currentMonthEstimate.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-500">{item.itemName}</span>
            <span className="text-gray-900">¥{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>お支払い方法</span>
          <span>{paymentMethod.displayName}</span>
        </div>
      </div>
    </div>
  )
}
