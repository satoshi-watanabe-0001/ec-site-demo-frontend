/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan-change/page
 *
 * EC-278: プラン変更フローページ。
 * 現在のプランから別プランへの変更を受け付け。
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useContractDetails } from '@/hooks/useContractDetails'
import { changePlan } from '@/services/mypageService'
import { cn } from '@/lib/utils'
import type { PlanChangeRequest } from '@/types'

interface PlanOption {
  planId: string
  planName: string
  monthlyFee: number
  dataCapacity: number
  description: string
  features: string[]
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    description: 'シンプルで分かりやすい、基本プラン',
    features: [
      '月間データ容量20GB',
      '5分以内の国内通話無料',
      'テザリング無料',
      '海外82の国・地域で利用可能',
    ],
  },
  {
    planId: 'ahamo-oomori',
    planName: 'ahamo大盛り',
    monthlyFee: 4950,
    dataCapacity: 100,
    description: 'たっぷり使える大容量プラン',
    features: [
      '月間データ容量100GB',
      '5分以内の国内通話無料',
      'テザリング無料',
      '海外82の国・地域で利用可能',
      '大容量で動画も安心',
    ],
  },
]

export default function PlanChangePage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data: contract, isLoading } = useContractDetails(isAuthenticated)

  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [result, setResult] = React.useState<{
    type: 'success' | 'error'
    message: string
    effectiveDate?: string
  } | null>(null)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlanId = contract?.plan.planId ?? ''

  const handlePlanChange = async () => {
    if (!selectedPlanId || selectedPlanId === currentPlanId) return
    setIsSubmitting(true)
    setResult(null)
    try {
      const request: PlanChangeRequest = { newPlanId: selectedPlanId }
      const response = await changePlan(request)
      setResult({
        type: response.success ? 'success' : 'error',
        message: response.message,
        effectiveDate: response.effectiveDate,
      })
    } catch (err) {
      setResult({
        type: 'error',
        message: err instanceof Error ? err.message : 'プラン変更に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">プラン変更</h1>
          {contract && (
            <p className="text-gray-500 mt-1">
              現在のプラン: <span className="font-semibold">{contract.plan.planName}</span>
              （¥{contract.plan.monthlyFee.toLocaleString()}/月）
            </p>
          )}
        </div>

        {result && (
          <div
            className={cn(
              'mb-6 p-4 rounded-xl text-sm',
              result.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            )}
          >
            <p>{result.message}</p>
            {result.effectiveDate && <p className="mt-1 text-xs">適用日: {result.effectiveDate}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PLAN_OPTIONS.map(plan => {
            const isCurrent = plan.planId === currentPlanId
            const isSelected = plan.planId === selectedPlanId
            return (
              <button
                key={plan.planId}
                type="button"
                onClick={() => !isCurrent && setSelectedPlanId(plan.planId)}
                disabled={isCurrent}
                className={cn(
                  'rounded-2xl p-6 text-left transition-all border-2',
                  isCurrent
                    ? 'bg-gray-50 border-gray-300 cursor-default'
                    : isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{plan.planName}</h3>
                  {isCurrent && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                      現在のプラン
                    </span>
                  )}
                  {isSelected && !isCurrent && (
                    <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                      選択中
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ¥{plan.monthlyFee.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/月（税込）</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start text-sm text-gray-600">
                      <span className="text-blue-500 mr-2 flex-shrink-0">●</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {selectedPlanId && selectedPlanId !== currentPlanId && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">プラン変更は翌月1日より適用されます。</p>
            <button
              type="button"
              onClick={handlePlanChange}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '処理中...' : 'プランを変更する'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
