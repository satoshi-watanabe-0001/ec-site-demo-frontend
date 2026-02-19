/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import {
  getCurrentPlan,
  getAvailablePlans,
  changePlan,
  getOptions,
  subscribeOption,
} from '@/services/PlanApiService'
import type { PlanInfo, OptionService } from '@/types'

export default function PlanPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [currentPlanData, setCurrentPlanData] = useState<PlanInfo | null>(null)
  const [availablePlans, setAvailablePlans] = useState<PlanInfo[]>([])
  const [options, setOptions] = useState<OptionService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [changingPlan, setChangingPlan] = useState<string | null>(null)
  const [subscribingOption, setSubscribingOption] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [current, available, opts] = await Promise.all([
          getCurrentPlan(),
          getAvailablePlans(),
          getOptions(),
        ])
        setCurrentPlanData(current)
        setAvailablePlans(available.plans)
        setOptions(opts.options)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  const handlePlanChange = async (planId: string) => {
    try {
      setChangingPlan(planId)
      setSuccessMessage(null)
      setError(null)
      const result = await changePlan({
        newPlanId: planId,
        effectiveDate: 'next_month',
      })
      if (result.success) {
        setSuccessMessage(result.message)
        setCurrentPlanData(result.newPlan)
        setAvailablePlans(prev =>
          prev.map(p => ({
            ...p,
            isCurrentPlan: p.planId === planId,
          }))
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プラン変更に失敗しました')
    } finally {
      setChangingPlan(null)
    }
  }

  const handleOptionSubscribe = async (optionId: string) => {
    try {
      setSubscribingOption(optionId)
      setSuccessMessage(null)
      setError(null)
      const result = await subscribeOption(optionId)
      if (result.success) {
        setSuccessMessage(result.message)
        setOptions(prev =>
          prev.map(o => o.optionId === optionId ? { ...o, isSubscribed: true } : o)
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプション申込に失敗しました')
    } finally {
      setSubscribingOption(null)
    }
  }

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && !currentPlanData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mypage" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← マイページに戻る
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">プラン変更・オプション管理</h1>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">料金プラン</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availablePlans.map(plan => (
              <div
                key={plan.planId}
                className={`rounded-xl p-6 border transition-all ${
                  plan.isCurrentPlan
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{plan.planName}</h3>
                  {plan.isCurrentPlan && (
                    <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium">
                      現在のプラン
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">¥{plan.monthlyFee.toLocaleString()}</span>
                  <span className="text-sm text-slate-400">/月（税込）</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-cyan-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {!plan.isCurrentPlan && (
                  <button
                    onClick={() => handlePlanChange(plan.planId)}
                    disabled={changingPlan === plan.planId}
                    className="w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {changingPlan === plan.planId ? '変更中...' : 'このプランに変更する'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">オプションサービス</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map(option => (
              <div
                key={option.optionId}
                className={`rounded-xl p-5 border ${
                  option.isSubscribed
                    ? 'bg-slate-800 border-green-500/30'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                      {option.category}
                    </span>
                    <h3 className="text-white font-medium mt-1">{option.optionName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">¥{option.monthlyFee.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">/月</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3">{option.description}</p>
                <ul className="space-y-1 mb-4">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-cyan-400">•</span> {feature}
                    </li>
                  ))}
                </ul>
                {option.isSubscribed ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    契約中
                  </span>
                ) : (
                  <button
                    onClick={() => handleOptionSubscribe(option.optionId)}
                    disabled={subscribingOption === option.optionId}
                    className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {subscribingOption === option.optionId ? '申込中...' : '申し込む'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
