/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * マイページのトップページ。
 * プラン情報、データ使用量、請求概要、端末情報、通知を一覧表示する。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { DashboardCard, DataUsageProgressBar } from '@/components/mypage'
import { getDashboard } from '@/services/accountService'
import type { DashboardResponse } from '@/types/account'

/**
 * マイページダッシュボードページ
 */
export default function MypageDashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-slate-400">ダッシュボードを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!dashboard) return null

  const unreadCount = dashboard.notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* 通知バナー */}
      {unreadCount > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <p className="text-sm text-yellow-300">
            未読の通知が <span className="font-bold">{unreadCount}件</span> あります
          </p>
        </div>
      )}

      {/* プラン情報 & データ使用量 */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="ご契約プラン" href="/mypage/contract">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{dashboard.plan.planName}</span>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                契約中
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">
                &yen;{dashboard.plan.monthlyPrice.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">/月（税込）</span>
            </div>
            <p className="text-sm text-slate-400">データ容量: {dashboard.plan.dataCapacity}GB</p>
          </div>
        </DashboardCard>

        <DashboardCard title="データ使用量" href="/mypage/data-usage">
          <DataUsageProgressBar
            usedData={dashboard.dataUsage.usedData}
            totalData={dashboard.dataUsage.totalData}
          />
          <p className="mt-2 text-xs text-slate-500">
            最終更新: {new Date(dashboard.dataUsage.updatedAt).toLocaleString('ja-JP')}
          </p>
        </DashboardCard>
      </div>

      {/* 請求概要 & 端末情報 */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="今月の請求" href="/mypage/billing">
          <div className="space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                &yen;{dashboard.billing.currentMonth.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">（税込）</span>
            </div>
            <div className="space-y-1 text-sm text-slate-400">
              <p>請求日: {dashboard.billing.billingDate}</p>
              <p>支払方法: {dashboard.billing.paymentMethod}</p>
              <p>
                ステータス:{' '}
                <span
                  className={
                    dashboard.billing.paymentStatus === 'paid'
                      ? 'text-green-400'
                      : 'text-yellow-400'
                  }
                >
                  {dashboard.billing.paymentStatus === 'paid'
                    ? '支払済'
                    : dashboard.billing.paymentStatus === 'pending'
                      ? '未払い'
                      : '延滞'}
                </span>
              </p>
            </div>
          </div>
        </DashboardCard>

        {dashboard.device && (
          <DashboardCard title="ご利用端末" href="/mypage/contract">
            <div className="space-y-3">
              <p className="text-lg font-semibold text-white">{dashboard.device.deviceName}</p>
              <div className="space-y-1 text-sm text-slate-400">
                <p>メーカー: {dashboard.device.manufacturer}</p>
                <p>購入日: {dashboard.device.purchaseDate}</p>
                {dashboard.device.installmentRemaining > 0 && (
                  <p>
                    分割払い残り: {dashboard.device.installmentRemaining}回（月々&yen;
                    {dashboard.device.installmentMonthly.toLocaleString()}）
                  </p>
                )}
              </div>
            </div>
          </DashboardCard>
        )}
      </div>

      {/* 通知一覧 */}
      <DashboardCard title="お知らせ">
        {dashboard.notifications.length === 0 ? (
          <p className="text-sm text-slate-400">通知はありません</p>
        ) : (
          <div className="space-y-3">
            {dashboard.notifications.map(notification => (
              <div
                key={notification.id}
                className={`rounded-lg border px-4 py-3 ${
                  notification.isRead
                    ? 'border-slate-700/50 bg-slate-800/50'
                    : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        notification.isRead ? 'text-slate-300' : 'text-white'
                      }`}
                    >
                      {!notification.isRead && (
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                      )}
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{notification.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">
                    {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
