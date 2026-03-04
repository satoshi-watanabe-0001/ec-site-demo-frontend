/**
 * @fileoverview 請求・支払いページ
 * @module app/mypage/billing/page
 *
 * 今月の請求予定額、請求履歴、支払い方法を表示するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getBillingDetail } from '@/services/accountService'
import type { BillingDetailResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { Download, CreditCard, TrendingDown, TrendingUp } from 'lucide-react'

/**
 * 請求・支払いページコンポーネント
 *
 * @returns 請求・支払いページ要素
 */
export default function BillingPage(): React.ReactElement {
  const [billing, setBilling] = useState<BillingDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBilling = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getBillingDetail()
        setBilling(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '請求情報の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBilling()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-20 bg-slate-700 rounded" />
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

  if (!billing) return <></>

  /**
   * 支払い状態に応じたバッジを返す
   */
  const getStatusBadge = (status: string): React.ReactElement => {
    const styles = {
      paid: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      overdue: 'bg-red-500/20 text-red-400',
    }
    const labels = {
      paid: '支払済',
      pending: '未払い',
      overdue: '延滞',
    }
    return (
      <span
        className={cn(
          'text-xs px-2 py-0.5 rounded',
          styles[status as keyof typeof styles] || styles.pending
        )}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">請求・支払い</h2>

      {/* 今月の請求予定額 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="current-billing-title"
      >
        <h3 id="current-billing-title" className="text-lg font-bold text-white mb-4">
          今月の請求予定額（{billing.currentBilling.billingMonth}）
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-slate-300">
            <span>基本料金（ahamo）</span>
            <span>¥{billing.currentBilling.basicFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>通話料金</span>
            <span>¥{billing.currentBilling.callCharges.toLocaleString()}</span>
          </div>
          {billing.currentBilling.optionCharges > 0 && (
            <div className="flex justify-between items-center text-slate-300">
              <span>オプション料金</span>
              <span>¥{billing.currentBilling.optionCharges.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
            <span className="text-white font-bold text-lg">合計</span>
            <span className="text-3xl font-bold text-white">
              ¥{billing.currentBilling.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {billing.currentBilling.previousMonthDiff < 0 ? (
              <>
                <TrendingDown className="h-4 w-4 text-green-400" />
                <span className="text-green-400">
                  前月比 ¥{Math.abs(billing.currentBilling.previousMonthDiff).toLocaleString()} 減
                </span>
              </>
            ) : billing.currentBilling.previousMonthDiff > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-red-400" />
                <span className="text-red-400">
                  前月比 ¥{billing.currentBilling.previousMonthDiff.toLocaleString()} 増
                </span>
              </>
            ) : (
              <span className="text-slate-400">前月と同額</span>
            )}
          </div>
        </div>
      </section>

      {/* 請求履歴 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="billing-history-title"
      >
        <h3 id="billing-history-title" className="text-lg font-bold text-white mb-4">
          請求履歴
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="請求履歴一覧">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 py-2 px-3">請求月</th>
                <th className="text-right text-slate-400 py-2 px-3">金額</th>
                <th className="text-center text-slate-400 py-2 px-3">状態</th>
                <th className="text-center text-slate-400 py-2 px-3">明細</th>
              </tr>
            </thead>
            <tbody>
              {billing.billingHistory.map(history => (
                <tr key={history.billingMonth} className="border-b border-slate-700/50">
                  <td className="text-white py-3 px-3">{history.billingMonth}</td>
                  <td className="text-white py-3 px-3 text-right">
                    ¥{history.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(history.paymentStatus)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                      aria-label={`${history.billingMonth}の明細をダウンロード`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 支払い方法 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="payment-method-title"
      >
        <h3 id="payment-method-title" className="text-lg font-bold text-white mb-4">
          支払い方法
        </h3>
        <div className="space-y-4">
          {billing.paymentMethods.map(method => (
            <div
              key={method.paymentMethodId}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-600 rounded flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-300" />
                </div>
                <div>
                  {method.type === 'credit_card' && (
                    <>
                      <p className="text-white font-medium">
                        {method.cardBrand} •••• {method.lastFourDigits}
                      </p>
                      <p className="text-slate-400 text-xs">
                        有効期限: {method.expirationDate}
                      </p>
                    </>
                  )}
                  {method.type === 'bank_transfer' && (
                    <p className="text-white font-medium">{method.bankName}</p>
                  )}
                  {method.isPrimary && (
                    <span className="text-xs text-primary">メインの支払い方法</span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                変更
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
