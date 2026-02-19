'use client'

import React from 'react'
import type { BillingHistoryItem } from '@/types'

interface BillingHistoryListProps {
  history: BillingHistoryItem[]
}

export function BillingHistoryList({ history }: BillingHistoryListProps): React.ReactElement {
  const statusLabels: Record<string, string> = {
    pending: '未確定',
    paid: '支払い済み',
    overdue: '未払い',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    paid: 'bg-teal-500/20 text-teal-400',
    overdue: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="billing-history">
      <h2 className="text-lg font-bold text-white mb-4">請求履歴</h2>
      <div className="space-y-3">
        {history.map(item => (
          <div
            key={item.billingMonth}
            className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
          >
            <div>
              <p className="text-white font-medium">{item.billingMonth}</p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${statusColors[item.paymentStatus]}`}
              >
                {statusLabels[item.paymentStatus]}
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              ¥{item.total.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
