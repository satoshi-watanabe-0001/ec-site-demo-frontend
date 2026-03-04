/**
 * @fileoverview プラン選択カードコンポーネント
 * @module components/mypage/PlanCard
 *
 * プランの情報表示と変更ボタンを提供するカード。
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import type { AvailablePlan } from '@/types/account'
import { cn } from '@/lib/utils'

/**
 * プランカードのProps
 */
interface PlanCardProps {
  /** プラン情報 */
  plan: AvailablePlan
  /** プラン変更ボタンクリック時のコールバック */
  onChangePlan: (planId: string) => void
  /** 操作中かどうか */
  isLoading?: boolean
  /** 追加のCSSクラス */
  className?: string
}

/**
 * プラン選択カードコンポーネント
 */
export function PlanCard({
  plan,
  onChangePlan,
  isLoading = false,
  className,
}: PlanCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-lg border-2 p-6 transition-all',
        plan.isCurrent
          ? 'border-primary bg-primary/5'
          : 'border-slate-700 bg-slate-800 hover:border-slate-600',
        className
      )}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{plan.planName}</h3>
          {plan.isCurrent && (
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
              現在のプラン
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-white">
          &yen;{plan.monthlyPrice.toLocaleString()}
        </span>
        <span className="ml-1 text-sm text-slate-400">/月（税込）</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="rounded bg-slate-700 px-2 py-0.5 text-xs font-medium">
            {plan.dataCapacity}GB
          </span>
          <span>データ容量</span>
        </div>
      </div>

      <ul className="mb-6 space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
            <span className="mt-0.5 text-primary">&#10003;</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.isCurrent ? (
        <Button variant="outline" className="w-full border-slate-600 text-slate-400" disabled>
          現在ご利用中
        </Button>
      ) : (
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={() => onChangePlan(plan.planId)}
          disabled={isLoading}
        >
          {isLoading ? '変更中...' : 'このプランに変更'}
        </Button>
      )}
    </div>
  )
}
