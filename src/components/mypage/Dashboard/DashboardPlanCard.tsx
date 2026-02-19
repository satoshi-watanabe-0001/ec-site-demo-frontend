'use client'

import React from 'react'

interface DashboardPlanCardProps {
  name: string
  monthlyFee: number
  dataCapacityGB: number
}

export function DashboardPlanCard({
  name,
  monthlyFee,
  dataCapacityGB,
}: DashboardPlanCardProps): React.ReactElement {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="plan-card">
      <h3 className="text-sm font-medium text-slate-400 mb-3">ご契約プラン</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-white">{name}</span>
        <span className="text-lg font-semibold text-teal-400">
          ¥{monthlyFee.toLocaleString()}
          <span className="text-sm text-slate-400">/月</span>
        </span>
      </div>
      <p className="text-sm text-slate-400 mt-2">データ容量: {dataCapacityGB}GB</p>
    </div>
  )
}
