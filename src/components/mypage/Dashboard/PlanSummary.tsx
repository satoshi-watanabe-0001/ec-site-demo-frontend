/**
 * @fileoverview プランサマリーコンポーネント
 * @module components/mypage/Dashboard/PlanSummary
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { ContractPlan } from '@/types'

interface PlanSummaryProps {
  plan: ContractPlan
}

export function PlanSummary({ plan }: PlanSummaryProps): React.ReactElement {
  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">ご契約プラン</h3>
        <Link
          href="/mypage/contract"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          詳細を見る →
        </Link>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white">{plan.planName}</span>
        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400">
          契約中
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-3">{plan.description}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">¥{plan.monthlyFee.toLocaleString()}</span>
        <span className="text-sm text-slate-400">/月（税込）</span>
      </div>
      <div className="mt-3 text-sm text-slate-400">
        データ容量: <span className="text-white font-medium">{plan.dataCapacityGB}GB</span>
      </div>
    </div>
  )
}
