'use client'

/**
 * @fileoverview 請求・お支払いページ
 * @module app/mypage/billing/page
 *
 * 請求情報と支払い方法の詳細を表示するページ。
 * 請求履歴テーブルと支払い方法情報を表示する。
 */

import { useBillingInfo } from '@/hooks/useBillingInfo'
import { BillingHistory } from '@/components/account/BillingHistory'
import { PaymentMethod } from '@/components/account/PaymentMethod'

/**
 * 請求・お支払いページコンポーネント
 */
export default function BillingPage() {
  const { data, isLoading, error } = useBillingInfo()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">請求・お支払い</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-lg bg-slate-800 p-6">
              <div className="mb-3 h-4 w-1/4 rounded bg-slate-700" />
              <div className="h-20 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">請求・お支払い</h1>
        <div className="rounded-lg bg-red-900/20 p-6 text-center" role="alert">
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">請求・お支払い</h1>

      {/* 今月の請求 */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">今月の請求予定</h2>
        <p className="mb-4 text-3xl font-bold">
          ¥{data.currentMonthAmount.toLocaleString()}
          <span className="text-sm font-normal text-slate-400">（税込）</span>
        </p>
        <div className="space-y-2">
          {data.currentMonthItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-slate-300">{item.name}</span>
              <span className={item.amount < 0 ? 'text-green-400' : 'text-white'}>
                {item.amount < 0 ? '-' : ''}¥{Math.abs(item.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 border-t border-slate-700 pt-4 text-sm text-slate-400">
          <span>請求締め日: {data.billingDate}</span>
          <span>引き落とし日: {data.paymentDueDate}</span>
        </div>
      </div>

      {/* 支払い方法 */}
      <PaymentMethod paymentMethod={data.paymentMethod} />

      {/* 請求履歴 */}
      <BillingHistory history={data.billingHistory} />
    </div>
  )
}
