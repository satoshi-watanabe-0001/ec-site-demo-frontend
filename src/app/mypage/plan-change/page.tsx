/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan-change/page
 *
 * 利用可能なプラン一覧を表示し、プラン変更機能を提供。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { PlanCard } from '@/components/mypage'
import { getAvailablePlans, changePlan } from '@/services/accountService'
import type { PlansResponse } from '@/types/account'

/**
 * プラン変更ページコンポーネント
 */
export default function PlanChangePage() {
  const [plans, setPlans] = useState<PlansResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isChanging, setIsChanging] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await getAvailablePlans()
        setPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleChangePlan = async (planId: string): Promise<void> => {
    if (
      !window.confirm(
        '本当にプランを変更しますか？変更は翌月から適用されます。'
      )
    ) {
      return
    }
    setIsChanging(true)
    setSuccessMessage(null)
    setError(null)
    try {
      const result = await changePlan({ planId })
      setSuccessMessage(result.message)
      // プランデータを再取得
      const updatedPlans = await getAvailablePlans()
      setPlans(updatedPlans)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プランの変更に失敗しました')
    } finally {
      setIsChanging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error && !plans) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!plans) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">プラン変更</h2>

      {successMessage && (
        <div className="rounded-md bg-green-500/10 border border-green-500 p-4 text-sm text-green-400" role="alert">
          {successMessage}
        </div>
      )}

      {error && plans && (
        <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      <p className="text-sm text-slate-400">
        プラン変更は翌月1日から適用されます。月途中の変更でも日割り計算は行われません。
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.plans.map(plan => (
          <PlanCard
            key={plan.planId}
            plan={plan}
            onChangePlan={handleChangePlan}
            isLoading={isChanging}
          />
        ))}
      </div>
    </div>
  )
}
