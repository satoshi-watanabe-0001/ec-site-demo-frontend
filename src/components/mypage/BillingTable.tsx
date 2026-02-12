/**
 * @fileoverview 請求履歴テーブルコンポーネント
 * @module components/mypage/BillingTable
 *
 * 過去の請求履歴を表形式で表示。
 */

'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { BillingHistory } from '@/types/billing'

/**
 * 請求履歴テーブルのProps型定義
 */
interface BillingTableProps {
  /** 請求履歴 */
  history: BillingHistory[]
}

const statusLabels: Record<string, string> = {
  paid: '支払済',
  pending: '未払い',
  overdue: '延滞',
}

const statusVariants: Record<string, 'success' | 'warning' | 'error'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'error',
}

/**
 * 請求履歴テーブルコンポーネント
 *
 * @param props - テーブルのプロパティ
 * @returns 請求履歴テーブル要素
 */
export function BillingTable({ history }: BillingTableProps): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" aria-label="請求履歴">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-3 pr-4 text-sm font-medium text-slate-400">請求月</th>
            <th className="py-3 pr-4 text-sm font-medium text-slate-400">請求額</th>
            <th className="py-3 pr-4 text-sm font-medium text-slate-400">ステータス</th>
            <th className="py-3 text-sm font-medium text-slate-400">明細</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id} className="border-b border-slate-700/50">
              <td className="py-3 pr-4 text-sm text-white">
                {item.billingMonth.replace('-', '年')}月
              </td>
              <td className="py-3 pr-4 text-sm font-medium text-white">
                ¥{item.amount.toLocaleString()}
              </td>
              <td className="py-3 pr-4">
                <Badge variant={statusVariants[item.paymentStatus]}>
                  {statusLabels[item.paymentStatus]}
                </Badge>
              </td>
              <td className="py-3">
                <button
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  aria-label={`${item.billingMonth}の明細をダウンロード`}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">ダウンロード</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
