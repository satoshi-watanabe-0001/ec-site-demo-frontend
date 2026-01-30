'use client'

/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan-change/page
 *
 * EC-278: アカウント管理機能
 * シナリオ7: プラン変更
 *
 * 現在のプラン確認、利用可能なプラン一覧、プラン変更シミュレーション、
 * プラン変更申し込みを行うページ。
 */

import { useEffect, useState } from 'react'
import { usePlanStore } from '@/store/planStore'
import { getAvailablePlans, simulatePlanChange, changePlan } from '@/services/planService'
import { getContractSummary } from '@/services/contractService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Plan, PlanChangeSimulation, ContractSummary } from '@/types'

/**
 * プラン変更ページコンポーネント
 *
 * @returns プラン変更ページ要素
 */
export default function PlanChangePage() {
  const { availablePlans, setAvailablePlans, setLoading, isLoading } = usePlanStore()
  const [currentContract, setCurrentContract] = useState<ContractSummary | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [simulation, setSimulation] = useState<PlanChangeSimulation | null>(null)
  const [simulationLoading, setSimulationLoading] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [changeSuccess, setChangeSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)

      try {
        const [plansRes, contractRes] = await Promise.all([
          getAvailablePlans(),
          getContractSummary(),
        ])

        setAvailablePlans(plansRes.availablePlans)
        setCurrentContract(contractRes)
      } catch (err) {
        console.error('プラン情報の取得に失敗しました:', err)
        setError('プラン情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [setAvailablePlans, setLoading])

  const handleSelectPlan = async (plan: Plan) => {
    setSelectedPlan(plan)
    setSimulation(null)
    setError(null)
    setSimulationLoading(true)

    try {
      const result = await simulatePlanChange({ newPlanId: plan.planId })
      setSimulation(result)
    } catch (err) {
      console.error('シミュレーションに失敗しました:', err)
      setError('シミュレーションに失敗しました')
    } finally {
      setSimulationLoading(false)
    }
  }

  const handleChangePlan = async () => {
    if (!selectedPlan) return

    setIsChanging(true)
    setError(null)

    try {
      await changePlan({ newPlanId: selectedPlan.planId })
      setChangeSuccess(true)
      setSelectedPlan(null)
      setSimulation(null)
    } catch (err) {
      console.error('プラン変更に失敗しました:', err)
      setError('プラン変更に失敗しました')
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">プラン変更</h1>

      {error && (
        <div className="mb-6 rounded bg-red-500/20 p-4 text-red-400" role="alert">
          {error}
        </div>
      )}

      {changeSuccess && (
        <div className="mb-6 rounded bg-green-500/20 p-4 text-green-400" role="status">
          プラン変更の申し込みが完了しました。変更は次回請求日から適用されます。
        </div>
      )}

      <div className="space-y-6">
        {/* 現在のプラン */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">現在のプラン</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 w-32 rounded bg-slate-700" />
            </div>
          ) : currentContract ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">{currentContract.planName}</p>
                <p className="text-slate-400">
                  月額 ¥{currentContract.monthlyBaseFee.toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                契約中
              </span>
            </div>
          ) : (
            <p className="text-slate-400">プラン情報を取得できませんでした</p>
          )}
        </div>

        {/* 利用可能なプラン */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">利用可能なプラン</h3>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 w-full rounded bg-slate-700" />
              <div className="h-24 w-full rounded bg-slate-700" />
            </div>
          ) : availablePlans.length === 0 ? (
            <p className="text-slate-400">利用可能なプランがありません</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availablePlans.map(plan => {
                const isCurrentPlan = currentContract?.planName === plan.planName
                const isSelected = selectedPlan?.planId === plan.planId

                return (
                  <div
                    key={plan.planId}
                    className={cn(
                      'cursor-pointer rounded-lg border p-4 transition-colors',
                      isCurrentPlan
                        ? 'border-green-500 bg-green-500/10'
                        : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    )}
                    onClick={() => !isCurrentPlan && handleSelectPlan(plan)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ' ') && !isCurrentPlan) {
                        handleSelectPlan(plan)
                      }
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-bold text-white">{plan.planName}</h4>
                      {isCurrentPlan && (
                        <span className="text-xs text-green-400">現在のプラン</span>
                      )}
                    </div>
                    <p className="mb-2 text-2xl font-bold text-primary">
                      ¥{plan.monthlyFee.toLocaleString()}
                      <span className="text-sm font-normal text-slate-400">/月</span>
                    </p>
                    <p className="mb-2 text-sm text-slate-400">{plan.description}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-300">データ容量: {plan.dataCapacity}GB</p>
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <p key={index} className="text-slate-400">
                          • {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* シミュレーション結果 */}
        {(simulationLoading || simulation) && (
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">変更シミュレーション</h3>

            {simulationLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-full rounded bg-slate-700" />
                <div className="h-4 w-3/4 rounded bg-slate-700" />
              </div>
            ) : simulation ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded bg-slate-700/50 p-4">
                    <p className="text-sm text-slate-400">現在の月額</p>
                    <p className="text-xl font-bold text-white">
                      ¥{simulation.currentMonthlyFee.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded bg-slate-700/50 p-4">
                    <p className="text-sm text-slate-400">変更後の月額</p>
                    <p className="text-xl font-bold text-white">
                      ¥{simulation.newMonthlyFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded bg-slate-700/50 p-4">
                  <p className="text-sm text-slate-400">差額</p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      simulation.priceDifference > 0 ? 'text-red-400' : 'text-green-400'
                    )}
                  >
                    {simulation.priceDifference > 0 ? '+' : ''}¥
                    {simulation.priceDifference.toLocaleString()}/月
                  </p>
                </div>

                <div className="rounded bg-slate-700/50 p-4">
                  <p className="text-sm text-slate-400">適用開始日</p>
                  <p className="font-medium text-white">{simulation.effectiveDate}</p>
                </div>

                {simulation.notes.length > 0 && (
                  <div className="rounded bg-yellow-500/10 p-4">
                    <p className="mb-2 text-sm font-medium text-yellow-400">注意事項</p>
                    <ul className="space-y-1 text-sm text-slate-300">
                      {simulation.notes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleChangePlan} disabled={isChanging}>
                    {isChanging ? '申し込み中...' : 'このプランに変更する'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPlan(null)
                      setSimulation(null)
                    }}
                    disabled={isChanging}
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
