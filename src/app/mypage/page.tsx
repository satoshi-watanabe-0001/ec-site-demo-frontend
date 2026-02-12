/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * ログインユーザーのダッシュボードページ。
 * 契約情報、データ使用量、請求情報、端末情報、通知を一覧表示。
 */

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FileText, BarChart3, CreditCard, Settings, Smartphone, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getDashboard } from '@/services/accountService'
import {
  DashboardCard,
  ContractSummary,
  DataUsageProgress,
  BillingSummary,
  DeviceInfo,
  NotificationList,
} from '@/components/mypage'

export default function MypageDashboard(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-900/20 p-6 text-center">
            <p className="text-red-400">データの読み込みに失敗しました。再度お試しください。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">マイページ</h1>
          <p className="mt-1 text-sm text-slate-400">
            {user?.name ? `${user.name}さん` : 'ようこそ'}のダッシュボード
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="契約情報"
            href="/mypage/contract"
            icon={<FileText className="h-5 w-5" />}
          >
            <ContractSummary contract={data.contract} />
          </DashboardCard>

          <DashboardCard
            title="データ使用量"
            href="/mypage/data-usage"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <DataUsageProgress dataUsage={data.dataUsage} />
          </DashboardCard>

          <DashboardCard
            title="請求予定額"
            href="/mypage/billing"
            icon={<CreditCard className="h-5 w-5" />}
          >
            <BillingSummary billing={data.billing} />
          </DashboardCard>

          <DashboardCard
            title="契約中端末"
            icon={<Smartphone className="h-5 w-5" />}
          >
            <DeviceInfo device={data.device} />
          </DashboardCard>

          <DashboardCard
            title="通知・お知らせ"
            icon={<Bell className="h-5 w-5" />}
          >
            <NotificationList notifications={data.notifications} />
          </DashboardCard>

          <DashboardCard
            title="アカウント設定"
            href="/mypage/settings"
            icon={<Settings className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                メール、パスワード、通知設定の変更
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">支払い方法</span>
                <span className="text-slate-300">
                  {data.paymentMethod.cardBrand} ****{data.paymentMethod.lastFourDigits}
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
