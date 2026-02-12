/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan/page
 *
 * 現在のプラン表示と変更可能プランの選択。
 */

'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getContractInfo, getAvailablePlans, changePlan } from '@/services/contractService'
import type { PlanChangeRequest } from '@/types/contract'
import { PlanSelector } from '@/components/mypage'

export default function PlanPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [resultMessage, setResultMessage] = useState('')

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data: contract } = useQuery({
    queryKey: ['contract'],
    queryFn: () => getContractInfo('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getAvailablePlans('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  const planMutation = useMutation({
    mutationFn: (request: PlanChangeRequest) => changePlan('mock-token', request),
    onSuccess: data => {
      setResultMessage(data.message)
      setTimeout(() => setResultMessage(''), 5000)
    },
    onError: () => {
      setResultMessage('プラン変更に失敗しました')
      setTimeout(() => setResultMessage(''), 5000)
    },
  })

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-64 rounded-xl bg-slate-800" />
              <div className="h-64 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/mypage"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">プラン変更</h1>
        </div>

        {resultMessage && (
          <div
            className={`mb-6 rounded-lg p-3 text-sm ${
              resultMessage.includes('失敗')
                ? 'bg-red-900/20 text-red-400'
                : 'bg-green-900/20 text-green-400'
            }`}
            role="alert"
          >
            {resultMessage}
          </div>
        )}

        {plans && contract && (
          <PlanSelector
            plans={plans}
            currentPlanName={contract.details.planName}
            onChangePlan={request => planMutation.mutate(request)}
            isLoading={planMutation.isPending}
          />
        )}
      </div>
    </div>
  )
}
