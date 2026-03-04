/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * ログインユーザーのダッシュボード画面。
 * 契約情報サマリー、データ使用状況、請求予定額、端末情報、通知を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getDashboard } from '@/services/accountService'
import type { DashboardResponse } from '@/types'
import {
  Wifi,
  CreditCard,
  Smartphone,
  Bell,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

/**
 * マイページダッシュボードコンポーネント
 *
 * @returns ダッシュボードページ要素
 */
export default function MypageDashboard(): React.ReactElement {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!dashboard) return <></>

  return (
    <div className="space-y-6">
      {/* 契約情報サマリー */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="contract-summary-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="contract-summary-title" className="text-lg font-bold text-white">
            契約情報サマリー
          </h2>
          <Link
            href="/mypage/contract"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            詳細 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">プラン</p>
            <p className="text-white text-xl font-bold mt-1">{dashboard.contract.planName}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">月額料金</p>
            <p className="text-white text-xl font-bold mt-1">
              ¥{dashboard.contract.monthlyFee.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">データ容量</p>
            <p className="text-white text-xl font-bold mt-1">
              {dashboard.contract.dataCapacity}GB
            </p>
          </div>
        </div>
      </section>

      {/* データ使用状況 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="data-usage-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="data-usage-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            データ使用状況
          </h2>
          <Link
            href="/mypage/data-usage"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            詳細 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-white">
                {dashboard.dataUsage.usedAmount}
              </span>
              <span className="text-slate-400 ml-1">
                / {dashboard.dataUsage.totalCapacity}GB
              </span>
            </div>
            <span className="text-slate-400 text-sm">
              残り {dashboard.dataUsage.remainingAmount}GB
            </span>
          </div>
          {/* プログレスバー */}
          <div className="w-full bg-slate-700 rounded-full h-4" role="progressbar" aria-valuenow={dashboard.dataUsage.usagePercentage} aria-valuemin={0} aria-valuemax={100} aria-label="データ使用率">
            <div
              className={cn(
                'h-4 rounded-full transition-all duration-500',
                dashboard.dataUsage.usagePercentage > 80
                  ? 'bg-red-500'
                  : dashboard.dataUsage.usagePercentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-primary'
              )}
              style={{ width: `${dashboard.dataUsage.usagePercentage}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs">
            最終更新: {new Date(dashboard.dataUsage.lastUpdated).toLocaleString('ja-JP')}
          </p>
        </div>
      </section>

      {/* 請求予定額 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="billing-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="billing-title" className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            請求予定額
          </h2>
          <Link
            href="/mypage/billing"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            詳細 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-slate-300">
            <span>基本料金</span>
            <span>¥{dashboard.billing.basicFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>通話料金</span>
            <span>¥{dashboard.billing.callCharges.toLocaleString()}</span>
          </div>
          {dashboard.billing.optionCharges > 0 && (
            <div className="flex justify-between items-center text-slate-300">
              <span>オプション料金</span>
              <span>¥{dashboard.billing.optionCharges.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
            <span className="text-white font-bold">合計</span>
            <span className="text-2xl font-bold text-white">
              ¥{dashboard.billing.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {dashboard.billing.previousMonthDiff < 0 ? (
              <>
                <TrendingDown className="h-4 w-4 text-green-400" />
                <span className="text-green-400">
                  前月比 ¥{Math.abs(dashboard.billing.previousMonthDiff).toLocaleString()} 減
                </span>
              </>
            ) : dashboard.billing.previousMonthDiff > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-red-400" />
                <span className="text-red-400">
                  前月比 ¥{dashboard.billing.previousMonthDiff.toLocaleString()} 増
                </span>
              </>
            ) : (
              <span className="text-slate-400">前月と同額</span>
            )}
          </div>
        </div>
      </section>

      {/* 契約端末情報 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="device-title"
      >
        <h2 id="device-title" className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-primary" />
          契約端末情報
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-10 w-10 text-slate-400" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">{dashboard.device.deviceName}</p>
            <p className="text-slate-400 text-sm">
              購入日: {new Date(dashboard.device.purchaseDate).toLocaleDateString('ja-JP')}
            </p>
            <p className="text-slate-400 text-sm">{dashboard.device.paymentStatus}</p>
            {dashboard.device.remainingPayment > 0 && (
              <p className="text-orange-400 text-sm">
                残債: ¥{dashboard.device.remainingPayment.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 通知・お知らせ */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="notifications-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="notifications-title"
            className="text-lg font-bold text-white flex items-center gap-2"
          >
            <Bell className="h-5 w-5 text-primary" />
            通知・お知らせ
            {dashboard.notifications.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {dashboard.notifications.unreadCount}
              </span>
            )}
          </h2>
        </div>
        <div className="space-y-3">
          {dashboard.notifications.items.map(notification => (
            <div
              key={notification.notificationId}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                notification.isRead
                  ? 'bg-slate-700/30 border-slate-700'
                  : 'bg-slate-700/50 border-slate-600'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                    {notification.importance === 'urgent' && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        緊急
                      </span>
                    )}
                    {notification.importance === 'important' && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                        重要
                      </span>
                    )}
                    <span className="text-white font-medium text-sm">{notification.title}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{notification.content}</p>
                </div>
                <span className="text-slate-500 text-xs ml-4 flex-shrink-0">
                  {notification.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
