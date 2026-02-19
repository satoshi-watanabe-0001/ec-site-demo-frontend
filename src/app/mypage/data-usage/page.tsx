'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { getDataUsage } from '@/services/ContractApiService'
import type { DataUsageInfo } from '@/types'
import { DataUsageSummary, DataUsageChart } from '@/components/mypage/DataUsage'

export default function DataUsagePage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [dataUsage, setDataUsage] = useState<DataUsageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchDataUsage = async () => {
      try {
        const data = await getDataUsage()
        setDataUsage(data.dataUsage)
      } catch {
        setError('データ使用量の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDataUsage()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="data-usage-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="h-64 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !dataUsage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="data-usage-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="data-usage-page">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-2xl font-bold text-white">データ使用量</h1>
      </div>
      <div className="space-y-6">
        <DataUsageSummary dataUsage={dataUsage} />
        <DataUsageChart dailyUsage={dataUsage.dailyUsage} />
      </div>
    </div>
  )
}
