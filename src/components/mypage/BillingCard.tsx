/**
 * @fileoverview 請求情報カードコンポーネント
 * @module components/mypage/BillingCard
 *
 * 当月の請求情報サマリーを表示するカード。
 */

'use client'

import React from 'react'
import type { BillingItem } from '@/types'

/**
 * BillingCardコンポーネントのProps
 */
interface BillingCardProps {
  /** 請求明細 */
  items: BillingItem[]
  /** 合計金額 */
  totalAmount: number
  /** 支払い予定日 */
  paymentDueDate: string
}

/**
 * 請求情報カードコンポーネント
 *
 * @param props - コンポーネントのProps
 * @returns 請求情報カード要素
 */
export function BillingCard({
  items,
  totalAmount,
  paymentDueDate,
}: BillingCardProps): React.ReactElement {
  return (
    <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">今月のご請求</h3>

      {/* 合計金額 */}
      <div className="mb-4">
        <p className="text-sm text-slate-400">合計金額（税込）</p>
        <p className="text-3xl font-bold text-white">
          ¥{totalAmount.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          支払い予定日: {paymentDueDate}
        </p>
      </div>

      {/* 明細 */}
      <div className="space-y-2 border-t border-slate-700 pt-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{item.label}</span>
            <span className="text-white">¥{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
