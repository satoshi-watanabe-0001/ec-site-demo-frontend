/**
 * @fileoverview データ使用量詳細ページ
 * @module app/mypage/data-usage/page
 *
 * 今月のデータ使用量、過去の使用量推移、チャージ履歴の詳細表示。
 */

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getDataUsage } from '@/services/dataUsageService'
import { ProgressBar } from '@/components/ui/progress-bar'
import { DataUsageChart } from '@/components/mypage'

export default function DataUsagePage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['dataUsage'],
    queryFn: () => getDataUsage('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="h-48 rounded-xl bg-slate-800" />
            <div className="h-64 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-900/20 p-6 text-center">
            <p className="text-red-400">データの読み込みに失敗しました。再度お試しください。</p>
          </div>
        </div>
      </div>
    )
  }

  const { current, history, charges } = data

  function getProgressColor(percentage: number): string {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/mypage"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">データ使用量</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">今月の使用状況</h2>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {current.usedData}
                  </span>
                  <span className="ml-1 text-lg text-slate-400">GB</span>
                  <span className="mx-2 text-slate-500">/</span>
                  <span className="text-lg text-slate-400">{current.totalData}GB</span>
                </div>
                <span className="text-lg font-medium text-slate-300">
                  残り {current.remainingData}GB
                </span>
              </div>

              <ProgressBar
                value={current.usagePercentage}
                colorClass={getProgressColor(current.usagePercentage)}
                label="データ使用量"
                className="h-4"
              />

              <div className="flex flex-col sm:flex-row justify-between text-sm text-slate-400">
                <span>
                  期間: {current.billingPeriodStart} 〜 {current.billingPeriodEnd}
                </span>
                <span>
                  更新日時:{' '}
                  {new Intl.DateTimeFormat('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(current.updatedAt))}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">使用量推移</h2>
            <DataUsageChart daily={history.daily} monthly={history.monthly} />
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">データチャージ履歴</h2>
            {charges.length === 0 ? (
              <p className="text-sm text-slate-400">チャージ履歴はありません</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" aria-label="データチャージ履歴">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-3 pr-4 text-sm font-medium text-slate-400">チャージ日</th>
                      <th className="py-3 pr-4 text-sm font-medium text-slate-400">容量</th>
                      <th className="py-3 pr-4 text-sm font-medium text-slate-400">料金</th>
                      <th className="py-3 text-sm font-medium text-slate-400">有効期限</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charges.map(charge => (
                      <tr key={charge.id} className="border-b border-slate-700/50">
                        <td className="py-3 pr-4 text-sm text-white">
                          {new Date(charge.chargedAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="py-3 pr-4 text-sm text-white">{charge.amount}GB</td>
                        <td className="py-3 pr-4 text-sm text-white">
                          ¥{charge.fee.toLocaleString()}
                        </td>
                        <td className="py-3 text-sm text-slate-400">
                          {new Date(charge.expiresAt).toLocaleDateString('ja-JP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
