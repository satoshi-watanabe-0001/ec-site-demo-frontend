/**
 * @fileoverview データ使用量詳細ページ
 * @module app/mypage/data-usage/page
 *
 * EC-278: データ使用量の詳細表示ページ。
 * 当月使用量、日別使用量、月別履歴を表示。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useDataUsage } from '@/hooks/useDataUsage'
import { cn } from '@/lib/utils'

export default function DataUsageDetailPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading, error } = useDataUsage(isAuthenticated)

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
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">データ使用量の取得に失敗しました。</p>
          </div>
        </div>
      </div>
    )
  }

  const usagePercentage = Math.round((data.currentUsage / data.totalCapacity) * 100)

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const maxDailyUsage = Math.max(...data.dailyUsage.map(d => d.usage), 1)

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">データ使用量</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">今月のデータ使用量</h2>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900">
                {data.currentUsage.toFixed(1)}
                <span className="text-xl text-gray-500 ml-1">GB</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {data.totalCapacity}GB 中 {data.remaining.toFixed(1)}GB 残り
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={cn(
                  'h-4 rounded-full transition-all duration-500',
                  getProgressColor(usagePercentage)
                )}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>0GB</span>
              <span>{usagePercentage}% 使用</span>
              <span>{data.totalCapacity}GB</span>
            </div>
            <div className="mt-3 text-xs text-gray-400 text-right">
              最終更新:{' '}
              {new Date(data.lastUpdated).toLocaleString('ja-JP', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">日別データ使用量</h2>
            <div className="space-y-2">
              {data.dailyUsage.map(day => {
                const barWidth = (day.usage / maxDailyUsage) * 100
                const dateStr = new Date(day.date).toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">
                      {dateStr}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                      <div
                        className="h-5 rounded-full bg-blue-400 transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-700 w-16 flex-shrink-0">
                      {day.usage.toFixed(1)}GB
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">月別データ使用量履歴</h2>
            <div className="space-y-3">
              {data.monthlyHistory.map(month => {
                const monthUsagePercent = Math.round((month.usage / month.capacity) * 100)
                return (
                  <div key={month.month} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-20 flex-shrink-0">{month.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                      <div
                        className={cn(
                          'h-6 rounded-full transition-all duration-300',
                          getProgressColor(monthUsagePercent)
                        )}
                        style={{
                          width: `${Math.min(monthUsagePercent, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 w-24 text-right flex-shrink-0">
                      {month.usage.toFixed(1)} / {month.capacity}GB
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
