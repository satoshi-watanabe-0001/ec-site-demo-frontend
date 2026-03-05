/**
 * @fileoverview プラン変更フォームコンポーネント
 * @module components/mypage/PlanChangeForm
 *
 * ahamoプランの変更インターフェース。
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccountInfo } from '@/hooks'
import { changePlan } from '@/services/accountService'
import type { AvailablePlan } from '@/types'

/**
 * 利用可能なプラン一覧（モックデータ）
 */
const availablePlans: AvailablePlan[] = [
  {
    planCode: 'ahamo-20',
    planName: 'ahamo（20GB）',
    monthlyPrice: 2970,
    dataCapacityGB: 20,
    description: '20GBのデータ通信と5分以内の国内通話無料',
    features: [
      '月間データ容量20GB',
      '5分以内の国内通話無料',
      '海外82の国と地域で利用可能',
      'テザリング無料',
    ],
    isCurrent: false,
  },
  {
    planCode: 'ahamo-100',
    planName: 'ahamo大盛り（100GB）',
    monthlyPrice: 4950,
    dataCapacityGB: 100,
    description: '100GBのデータ通信と5分以内の国内通話無料',
    features: [
      '月間データ容量100GB',
      '5分以内の国内通話無料',
      '海外82の国と地域で利用可能',
      'テザリング無料',
      '大容量のデータ通信に最適',
    ],
    isCurrent: false,
  },
]

/**
 * プラン変更フォームコンポーネント
 *
 * @returns プラン変更フォーム要素
 */
export function PlanChangeForm(): React.ReactElement {
  const { data: accountInfo } = useAccountInfo()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const currentPlanCode = accountInfo?.plan.planCode

  const plans = availablePlans.map(plan => ({
    ...plan,
    isCurrent: plan.planCode === currentPlanCode,
  }))

  const handleChangePlan = async (): Promise<void> => {
    if (!selectedPlan) return

    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await changePlan({ planCode: selectedPlan })
      setSuccessMessage('プラン変更を受け付けました。翌月から新プランが適用されます。')
      setSelectedPlan(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'プラン変更に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 現在のプラン表示 */}
      {accountInfo && (
        <div className="rounded-lg bg-slate-700/50 p-4">
          <p className="text-sm text-slate-400">現在のプラン</p>
          <p className="text-lg font-semibold text-white">{accountInfo.plan.planName}</p>
          <p className="text-sm text-slate-400">
            月額 ¥{accountInfo.plan.monthlyPrice.toLocaleString()} / データ容量 {accountInfo.plan.dataCapacityGB}GB
          </p>
        </div>
      )}

      {/* メッセージ */}
      {successMessage && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500 p-4 text-emerald-400 text-sm" role="status">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm" role="alert">
          {errorMessage}
        </div>
      )}

      {/* プラン選択 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">プランを選択</h3>
        {plans.map(plan => (
          <div
            key={plan.planCode}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
              plan.isCurrent
                ? 'border-primary/50 bg-primary/5 cursor-default'
                : selectedPlan === plan.planCode
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-700 hover:border-slate-500'
            }`}
            onClick={() => {
              if (!plan.isCurrent) setSelectedPlan(plan.planCode)
            }}
            role="radio"
            aria-checked={selectedPlan === plan.planCode || plan.isCurrent}
            aria-label={plan.planName}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-white">{plan.planName}</h4>
                  {plan.isCurrent && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                      現在のプラン
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ¥{plan.monthlyPrice.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">/月（税込）</p>
              </div>
            </div>

            {/* 特徴 */}
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 変更ボタン */}
      <Button
        type="button"
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
        disabled={!selectedPlan || isSubmitting}
        onClick={handleChangePlan}
      >
        {isSubmitting ? 'プラン変更中...' : 'プランを変更する'}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        ※ プラン変更は翌月1日から適用されます。
      </p>
    </div>
  )
}
