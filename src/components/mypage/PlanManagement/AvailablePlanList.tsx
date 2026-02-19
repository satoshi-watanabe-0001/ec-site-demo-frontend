'use client'

import React, { useState } from 'react'
import type { AvailablePlan } from '@/types'

interface AvailablePlanListProps {
  plans: AvailablePlan[]
  currentPlanType: string
  onChangePlan: (planId: string) => Promise<void>
}

export function AvailablePlanList({
  plans,
  currentPlanType,
  onChangePlan,
}: AvailablePlanListProps): React.ReactElement {
  const [changingPlanId, setChangingPlanId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChangePlan = async (planId: string) => {
    setChangingPlanId(planId)
    setMessage(null)
    try {
      await onChangePlan(planId)
      setMessage({
        type: 'success',
        text: 'プラン変更申請を受け付けました。翌月から適用されます。',
      })
    } catch {
      setMessage({ type: 'error', text: 'プラン変更に失敗しました。もう一度お試しください。' })
    } finally {
      setChangingPlanId(null)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="available-plan-list">
      <h2 className="text-lg font-bold text-white mb-4">利用可能なプラン</h2>
      {message && (
        <div
          className={`p-3 rounded text-sm mb-4 ${
            message.type === 'success'
              ? 'bg-teal-500/20 text-teal-400'
              : 'bg-red-500/20 text-red-400'
          }`}
          data-testid="plan-change-message"
        >
          {message.text}
        </div>
      )}
      <div className="space-y-4">
        {plans.map(plan => {
          const isCurrent = plan.type === currentPlanType
          return (
            <div
              key={plan.id}
              className={`p-4 rounded-lg border ${
                isCurrent ? 'border-teal-500/50 bg-teal-500/10' : 'border-slate-700 bg-slate-700/50'
              }`}
              data-testid={`plan-option-${plan.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white">{plan.name}</p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded">
                        現在のプラン
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
                  <p className="text-sm text-slate-400 mt-1">データ容量: {plan.dataCapacityGB}GB</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    ¥{plan.monthlyFee.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">/月</p>
                  {!isCurrent && (
                    <button
                      onClick={() => handleChangePlan(plan.id)}
                      disabled={changingPlanId === plan.id}
                      className="mt-2 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`change-plan-button-${plan.id}`}
                    >
                      {changingPlanId === plan.id ? '申請中...' : 'このプランに変更'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
