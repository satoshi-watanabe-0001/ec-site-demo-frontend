'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { getDashboard } from '@/services/ContractApiService'
import type { DashboardSummary } from '@/types'
import {
  DashboardPlanCard,
  DashboardDataUsageCard,
  DashboardBillingCard,
  DashboardDeviceCard,
  DashboardNotificationsCard,
} from '@/components/mypage/Dashboard'

export default function MypageDashboard(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchDashboard = async () => {
      try {
        const data = await getDashboard()
        setDashboard(data.dashboard)
      } catch {
        setError('ダッシュボード情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8" data-testid="dashboard-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="dashboard-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/mypage/contract', label: '契約情報' },
    { href: '/mypage/data-usage', label: 'データ使用量' },
    { href: '/mypage/billing', label: '請求情報' },
    { href: '/mypage/settings', label: 'アカウント設定' },
    { href: '/mypage/plan', label: 'プラン変更' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" data-testid="mypage-dashboard">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">マイページ</h1>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8" data-testid="mypage-nav">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardPlanCard
          name={dashboard.plan.name}
          monthlyFee={dashboard.plan.monthlyFee}
          dataCapacityGB={dashboard.plan.dataCapacityGB}
        />
        <DashboardDataUsageCard
          usedGB={dashboard.dataUsage.usedGB}
          totalCapacityGB={dashboard.dataUsage.totalCapacityGB}
          remainingGB={dashboard.dataUsage.remainingGB}
          usagePercent={dashboard.dataUsage.usagePercent}
          lastUpdated={dashboard.dataUsage.lastUpdated}
        />
        <DashboardBillingCard
          currentMonthEstimate={dashboard.billing.currentMonthEstimate}
          baseFee={dashboard.billing.baseFee}
          usageAndOptionCharges={dashboard.billing.usageAndOptionCharges}
          previousMonthTotal={dashboard.billing.previousMonthTotal}
        />
        <DashboardDeviceCard
          name={dashboard.device.name}
          purchaseDate={dashboard.device.purchaseDate}
          paymentStatus={dashboard.device.paymentStatus}
          remainingBalance={dashboard.device.remainingBalance}
        />
        <DashboardNotificationsCard
          unreadCount={dashboard.notifications.unreadCount}
          importantAnnouncements={dashboard.notifications.importantAnnouncements}
        />
      </div>
    </div>
  )
}
