'use client'

/**
 * @fileoverview データ使用量ページ
 * @module app/mypage/data-usage/page
 *
 * EC-278: アカウント管理機能
 * シナリオ4: データ使用量確認
 *
 * 現在のデータ使用量、使用履歴、データ追加オプションを表示するページ。
 */

import { useEffect, useState } from 'react'
import { DataUsageCard } from '@/components/mypage/dashboard'
import { useDataUsageStore } from '@/store/dataUsageStore'
import {
  getCurrentDataUsage,
  getDataUsageHistory,
  getDataAddOnOptions,
  purchaseDataAddOn,
} from '@/services/dataUsageService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { DataUsageHistoryResponse, DataAddOnOption } from '@/types'

/**
 * データ使用量ページコンポーネント
 *
 * @returns データ使用量ページ要素
 */
export default function DataUsagePage() {
  const { currentUsage, setCurrentUsage, setLoading, isLoading } = useDataUsageStore()
  const [history, setHistory] = useState<DataUsageHistoryResponse | null>(null)
  const [addOnOptions, setAddOnOptions] = useState<DataAddOnOption[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDataUsage = async () => {
      setLoading(true)
      setHistoryLoading(true)

      try {
        const [usageRes, historyRes, addOnsRes] = await Promise.all([
          getCurrentDataUsage(),
          getDataUsageHistory(),
          getDataAddOnOptions(),
        ])

        setCurrentUsage(usageRes)
        setHistory(historyRes)
        setAddOnOptions(addOnsRes)
      } catch (error) {
        console.error('データ使用量の取得に失敗しました:', error)
      } finally {
        setLoading(false)
        setHistoryLoading(false)
      }
    }

    fetchDataUsage()
  }, [setCurrentUsage, setLoading])

  const handlePurchaseAddOn = async (optionId: string) => {
    setPurchasingId(optionId)
    try {
      await purchaseDataAddOn({ optionId })
      const usageRes = await getCurrentDataUsage()
      setCurrentUsage(usageRes)
    } catch (error) {
      console.error('データ追加の購入に失敗しました:', error)
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">データ使用量</h1>

      <div className="space-y-6">
        <DataUsageCard usage={currentUsage} isLoading={isLoading} />

        {/* 使用履歴 */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">使用履歴</h3>

          {historyLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-full rounded bg-slate-700" />
              <div className="h-8 w-full rounded bg-slate-700" />
              <div className="h-8 w-full rounded bg-slate-700" />
            </div>
          ) : history ? (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-400">日別使用量</h4>
                <div className="space-y-2">
                  {history.dailyUsage.slice(0, 7).map(day => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between rounded bg-slate-700/50 px-3 py-2"
                    >
                      <span className="text-sm text-white">{day.date}</span>
                      <span className="text-sm font-medium text-white">
                        {day.usedData.toFixed(2)}GB
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-400">月別使用量</h4>
                <div className="space-y-2">
                  {history.monthlyUsage.slice(0, 3).map(month => (
                    <div
                      key={month.month}
                      className="flex items-center justify-between rounded bg-slate-700/50 px-3 py-2"
                    >
                      <span className="text-sm text-white">{month.month}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-white">
                          {month.usedData.toFixed(1)}GB
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                          / {month.dataCapacity}GB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">使用履歴を取得できませんでした</p>
          )}
        </div>

        {/* データ追加オプション */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">データ追加オプション</h3>

          {addOnOptions.length === 0 ? (
            <p className="text-slate-400">利用可能なオプションがありません</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addOnOptions.map(option => (
                <div
                  key={option.optionId}
                  className={cn(
                    'rounded-lg border p-4',
                    option.isAvailable
                      ? 'border-slate-600 bg-slate-700/30'
                      : 'border-slate-700 bg-slate-800/50 opacity-60'
                  )}
                >
                  <div className="mb-2 text-xl font-bold text-white">+{option.dataAmount}GB</div>
                  <div className="mb-3 text-lg font-semibold text-primary">
                    ¥{option.price.toLocaleString()}
                  </div>
                  <p className="mb-3 text-sm text-slate-400">{option.description}</p>
                  <p className="mb-3 text-xs text-slate-500">有効期限: {option.validityDays}日間</p>
                  <Button
                    onClick={() => handlePurchaseAddOn(option.optionId)}
                    disabled={!option.isAvailable || purchasingId === option.optionId}
                    size="sm"
                    className="w-full"
                  >
                    {purchasingId === option.optionId ? '購入中...' : '購入する'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
