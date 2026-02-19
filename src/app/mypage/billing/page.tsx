/**
 * @fileoverview 請求情報ページ
 * @module app/mypage/billing/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { getBillingDetail, getBillingHistory } from '@/services/BillingApiService'
import type { BillingDetail, BillingHistoryResponse } from '@/types'

export default function BillingPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [billing, setBilling] = useState<BillingDetail | null>(null)
  const [history, setHistory] = useState<BillingHistoryResponse | null>(null)
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
        const [billingData, historyData] = await Promise.all([
          getBillingDetail(),
          getBillingHistory(),
        ])
        setBilling(billingData)
        setHistory(historyData)
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

  if (error || !billing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error || 'データの取得に失敗しました'}</p>
        </div>
      </div>
    )
  }

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'base': return '基本料金'
      case 'usage': return '通信料'
      case 'option': return 'オプション'
      case 'discount': return '割引'
      case 'device': return '端末代金'
      default: return 'その他'
    }
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'base': return 'text-cyan-400'
      case 'usage': return 'text-blue-400'
      case 'option': return 'text-purple-400'
      case 'discount': return 'text-green-400'
      case 'device': return 'text-yellow-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mypage" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← マイページに戻る
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">請求情報</h1>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{billing.billingMonth}分</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              billing.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {billing.isPaid ? '支払い済み' : '未払い'}
            </span>
          </div>

          <div className="text-center py-4 mb-4 border-b border-slate-700">
            <span className="text-4xl font-bold text-white">¥{billing.totalAmount.toLocaleString()}</span>
            <span className="text-slate-400 text-sm ml-1">（税込）</span>
          </div>

          <div className="space-y-3">
            {billing.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${getCategoryColor(item.category)} bg-slate-700`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className="text-white text-sm">{item.itemName}</span>
                  <p className="text-xs text-slate-500 mt-0.5 ml-1">{item.description}</p>
                </div>
                <span className="text-white font-medium">¥{item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-3 flex justify-between">
              <span className="text-slate-400">小計</span>
              <span className="text-white">¥{billing.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">消費税</span>
              <span className="text-white">¥{billing.tax.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-600 pt-3 flex justify-between">
              <span className="text-white font-semibold">合計</span>
              <span className="text-white font-bold text-lg">¥{billing.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">お支払い情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between md:block">
              <span className="text-slate-400">お支払い方法</span>
              <span className="text-white md:block md:mt-1">{billing.paymentMethod}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">カード番号</span>
              <span className="text-white md:block md:mt-1">**** **** **** {billing.cardLastFour}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">請求確定日</span>
              <span className="text-white md:block md:mt-1">{new Date(billing.billingDate).toLocaleDateString('ja-JP')}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">お支払い期限</span>
              <span className="text-white md:block md:mt-1">{new Date(billing.paymentDueDate).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </section>

        {history && (
          <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">請求履歴</h2>
            <div className="space-y-2">
              {history.history.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <span className="text-white text-sm">{entry.billingMonth}</span>
                    {entry.paymentDate && (
                      <span className="text-xs text-slate-500 ml-2">
                        支払日: {new Date(entry.paymentDate).toLocaleDateString('ja-JP')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">¥{entry.totalAmount.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {entry.isPaid ? '済' : '未'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
