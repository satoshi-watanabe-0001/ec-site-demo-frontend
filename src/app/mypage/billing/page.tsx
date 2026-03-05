/**
 * @fileoverview 請求・支払いページ
 * @module app/mypage/billing/page
 *
 * 当月の請求明細、支払い履歴、支払い方法を表示するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { CreditCard, Receipt, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBilling } from '@/services/accountService'
import type { BillingInfo } from '@/types'

/**
 * 請求・支払いページコンポーネント
 *
 * @returns 請求・支払いページ要素
 */
export default function BillingPage(): React.ReactElement {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await getBilling()
        setBilling(data)
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

  if (!billing) return <div />

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">請求・支払い</h1>
        <p className="text-slate-400 mt-1">ご請求内容と支払い履歴をご確認いただけます</p>
      </div>

      {/* 当月請求明細 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-orange-500" />
          {billing.currentMonth.month.replace('-', '年')}月のご請求
        </h2>

        <div className="space-y-3 mb-4">
          {billing.currentMonth.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-300">{item.name}</span>
              <span className="text-white font-medium">{item.amount.toLocaleString()}円</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t-2 border-slate-600">
          <span className="text-lg font-semibold text-white">合計（税込）</span>
          <span className="text-2xl font-bold text-orange-500">
            {billing.currentMonth.totalAmount.toLocaleString()}円
          </span>
        </div>

        {billing.currentMonth.differenceFromLastMonth !== 0 && (
          <p className={cn(
            'text-sm mt-2 text-right',
            billing.currentMonth.differenceFromLastMonth > 0 ? 'text-red-400' : 'text-green-400'
          )}>
            先月比: {billing.currentMonth.differenceFromLastMonth > 0 ? '+' : ''}
            {billing.currentMonth.differenceFromLastMonth.toLocaleString()}円
          </p>
        )}
      </section>

      {/* 支払い方法 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" />
          お支払い方法
        </h2>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-600 rounded-lg p-3">
              <CreditCard className="h-8 w-8 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {billing.paymentMethod.type === 'credit_card' ? 'クレジットカード' : '口座振替'}
              </p>
              <p className="text-slate-400 text-sm">
                {billing.paymentMethod.provider} **** {billing.paymentMethod.lastFourDigits}
              </p>
              {billing.paymentMethod.expiryDate && (
                <p className="text-slate-500 text-xs">
                  有効期限: {billing.paymentMethod.expiryDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 支払い履歴 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-orange-500" />
          お支払い履歴
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2 text-slate-400 font-medium">対象月</th>
                <th className="text-right py-3 px-2 text-slate-400 font-medium">金額</th>
                <th className="text-center py-3 px-2 text-slate-400 font-medium">ステータス</th>
                <th className="text-right py-3 px-2 text-slate-400 font-medium">支払い日</th>
              </tr>
            </thead>
            <tbody>
              {billing.paymentHistory.map((payment, index) => {
                const monthLabel = payment.month.replace('-', '年') + '月'
                return (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-2 text-white">{monthLabel}</td>
                    <td className="py-3 px-2 text-white text-right">
                      {payment.totalAmount.toLocaleString()}円
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
                          payment.status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : payment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {payment.status === 'paid'
                          ? '支払済'
                          : payment.status === 'pending'
                            ? '未払い'
                            : '滞納'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400 text-right">
                      {payment.paidDate || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
