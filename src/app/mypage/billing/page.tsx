/**
 * @fileoverview 請求情報ページ
 * @module app/mypage/billing/page
 *
 * 請求情報の詳細、請求履歴、支払い方法を表示するページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useBilling } from '@/hooks'

/**
 * 請求情報ページコンポーネント
 *
 * @returns 請求情報ページ要素
 */
export default function BillingPage(): React.ReactElement {
  const { data: billing, isLoading, error } = useBilling()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
        <span className="ml-3 text-slate-400">読み込み中...</span>
      </div>
    )
  }

  if (error || !billing) {
    return (
      <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm" role="alert">
        請求情報の取得に失敗しました。
      </div>
    )
  }

  const paymentStatusLabel: Record<string, { text: string; color: string }> = {
    paid: { text: '支払い済み', color: 'text-emerald-400' },
    pending: { text: '未払い', color: 'text-yellow-400' },
    overdue: { text: '支払い遅延', color: 'text-red-400' },
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">請求情報</h1>
      </div>

      <div className="space-y-6">
        {/* 当月請求 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">
            {billing.currentBilling.month} 月分のご請求
          </h2>

          <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6">
            <p className="text-sm text-slate-400">ご請求金額（税込）</p>
            <p className="text-4xl font-bold text-white">
              ¥{billing.currentBilling.totalAmount.toLocaleString()}
            </p>
            <div className="mt-2 flex gap-4 text-xs text-slate-400">
              <span>請求確定日: {billing.currentBilling.billingDate}</span>
              <span>支払い予定日: {billing.currentBilling.paymentDueDate}</span>
            </div>
          </div>

          {/* 明細 */}
          <h3 className="mb-3 text-sm font-medium text-slate-400">内訳</h3>
          <div className="space-y-2">
            {billing.currentBilling.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-md bg-slate-700/30 px-4 py-3">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-medium text-white">¥{item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-slate-700 px-4 pt-3">
              <span className="font-medium text-white">合計</span>
              <span className="text-lg font-bold text-white">
                ¥{billing.currentBilling.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 請求履歴 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">請求履歴</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-slate-400 font-medium">年月</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-medium">金額</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-medium">ステータス</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-medium">支払い日</th>
                </tr>
              </thead>
              <tbody>
                {billing.billingHistory.map(history => {
                  const statusInfo = paymentStatusLabel[history.paymentStatus] ?? {
                    text: history.paymentStatus,
                    color: 'text-slate-400',
                  }
                  return (
                    <tr key={history.month} className="border-b border-slate-700/50">
                      <td className="px-4 py-3 text-slate-300">{history.month}</td>
                      <td className="px-4 py-3 text-right text-white">
                        ¥{history.totalAmount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right ${statusInfo.color}`}>
                        {statusInfo.text}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {history.paidAt ?? '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 支払い方法 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">お支払い方法</h2>
          <div className="flex items-center justify-between rounded-lg border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
                💳
              </div>
              <div>
                <p className="text-sm font-medium text-white">{billing.paymentMethod.displayName}</p>
                {billing.paymentMethod.expiryDate && (
                  <p className="text-xs text-slate-400">有効期限: {billing.paymentMethod.expiryDate}</p>
                )}
              </div>
            </div>
            <Link
              href="/mypage/settings"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              変更
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
