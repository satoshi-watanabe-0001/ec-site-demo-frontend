'use client'

/**
 * @fileoverview 請求履歴テーブルコンポーネント
 * @module components/account/BillingHistory
 *
 * 過去の請求履歴をテーブル形式で表示する。
 */

import { useState } from 'react'
import type { MonthlyBill } from '@/types'

/**
 * BillingHistoryのProps
 */
interface BillingHistoryProps {
  /** 請求履歴データ */
  history: MonthlyBill[]
}

/**
 * 支払いステータスのラベルと色を取得
 */
function getStatusDisplay(status: MonthlyBill['status']) {
  switch (status) {
    case 'paid':
      return { label: '支払い済み', className: 'text-green-400' }
    case 'pending':
      return { label: '未払い', className: 'text-yellow-400' }
    case 'overdue':
      return { label: '支払い遅延', className: 'text-red-400' }
  }
}

/**
 * 請求履歴テーブルコンポーネント
 *
 * 過去の請求情報を月別にテーブル表示する。
 * 各月の明細をアコーディオン形式で展開可能。
 *
 * @param props - コンポーネントプロパティ
 */
export function BillingHistory({ history }: BillingHistoryProps) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null)

  if (history.length === 0) {
    return (
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">請求履歴</h2>
        <p className="text-sm text-slate-400">請求履歴はありません</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h2 className="mb-4 text-lg font-semibold">請求履歴</h2>
      <div className="space-y-2">
        {history.map(bill => {
          const statusDisplay = getStatusDisplay(bill.status)
          const isExpanded = expandedMonth === bill.month

          return (
            <div key={bill.month} className="rounded-md bg-slate-700">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setExpandedMonth(isExpanded ? null : bill.month)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">{bill.month}</span>
                  <span className={`text-sm ${statusDisplay.className}`}>
                    {statusDisplay.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">¥{bill.totalAmount.toLocaleString()}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-600 px-4 py-3">
                  <div className="space-y-2">
                    {bill.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-300">{item.name}</span>
                        <span className={item.amount < 0 ? 'text-green-400' : 'text-white'}>
                          {item.amount < 0 ? '-' : ''}¥{Math.abs(item.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {bill.paymentDate && (
                    <p className="mt-3 text-xs text-slate-400">支払い日: {bill.paymentDate}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
