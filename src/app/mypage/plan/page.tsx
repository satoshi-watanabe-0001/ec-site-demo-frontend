'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import {
  getCurrentPlan,
  getAvailablePlans,
  changePlan,
  getOptions,
  subscribeOption,
} from '@/services/PlanApiService'
import type { AvailablePlan, OptionService } from '@/types'
import type { ContractPlan } from '@/types'
import {
  CurrentPlanCard,
  AvailablePlanList,
  OptionServiceList,
} from '@/components/mypage/PlanManagement'

export default function PlanPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [currentPlanData, setCurrentPlanData] = useState<ContractPlan | null>(null)
  const [availablePlans, setAvailablePlans] = useState<AvailablePlan[]>([])
  const [options, setOptions] = useState<OptionService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchPlanData = async () => {
      try {
        const [currentData, plansData, optionsData] = await Promise.all([
          getCurrentPlan(),
          getAvailablePlans(),
          getOptions(),
        ])
        setCurrentPlanData({
          id: currentData.plan.id,
          name: currentData.plan.name,
          type: currentData.plan.type,
          monthlyFee: currentData.plan.monthlyFee,
          dataCapacityGB: currentData.plan.dataCapacityGB,
          description: currentData.plan.description,
        })
        setAvailablePlans(plansData.plans)
        setOptions(optionsData.options)
      } catch {
        setError('プラン情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlanData()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="plan-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="h-48 bg-slate-800 rounded-lg" />
          <div className="h-64 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !currentPlanData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="plan-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  const handleChangePlan = async (planId: string) => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextMonth.setDate(1)
    await changePlan({
      planId,
      effectiveDate: nextMonth.toISOString().split('T')[0],
    })
  }

  const handleSubscribeOption = async (optionId: string) => {
    await subscribeOption(optionId)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="plan-page">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/mypage"
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← マイページ
        </Link>
        <h1 className="text-2xl font-bold text-white">プラン変更</h1>
      </div>
      <div className="space-y-6">
        <CurrentPlanCard plan={currentPlanData} />
        <AvailablePlanList
          plans={availablePlans}
          currentPlanType={currentPlanData.type}
          onChangePlan={handleChangePlan}
        />
        <OptionServiceList
          options={options}
          onSubscribe={handleSubscribeOption}
        />
      </div>
    </div>
  )
}
