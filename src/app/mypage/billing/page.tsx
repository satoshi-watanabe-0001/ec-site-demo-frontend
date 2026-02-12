/**
 * @fileoverview 請求・支払い情報ページ
 * @module app/mypage/billing/page
 *
 * 請求予定額、請求履歴、支払い方法の表示。
 */

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getBillingInfo } from '@/services/billingService'
import { BillingSummary, BillingTable, PaymentMethodCard } from '@/components/mypage'

export default function BillingPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['billing'],
    queryFn: () => getBillingInfo('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
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
            <div className="h-48 rounded-xl bg-slate-800" />
            <div className="h-64 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-900/20 p-6 text-center">
            <p className="text-red-400">データの読み込みに失敗しました。再度お試しください。</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">請求・支払い情報</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">今月の請求予定額</h2>
            <BillingSummary billing={data.current} />
          </div>

          <PaymentMethodCard paymentMethod={data.paymentMethod} />

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">請求履歴</h2>
            <BillingTable history={data.history} />
          </div>
        </div>
      </div>
    </div>
  )
}
