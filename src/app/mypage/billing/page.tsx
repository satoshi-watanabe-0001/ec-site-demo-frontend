/**
 * @fileoverview 請求・支払い情報ページ
 * @module app/mypage/billing/page
 *
 * 請求概要、請求内訳、請求履歴を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { BillingHistoryTable } from '@/components/mypage'
import { getBillingDetail } from '@/services/accountService'
import type { BillingDetailResponse } from '@/types/account'

/**
 * 請求・支払い情報ページコンポーネント
 */
export default function BillingPage() {
  const [billing, setBilling] = useState<BillingDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBilling() {
      try {
        const data = await getBillingDetail()
        setBilling(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBilling()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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

  if (!billing) return null

  // 内訳合計を計算
  const totalBreakdown = billing.breakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">請求・支払い情報</h2>

      {/* 請求概要 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">今月の請求</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">請求額</p>
            <p className="mt-1 text-3xl font-bold text-white">
              &yen;{billing.summary.currentMonth.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-slate-400">請求日</p>
              <p className="mt-1 text-white">{billing.summary.billingDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">支払方法</p>
              <p className="mt-1 text-white">{billing.summary.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">ステータス</p>
              <p className="mt-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    billing.summary.paymentStatus === 'paid'
                      ? 'bg-green-500/20 text-green-400'
                      : billing.summary.paymentStatus === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {billing.summary.paymentStatus === 'paid'
                    ? '支払済'
                    : billing.summary.paymentStatus === 'pending'
                      ? '未払い'
                      : '延滞'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 請求内訳 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">請求内訳</h3>
        <div className="space-y-2">
          {billing.breakdown.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-0"
            >
              <span className="text-sm text-slate-300">{item.label}</span>
              <span
                className={`font-medium ${item.amount < 0 ? 'text-green-400' : 'text-white'}`}
              >
                {item.amount < 0 ? '-' : ''}
                &yen;{Math.abs(item.amount).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t-2 border-slate-600 pt-3">
            <span className="font-semibold text-white">合計</span>
            <span className="text-lg font-bold text-white">
              &yen;{totalBreakdown.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* 請求履歴 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">請求履歴</h3>
        <BillingHistoryTable history={billing.history} />
      </section>
    </div>
  )
}
