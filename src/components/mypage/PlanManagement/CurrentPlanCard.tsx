'use client'

import React from 'react'
import type { ContractPlan } from '@/types'

interface CurrentPlanCardProps {
  plan: ContractPlan
}

export function CurrentPlanCard({ plan }: CurrentPlanCardProps): React.ReactElement {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="current-plan-card">
      <h2 className="text-lg font-bold text-white mb-4">現在のプラン</h2>
      <div className="text-center p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
        <p className="text-2xl font-bold text-teal-400">{plan.name}</p>
        <p className="text-3xl font-bold text-white mt-2">
          ¥{plan.monthlyFee.toLocaleString()}
          <span className="text-sm text-slate-400">/月</span>
        </p>
        <p className="text-slate-400 mt-1">{plan.dataCapacityGB}GB</p>
        <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
      </div>
    </div>
  )
}
