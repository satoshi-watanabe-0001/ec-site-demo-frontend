'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { getBilling, getBillingHistory } from '@/services/BillingApiService'
import type { BillingInfo, BillingHistoryItem } from '@/types'
import { BillingDetailCard, BillingHistoryList } from '@/components/mypage/Billing'

export default function BillingPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [history, setHistory] = useState<BillingHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchBillingData = async () => {
      try {
        const [billingData, historyData] = await Promise.all([getBilling(), getBillingHistory()])
        setBilling(billingData.billing)
        setHistory(historyData.history)
      } catch {
        setError('請求情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="billing-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="h-64 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !billing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="billing-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="billing-page">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-2xl font-bold text-white">請求情報</h1>
      </div>
      <div className="space-y-6">
        <BillingDetailCard billing={billing} />
        <BillingHistoryList history={history} />
      </div>
    </div>
  )
}
