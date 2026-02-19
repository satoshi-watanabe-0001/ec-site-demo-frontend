/**
 * @fileoverview データ使用量詳細ページ
 * @module app/mypage/data-usage/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import type { DataUsageDetail } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function DataUsagePage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [dataUsage, setDataUsage] = useState<DataUsageDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/v1/mypage/data-usage`)
        if (!response.ok) throw new Error('データの取得に失敗しました')
        const data: DataUsageDetail = await response.json()
        setDataUsage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-700 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !dataUsage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error || 'データの取得に失敗しました'}</p>
        </div>
      </div>
    )
  }

  const getBarColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-cyan-500'
  }

  const maxDailyUsage = Math.max(...dataUsage.dailyBreakdown.map(d => d.usageGB), 1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mypage" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← マイページに戻る
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">データ使用量</h1>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">今月の使用状況</h2>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-white">{dataUsage.currentMonth.usedGB}</span>
            <span className="text-lg text-slate-400">/ {dataUsage.currentMonth.totalGB}GB</span>
          </div>
          <div
            className="w-full bg-slate-600 rounded-full h-4 mb-3"
            role="progressbar"
            aria-valuenow={dataUsage.currentMonth.usagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getBarColor(dataUsage.currentMonth.usagePercentage)}`}
              style={{ width: `${dataUsage.currentMonth.usagePercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 block">残りデータ</span>
              <span className="text-white font-bold text-lg">
                {dataUsage.currentMonth.remainingGB}GB
              </span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 block">使用率</span>
              <span className="text-white font-bold text-lg">
                {dataUsage.currentMonth.usagePercentage}%
              </span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 block">1日平均</span>
              <span className="text-white font-bold text-lg">{dataUsage.averageDaily}GB</span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 block">月末予測</span>
              <span className="text-white font-bold text-lg">{dataUsage.projectedUsage}GB</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            リセット日: {new Date(dataUsage.currentMonth.resetDate).toLocaleDateString('ja-JP')} |
            最終更新: {new Date(dataUsage.currentMonth.lastUpdated).toLocaleString('ja-JP')}
          </p>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">日別使用量</h2>
          <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
            {dataUsage.dailyBreakdown.map(day => {
              const heightPercentage = (day.usageGB / maxDailyUsage) * 100
              const dayNum = new Date(day.date).getDate()
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center flex-shrink-0"
                  style={{ minWidth: '24px' }}
                >
                  <div
                    className="flex-1 w-full flex items-end justify-center"
                    style={{ height: '140px' }}
                  >
                    <div
                      className="w-4 bg-cyan-500 rounded-t transition-all hover:bg-cyan-400"
                      style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                      title={`${day.date}: ${day.usageGB}GB`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1">{dayNum}</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">先月との比較</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-slate-400 text-sm block mb-1">今月</span>
              <span className="text-2xl font-bold text-white">
                {dataUsage.currentMonth.usedGB}GB
              </span>
              <span className="text-slate-400 text-sm"> / {dataUsage.currentMonth.totalGB}GB</span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <span className="text-slate-400 text-sm block mb-1">先月</span>
              <span className="text-2xl font-bold text-white">
                {dataUsage.previousMonth.usedGB}GB
              </span>
              <span className="text-slate-400 text-sm"> / {dataUsage.previousMonth.totalGB}GB</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
