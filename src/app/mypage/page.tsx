/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * マイページのメインダッシュボード。
 * 現在のプラン、データ使用量、請求サマリー、端末情報、通知を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronRight, Smartphone, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDashboard } from '@/services/accountService'
import type { DashboardData } from '@/types'

/**
 * データ使用量プログレスバーコンポーネント
 */
function DataUsageBar({
  usedGb,
  totalGb,
}: {
  usedGb: number
  totalGb: number
}): React.ReactElement {
  const percentage = Math.min((usedGb / totalGb) * 100, 100)
  const isWarning = percentage >= 80

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-400">使用済み</span>
        <span className="text-white font-medium">
          {usedGb.toFixed(1)}GB / {totalGb}GB
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isWarning
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={usedGb}
          aria-valuemin={0}
          aria-valuemax={totalGb}
          aria-label={`データ使用量 ${usedGb.toFixed(1)}GB / ${totalGb}GB`}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className={cn('font-medium', isWarning ? 'text-orange-400' : 'text-cyan-400')}>
          {percentage.toFixed(0)}% 使用中
        </span>
        <span className="text-slate-400">残り {(totalGb - usedGb).toFixed(1)}GB</span>
      </div>
    </div>
  )
}

/**
 * ダッシュボードページコンポーネント
 *
 * @returns ダッシュボードページ要素
 */
export default function MypageDashboard(): React.ReactElement {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const dashboard = await getDashboard()
        setData(dashboard)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (!data) return <div />

  const unreadCount = data.notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-slate-400 mt-1">アカウントの概要をご確認いただけます</p>
      </div>

      {/* 上部カード群 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 現在のプラン */}
        <Link href="/mypage/plan" className="block group">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:bg-slate-750 transition-colors border border-slate-700 group-hover:border-orange-500/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">現在のプラン</h2>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{data.currentPlan.name}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-orange-500">
                {data.currentPlan.price.toLocaleString()}
              </span>
              <span className="text-slate-400">円/月（税込）</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              データ容量 {data.currentPlan.dataCapacity}GB
            </p>
          </div>
        </Link>

        {/* データ使用量 */}
        <Link href="/mypage/data-usage" className="block group">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:bg-slate-750 transition-colors border border-slate-700 group-hover:border-orange-500/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">データ使用量</h2>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <DataUsageBar
              usedGb={data.dataUsageSummary.usedGb}
              totalGb={data.dataUsageSummary.totalGb}
            />
          </div>
        </Link>
      </div>

      {/* 中段カード群 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 請求サマリー */}
        <Link href="/mypage/billing" className="block group">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:bg-slate-750 transition-colors border border-slate-700 group-hover:border-orange-500/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">今月のご請求</h2>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-white">
                {data.billingSummary.currentMonthTotal.toLocaleString()}
              </span>
              <span className="text-slate-400">円</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {data.billingSummary.difference > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-red-400" />
                  <span className="text-red-400">
                    先月より +{data.billingSummary.difference.toLocaleString()}円
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">
                    先月より {data.billingSummary.difference.toLocaleString()}円
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* 端末情報 */}
        {data.deviceInfo && (
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">ご利用端末</h2>
              <Smartphone className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-white mb-2">{data.deviceInfo.name}</p>
            <p className="text-sm text-slate-400 mb-1">購入日: {data.deviceInfo.purchaseDate}</p>
            {data.deviceInfo.remainingPayments && data.deviceInfo.monthlyPayment && (
              <p className="text-sm text-slate-400">
                分割払い: 月々{data.deviceInfo.monthlyPayment.toLocaleString()}円 （残り
                {data.deviceInfo.remainingPayments}回）
              </p>
            )}
          </div>
        )}
      </div>

      {/* 通知セクション */}
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">お知らせ</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}件
              </span>
            )}
          </div>
          <Bell className="h-5 w-5 text-slate-400" />
        </div>
        <ul className="space-y-3">
          {data.notifications.map(notification => (
            <li
              key={notification.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-md transition-colors',
                notification.isRead ? 'bg-slate-800' : 'bg-slate-700/50'
              )}
            >
              <div
                className={cn(
                  'mt-1 h-2 w-2 rounded-full flex-shrink-0',
                  notification.isRead ? 'bg-slate-600' : 'bg-orange-500'
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium',
                    notification.isRead ? 'text-slate-400' : 'text-white'
                  )}
                >
                  {notification.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(notification.timestamp).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
