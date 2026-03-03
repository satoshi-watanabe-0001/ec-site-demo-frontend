/**
 * @fileoverview データ使用量詳細ページ
 * @module app/mypage/data-usage/page
 *
 * EC-278: データ使用量の詳細確認画面。
 * 当月使用量、日別グラフ、履歴、チャージ履歴を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Calendar, AlertTriangle } from 'lucide-react'
import type {
  DataUsage,
  DataUsageHistoryResponse,
  DataChargeHistoryResponse,
} from '@/types/data-usage'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * データ使用量詳細ページコンポーネント
 *
 * @returns データ使用量詳細ページ要素
 */
export default function DataUsagePage(): React.ReactElement {
  const [dataUsage, setDataUsage] = useState<DataUsage | null>(null)
  const [history, setHistory] = useState<DataUsageHistoryResponse | null>(null)
  const [chargeHistory, setChargeHistory] = useState<DataChargeHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usageRes, historyRes, chargeRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/account/data-usage`),
          fetch(`${BASE_URL}/api/v1/account/data-usage/history`),
          fetch(`${BASE_URL}/api/v1/account/data-charge/history`),
        ])
        if (usageRes.ok) setDataUsage(await usageRes.json())
        if (historyRes.ok) setHistory(await historyRes.json())
        if (chargeRes.ok) setChargeHistory(await chargeRes.json())
      } catch (error) {
        console.error('データ使用量の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">データ使用量</h1>
        <p className="text-slate-400 mt-1">データ通信の使用状況を確認できます</p>
      </div>

      {/* 当月データ使用量 */}
      {dataUsage && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">当月のデータ使用量</h2>
          </div>

          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-white">{dataUsage.usedData}GB</span>
            <span className="text-slate-400 pb-1 text-lg">/ {dataUsage.totalCapacity}GB</span>
          </div>

          {/* プログレスバー */}
          <div
            className="w-full bg-slate-700 rounded-full h-4 mb-3"
            role="progressbar"
            aria-valuenow={dataUsage.usagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`データ使用量: ${dataUsage.usagePercentage}%`}
          >
            <div
              className={`h-4 rounded-full transition-all ${
                dataUsage.usagePercentage >= 90
                  ? 'bg-red-500'
                  : dataUsage.usagePercentage >= 70
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(dataUsage.usagePercentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">
              残り {dataUsage.remainingData}GB ({(100 - dataUsage.usagePercentage).toFixed(1)}%)
            </span>
            {dataUsage.isThrottled && (
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                速度制限中
              </span>
            )}
          </div>

          {dataUsage.additionalData > 0 && (
            <p className="text-slate-400 text-sm mt-2">
              追加購入データ: {dataUsage.additionalData}GB
            </p>
          )}
        </div>
      )}

      {/* 日別使用量グラフ（テーブル表示） */}
      {dataUsage && dataUsage.dailyUsage.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">日別使用量</h2>
          </div>

          {/* 棒グラフ風の表示 */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {dataUsage.dailyUsage.map(daily => {
              const maxUsage = Math.max(...dataUsage.dailyUsage.map(d => d.usage))
              const barWidth = maxUsage > 0 ? (daily.usage / maxUsage) * 100 : 0
              return (
                <div key={daily.date} className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 w-20 flex-shrink-0 text-right">
                    {daily.date.slice(5)}
                  </span>
                  <div className="flex-1 bg-slate-700 rounded-full h-5 relative">
                    <div
                      className="h-5 rounded-full bg-blue-500/70 transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-slate-300 w-16 text-right flex-shrink-0">
                    {daily.usage}GB
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 月別使用量履歴 */}
      {history && history.history.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">月別使用量履歴</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="月別データ使用量履歴">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3 pr-4">月</th>
                  <th className="text-right text-slate-400 pb-3 pr-4">使用量</th>
                  <th className="text-right text-slate-400 pb-3 pr-4">容量</th>
                  <th className="text-right text-slate-400 pb-3">使用率</th>
                </tr>
              </thead>
              <tbody>
                {history.history.map(item => (
                  <tr key={item.month} className="border-b border-slate-700/50">
                    <td className="py-3 pr-4 text-slate-300">{item.month}</td>
                    <td className="py-3 pr-4 text-right text-white">{item.usedData}GB</td>
                    <td className="py-3 pr-4 text-right text-slate-400">{item.totalCapacity}GB</td>
                    <td className="py-3 text-right">
                      <span
                        className={`${
                          item.usagePercentage >= 90
                            ? 'text-red-400'
                            : item.usagePercentage >= 70
                              ? 'text-yellow-400'
                              : 'text-green-400'
                        }`}
                      >
                        {item.usagePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* データチャージ履歴 */}
      {chargeHistory && chargeHistory.history.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">データチャージ履歴</h2>
          <div className="space-y-3">
            {chargeHistory.history.map(charge => (
              <div
                key={charge.id}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm">+{charge.amount}GB</p>
                  <p className="text-slate-400 text-xs">
                    {new Date(charge.chargedAt).toLocaleDateString('ja-JP')} (
                    {charge.type === 'manual'
                      ? '手動'
                      : charge.type === 'auto'
                        ? '自動'
                        : 'キャンペーン'}
                    )
                  </p>
                </div>
                <p className="text-white text-sm">
                  {charge.price > 0
                    ? `¥${new Intl.NumberFormat('ja-JP').format(charge.price)}`
                    : '無料'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
