/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * ログイン済みユーザー向けのダッシュボードページ。
 * 契約情報・データ使用量・請求情報・端末情報・通知を一覧表示。
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useAccountStore } from '@/store/account-store'
import {
  ContractSummary,
  DataUsageCard,
  BillingCard,
  DeviceCard,
  NotificationCard,
} from '@/components/mypage/dashboard'

export default function MypageDashboard(): React.ReactElement {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { dashboardData, isLoading, error, fetchDashboardData } = useAccountStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (user) {
      fetchDashboardData(user.id)
    }
  }, [isAuthenticated, user, router, fetchDashboardData])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-slate-400">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="rounded-xl bg-slate-800 p-8 text-center shadow-lg">
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => user && fetchDashboardData(user.id)}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-slate-400">データがありません。</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">マイページ</h1>
          <p className="mt-1 text-sm text-slate-400">{user?.name}さんのアカウント情報</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1">
            <ContractSummary contract={dashboardData.contract} />
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <DataUsageCard dataUsage={dashboardData.dataUsage} />
          </div>

          <div className="md:col-span-1">
            <BillingCard billing={dashboardData.billing} />
          </div>

          <div className="md:col-span-1">
            <DeviceCard device={dashboardData.device} />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <NotificationCard notifications={dashboardData.notifications} />
          </div>
        </div>
      </div>
    </div>
  )
}
