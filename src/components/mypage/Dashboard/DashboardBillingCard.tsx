'use client'

import React from 'react'

interface DashboardBillingCardProps {
  currentMonthEstimate: number
  baseFee: number
  usageAndOptionCharges: number
  previousMonthTotal: number
}

export function DashboardBillingCard({
  currentMonthEstimate,
  baseFee,
  usageAndOptionCharges,
  previousMonthTotal,
}: DashboardBillingCardProps): React.ReactElement {
  const difference = currentMonthEstimate - previousMonthTotal
  const isIncrease = difference > 0

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="billing-card">
      <h3 className="text-sm font-medium text-slate-400 mb-3">今月の請求見込み</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-white">
          ¥{currentMonthEstimate.toLocaleString()}
        </span>
        <span className={`text-sm font-medium ${isIncrease ? 'text-red-400' : 'text-teal-400'}`}>
          {isIncrease ? '↑' : '↓'} 前月比 ¥{Math.abs(difference).toLocaleString()}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">基本料金</span>
          <span className="text-white">¥{baseFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">利用料・オプション</span>
          <span className="text-white">¥{usageAndOptionCharges.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
