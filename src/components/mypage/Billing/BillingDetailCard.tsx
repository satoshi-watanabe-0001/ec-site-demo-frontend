'use client'

import React from 'react'
import type { BillingInfo } from '@/types'

interface BillingDetailCardProps {
  billing: BillingInfo
}

export function BillingDetailCard({ billing }: BillingDetailCardProps): React.ReactElement {
  const statusLabels: Record<string, string> = {
    pending: '未確定',
    paid: '支払い済み',
    overdue: '未払い',
  }

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    paid: 'text-teal-400',
    overdue: 'text-red-400',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="billing-detail">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">請求情報</h2>
        <span className={`text-sm font-medium ${statusColors[billing.paymentStatus]}`}>
          {statusLabels[billing.paymentStatus]}
        </span>
      </div>
      <div className="text-center mb-6">
        <p className="text-sm text-slate-400">
          {billing.billingMonth} 請求額
        </p>
        <p className="text-4xl font-bold text-white mt-1">
          ¥{billing.breakdown.total.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 mt-1">（税込）</p>
      </div>
      <div className="space-y-3 border-t border-slate-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">基本料金</span>
          <span className="text-sm text-white">¥{billing.breakdown.baseFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">利用料金</span>
          <span className="text-sm text-white">¥{billing.breakdown.usageCharges.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">オプション料金</span>
          <span className="text-sm text-white">¥{billing.breakdown.optionCharges.toLocaleString()}</span>
        </div>
        {billing.breakdown.discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">割引</span>
            <span className="text-sm text-teal-400">-¥{billing.breakdown.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">税額</span>
          <span className="text-sm text-white">¥{billing.breakdown.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-700 pt-3 mt-3">
          <span className="text-sm font-bold text-white">合計（税込）</span>
          <span className="text-lg font-bold text-white">
            ¥{billing.breakdown.total.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500">
        <p>請求期間: {billing.billingMonth}</p>
        {billing.dueDate && (
          <p>支払期日: {new Date(billing.dueDate).toLocaleDateString('ja-JP')}</p>
        )}
      </div>
    </div>
  )
}
