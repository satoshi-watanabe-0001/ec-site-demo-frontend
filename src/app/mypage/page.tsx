/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * EC-278: ahamoアカウント管理ダッシュボード
 *
 * ログインユーザー向けのマイページトップ。
 * 契約プラン、データ使用量、請求情報、端末情報、通知を一覧表示。
 *
 * TanStack Queryを使用するため、動的レンダリングを強制。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useDashboard } from '@/hooks/useDashboard'
import {
  PlanSummaryCard,
  DataUsageCard,
  BillingSummaryCard,
  DeviceInfoCard,
  NotificationCard,
} from '@/components/mypage'

/**
 * マイページダッシュボードコンポーネント
 *
 * ログイン済みユーザーのアカウント管理トップページ。以下のセクションを表示:
 * - ご契約プラン情報
 * - データ使用量（プログレスバー付き）
 * - 今月のご利用料金（前月比較付き）
 * - ご利用端末情報
 * - お知らせ一覧
 *
 * @returns マイページダッシュボード要素
 */
export default function MypageDashboard(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { data, isLoading, error } = useDashboard({
    enabled: isAuthenticated,
  })

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
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">データの取得に失敗しました。</p>
            <p className="text-sm text-red-500 mt-2">{error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">データがありません。</p>
      </div>
    )
  }

  const menuItems = [
    { href: '/mypage/contract', label: '契約情報', icon: '📋' },
    { href: '/mypage/data-usage', label: 'データ使用量', icon: '📊' },
    { href: '/mypage/billing', label: '請求・お支払い', icon: '💰' },
    { href: '/mypage/settings', label: '各種設定', icon: '⚙️' },
    { href: '/mypage/plan-change', label: 'プラン変更', icon: '🔄' },
    { href: '/mypage/options', label: 'オプション管理', icon: '✨' },
  ]

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">マイページ</h1>
          <p className="text-gray-500 mt-1">{user?.name}さん、こんにちは</p>
        </div>

        <nav className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs text-gray-700 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlanSummaryCard contract={data.contract} />
          <DataUsageCard dataUsage={data.dataUsage} />
          <BillingSummaryCard billing={data.billing} />
          <DeviceInfoCard device={data.device} />
          <NotificationCard
            notifications={data.notifications}
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </div>
    </div>
  )
}
