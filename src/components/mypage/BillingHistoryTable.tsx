/**
 * @fileoverview 請求履歴テーブルコンポーネント
 * @module components/mypage/BillingHistoryTable
 *
 * 過去の請求履歴を表示するテーブルコンポーネント。
 */

'use client'

import React from 'react'
import type { BillingHistoryItem } from '@/types/account'
import { cn } from '@/lib/utils'

/**
 * 請求履歴テーブルのProps
 */
interface BillingHistoryTableProps {
  /** 請求履歴データ */
  history: BillingHistoryItem[]
  /** 追加のCSSクラス */
  className?: string
}

/**
 * 支払いステータスのラベルを返す
 */
function getStatusLabel(status: BillingHistoryItem['status']): string {
  switch (status) {
    case 'paid':
      return '支払済'
    case 'pending':
      return '未払い'
    case 'overdue':
      return '延滞'
  }
}

/**
 * 支払いステータスの色クラスを返す
 */
function getStatusColor(status: BillingHistoryItem['status']): string {
  switch (status) {
    case 'paid':
      return 'bg-green-500/20 text-green-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'overdue':
      return 'bg-red-500/20 text-red-400'
  }
}

/**
 * 請求履歴テーブルコンポーネント
 */
export function BillingHistoryTable({
  history,
  className,
}: BillingHistoryTableProps): React.ReactElement {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-3 text-left font-medium text-slate-400">請求月</th>
            <th className="py-3 text-right font-medium text-slate-400">請求額</th>
            <th className="py-3 text-center font-medium text-slate-400">ステータス</th>
            <th className="hidden py-3 text-right font-medium text-slate-400 sm:table-cell">
              支払日
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.month} className="border-b border-slate-700/50">
              <td className="py-3 text-white">{item.month}</td>
              <td className="py-3 text-right font-medium text-white">
                &yen;{item.amount.toLocaleString()}
              </td>
              <td className="py-3 text-center">
                <span
                  className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                    getStatusColor(item.status)
                  )}
                >
                  {getStatusLabel(item.status)}
                </span>
              </td>
              <td className="hidden py-3 text-right text-slate-400 sm:table-cell">
                {item.paidAt || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
