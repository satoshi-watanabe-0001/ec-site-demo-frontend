/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { getDashboard } from '@/services/ContractApiService'
import {
  PlanSummary,
  DataUsageWidget,
  BillingSummaryWidget,
  DeviceInfoWidget,
  NotificationsWidget,
} from '@/components/mypage/Dashboard'
import type { DashboardResponse } from '@/types'

export default function MyPageDashboard(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return <div />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">マイページ</h1>
        <p className="text-slate-400 mt-1">{user?.name}さん、こんにちは</p>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8" aria-label="マイページナビゲーション">
        {[
          { href: '/mypage', label: 'ダッシュボード', active: true },
          { href: '/mypage/contract', label: '契約情報' },
          { href: '/mypage/data-usage', label: 'データ使用量' },
          { href: '/mypage/billing', label: '請求情報' },
          { href: '/mypage/settings', label: 'アカウント設定' },
          { href: '/mypage/plan', label: 'プラン変更' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-1">
          <PlanSummary plan={dashboard.plan} />
        </div>
        <div>
          <DataUsageWidget dataUsage={dashboard.dataUsage} />
        </div>
        <div>
          <BillingSummaryWidget billing={dashboard.billing} />
        </div>
        <div>
          <DeviceInfoWidget device={dashboard.device} />
        </div>
        <div className="md:col-span-2">
          <NotificationsWidget
            notifications={dashboard.notifications}
            unreadCount={dashboard.unreadCount}
          />
        </div>
      </div>
    </div>
  )
}
