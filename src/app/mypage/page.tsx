'use client'

/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * マイページのメインダッシュボードページ。
 * 契約情報サマリー、データ使用量、請求プレビュー、端末情報、通知を表示する。
 */

import Link from 'next/link'
import { useAccountDashboard } from '@/hooks/useAccountDashboard'
import { DashboardSummary } from '@/components/account/DashboardSummary'
import { DataUsageBar } from '@/components/account/DataUsageBar'

/**
 * マイページダッシュボードページ
 *
 * アカウントの概要情報をカード形式で表示する。
 * 各セクションから詳細ページへのリンクを提供。
 */
export default function MypageDashboard() {
  const { data, isLoading, error } = useAccountDashboard()

  // ローディング状態
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">マイページ</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-slate-800 p-6">
              <div className="mb-4 h-4 w-1/3 rounded bg-slate-700" />
              <div className="h-8 w-2/3 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // エラー状態
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">マイページ</h1>
        <div className="rounded-lg bg-red-900/20 p-6 text-center" role="alert">
          <p className="text-red-400">{error.message}</p>
          <button
            type="button"
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      {/* ダッシュボードサマリー */}
      <DashboardSummary
        userName={data.userName}
        currentPlan={data.currentPlan}
        monthlyCharge={data.monthlyCharge}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* データ使用量カード */}
        <div className="rounded-lg bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">データ使用量</h2>
            <Link href="/mypage/data-usage" className="text-sm text-blue-400 hover:text-blue-300">
              詳細 →
            </Link>
          </div>
          <DataUsageBar used={data.dataUsed} limit={data.dataLimit} />
          <p className="mt-2 text-sm text-slate-400">
            残り {(data.dataLimit - data.dataUsed).toFixed(1)}GB（{data.billingDate} まで）
          </p>
        </div>

        {/* 請求プレビューカード */}
        <div className="rounded-lg bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">今月の請求予定</h2>
            <Link href="/mypage/billing" className="text-sm text-blue-400 hover:text-blue-300">
              詳細 →
            </Link>
          </div>
          <p className="text-3xl font-bold text-white">
            ¥{data.currentBillAmount.toLocaleString()}
            <span className="text-sm font-normal text-slate-400">（税込）</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            請求締め日: {data.billingDate}
          </p>
        </div>

        {/* 端末情報カード */}
        <div className="rounded-lg bg-slate-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">ご利用端末</h2>
            <Link href="/mypage/contract" className="text-sm text-blue-400 hover:text-blue-300">
              詳細 →
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-700">
              <span className="text-2xl" aria-hidden="true">📱</span>
            </div>
            <div>
              <p className="font-medium">{data.device.name}</p>
              <p className="text-sm text-slate-400">{data.device.manufacturer}</p>
              {data.device.installmentRemaining > 0 && (
                <p className="text-xs text-slate-500">
                  分割残り {data.device.installmentRemaining}回（月々¥{data.device.monthlyInstallment.toLocaleString()}）
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 通知カード */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h2 className="mb-4 text-lg font-semibold">お知らせ</h2>
          {data.notifications.length === 0 ? (
            <p className="text-sm text-slate-400">新しいお知らせはありません</p>
          ) : (
            <ul className="space-y-3">
              {data.notifications.slice(0, 3).map(notification => (
                <li key={notification.id} className="flex items-start gap-2">
                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-label="未読" />
                  )}
                  <div className={notification.isRead ? 'pl-4' : ''}>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-slate-400">{notification.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* クイックアクション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">クイックアクション</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/mypage/plan-change"
            className="rounded-lg bg-slate-700 p-4 text-center text-sm transition-colors hover:bg-slate-600"
          >
            プラン変更
          </Link>
          <Link
            href="/mypage/options"
            className="rounded-lg bg-slate-700 p-4 text-center text-sm transition-colors hover:bg-slate-600"
          >
            オプション管理
          </Link>
          <Link
            href="/mypage/settings"
            className="rounded-lg bg-slate-700 p-4 text-center text-sm transition-colors hover:bg-slate-600"
          >
            アカウント設定
          </Link>
          <Link
            href="/mypage/billing"
            className="rounded-lg bg-slate-700 p-4 text-center text-sm transition-colors hover:bg-slate-600"
          >
            支払い履歴
          </Link>
        </div>
      </div>
    </div>
  )
}
