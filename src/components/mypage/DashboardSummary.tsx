/**
 * @fileoverview ダッシュボードサマリーコンポーネント
 * @module components/mypage/DashboardSummary
 *
 * マイページダッシュボードのメインレイアウト。
 * 契約情報、データ通信量、請求情報、端末情報、通知を表示。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useAccountInfo, useDataUsage, useBilling, useDeviceInfo, useNotifications } from '@/hooks'
import { DataUsageCard } from './DataUsageCard'
import { BillingCard } from './BillingCard'
import { DeviceCard } from './DeviceCard'
import { NotificationCard } from './NotificationCard'

/**
 * ダッシュボードサマリーコンポーネント
 *
 * @returns ダッシュボードサマリー要素
 */
export function DashboardSummary(): React.ReactElement {
  const { data: accountInfo, isLoading: isLoadingAccount } = useAccountInfo()
  const { data: dataUsage, isLoading: isLoadingData } = useDataUsage()
  const { data: billing, isLoading: isLoadingBilling } = useBilling()
  const { data: device, isLoading: isLoadingDevice } = useDeviceInfo()
  const { data: notifications, isLoading: isLoadingNotifications } = useNotifications()

  const isLoading =
    isLoadingAccount || isLoadingData || isLoadingBilling || isLoadingDevice || isLoadingNotifications

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
        <span className="ml-3 text-slate-400">読み込み中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 契約プラン概要 */}
      {accountInfo && (
        <div className="rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">ご契約プラン</p>
              <h2 className="text-2xl font-bold text-white">{accountInfo.plan.planName}</h2>
              <p className="mt-1 text-sm text-slate-400">{accountInfo.plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">月額料金</p>
              <p className="text-2xl font-bold text-white">
                ¥{accountInfo.plan.monthlyPrice.toLocaleString()}
                <span className="text-sm text-slate-400">/月</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/mypage/contract"
              className="rounded-md bg-slate-700/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600/50 transition-colors"
            >
              契約詳細 →
            </Link>
            <Link
              href="/mypage/plan-change"
              className="rounded-md bg-primary/20 px-4 py-2 text-sm text-primary hover:bg-primary/30 transition-colors"
            >
              プラン変更 →
            </Link>
          </div>
        </div>
      )}

      {/* データ通信量・請求情報 */}
      <div className="grid gap-6 md:grid-cols-2">
        {dataUsage && (
          <Link href="/mypage/data-usage" className="block transition-transform hover:scale-[1.01]">
            <DataUsageCard
              currentUsageGB={dataUsage.currentUsageGB}
              currentCapacityGB={dataUsage.currentCapacityGB}
              remainingGB={dataUsage.remainingGB}
            />
          </Link>
        )}

        {billing && (
          <Link href="/mypage/billing" className="block transition-transform hover:scale-[1.01]">
            <BillingCard
              items={billing.currentBilling.items}
              totalAmount={billing.currentBilling.totalAmount}
              paymentDueDate={billing.currentBilling.paymentDueDate}
            />
          </Link>
        )}
      </div>

      {/* 端末情報・通知 */}
      <div className="grid gap-6 md:grid-cols-2">
        {device && <DeviceCard device={device} />}
        {notifications && (
          <NotificationCard
            notifications={notifications.notifications}
            unreadCount={notifications.unreadCount}
          />
        )}
      </div>

      {/* クイックリンク */}
      <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-white">メニュー</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { href: '/mypage/contract', label: '契約情報', icon: '📋' },
            { href: '/mypage/data-usage', label: 'データ通信量', icon: '📊' },
            { href: '/mypage/billing', label: '請求情報', icon: '💰' },
            { href: '/mypage/settings', label: '設定', icon: '⚙️' },
            { href: '/mypage/plan-change', label: 'プラン変更', icon: '🔄' },
            { href: '/mypage/options', label: 'オプション', icon: '➕' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center rounded-lg border border-slate-700 p-4 text-center transition-colors hover:border-slate-500 hover:bg-slate-700/50"
            >
              <span className="mb-2 text-2xl" aria-hidden="true">
                {link.icon}
              </span>
              <span className="text-sm text-slate-300">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
