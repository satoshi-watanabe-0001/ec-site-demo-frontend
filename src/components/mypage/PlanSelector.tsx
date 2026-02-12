/**
 * @fileoverview プラン変更選択コンポーネント
 * @module components/mypage/PlanSelector
 *
 * 利用可能なプランの一覧表示と選択機能。
 */

'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PlanInfo, PlanChangeRequest } from '@/types/contract'

/**
 * プラン選択コンポーネントのProps型定義
 */
interface PlanSelectorProps {
  /** 利用可能なプラン一覧 */
  plans: PlanInfo[]
  /** 現在のプラン名 */
  currentPlanName: string
  /** プラン変更処理 */
  onChangePlan: (request: PlanChangeRequest) => void
  /** 処理中フラグ */
  isLoading?: boolean
}

/**
 * プラン変更選択コンポーネント
 *
 * @param props - プラン選択のプロパティ
 * @returns プラン選択要素
 */
export function PlanSelector({
  plans,
  currentPlanName,
  onChangePlan,
  isLoading = false,
}: PlanSelectorProps): React.ReactElement {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [effectiveDate, setEffectiveDate] = useState<'next_month' | 'immediate'>('next_month')

  const handleSubmit = () => {
    if (!selectedPlanId) return
    onChangePlan({ planId: selectedPlanId, effectiveDate })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map(plan => {
          const isCurrent = plan.name === currentPlanName
          const isSelected = selectedPlanId === plan.id

          return (
            <button
              key={plan.id}
              onClick={() => !isCurrent && setSelectedPlanId(plan.id)}
              disabled={isCurrent}
              className={cn(
                'relative rounded-xl p-4 sm:p-6 text-left transition-all duration-200 border-2',
                isCurrent
                  ? 'bg-slate-800 border-blue-500 cursor-default'
                  : isSelected
                    ? 'bg-slate-800 border-green-500 hover:border-green-400'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              )}
            >
              {isCurrent && (
                <Badge variant="info" className="absolute top-3 right-3">
                  現在のプラン
                </Badge>
              )}
              {isSelected && !isCurrent && (
                <div className="absolute top-3 right-3">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
              )}

              <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
              <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">データ容量</span>
                  <span className="font-semibold text-white">{plan.dataCapacity}GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">月額料金</span>
                  <span className="text-xl font-bold text-white">
                    ¥{plan.monthlyFee.toLocaleString()}
                    <span className="text-sm font-normal text-slate-400">（税込）</span>
                  </span>
                </div>
                {plan.fiveMinuteCallFree && (
                  <p className="text-xs text-blue-400">5分以内の国内通話無料</p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {selectedPlanId && (
        <div className="space-y-4 rounded-xl bg-slate-800 p-4 sm:p-6">
          <h4 className="font-semibold text-white">適用時期</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="effectiveDate"
                value="next_month"
                checked={effectiveDate === 'next_month'}
                onChange={() => setEffectiveDate('next_month')}
                className="text-blue-500"
              />
              <span className="text-sm text-slate-300">翌月1日から適用</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="effectiveDate"
                value="immediate"
                checked={effectiveDate === 'immediate'}
                onChange={() => setEffectiveDate('immediate')}
                className="text-blue-500"
              />
              <span className="text-sm text-slate-300">即時適用</span>
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {isLoading ? '処理中...' : 'プランを変更する'}
          </Button>
        </div>
      )}
    </div>
  )
}
