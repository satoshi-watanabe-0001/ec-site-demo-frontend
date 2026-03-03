/**
 * @fileoverview 請求・支払い情報ページ
 * @module app/mypage/billing/page
 *
 * EC-278: 請求情報と支払い方法の確認画面。
 * 当月請求、請求履歴、支払い方法を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { CreditCard, Receipt, History, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import type { CurrentBilling, BillingHistoryResponse, PaymentMethod } from '@/types/billing'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 金額のフォーマット
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount)
}

/**
 * 支払い状態のラベルとスタイル
 */
const getPaymentStatusInfo = (status: string) => {
  switch (status) {
    case 'paid':
      return { label: '支払い済み', icon: CheckCircle, className: 'text-green-400' }
    case 'pending':
      return { label: '処理中', icon: Clock, className: 'text-yellow-400' }
    case 'overdue':
      return { label: '未払い', icon: AlertTriangle, className: 'text-red-400' }
    default:
      return { label: '処理中', icon: Clock, className: 'text-slate-400' }
  }
}

/**
 * 請求・支払い情報ページコンポーネント
 *
 * @returns 請求・支払い情報ページ要素
 */
export default function BillingPage(): React.ReactElement {
  const [billing, setBilling] = useState<CurrentBilling | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistoryResponse | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billingRes, historyRes, paymentRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/account/billing/current`),
          fetch(`${BASE_URL}/api/v1/account/billing/history`),
          fetch(`${BASE_URL}/api/v1/account/payment-method`),
        ])
        if (billingRes.ok) setBilling(await billingRes.json())
        if (historyRes.ok) setBillingHistory(await historyRes.json())
        if (paymentRes.ok) setPaymentMethod(await paymentRes.json())
      } catch (error) {
        console.error('請求情報の取得に失敗しました:', error)
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
        <h1 className="text-2xl font-bold text-white">請求・支払い</h1>
        <p className="text-slate-400 mt-1">請求情報と支払い方法を確認できます</p>
      </div>

      {/* 当月請求情報 */}
      {billing && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              {billing.billingMonth}月の請求
              {!billing.isConfirmed && (
                <span className="text-xs text-yellow-400 ml-2">（見積もり）</span>
              )}
            </h2>
          </div>

          <p className="text-4xl font-bold text-white mb-4">
            ¥{formatCurrency(billing.totalAmount)}
            <span className="text-sm text-slate-400 font-normal ml-2">（税込）</span>
          </p>

          {/* 請求明細 */}
          <div className="space-y-2 border-t border-slate-700 pt-4">
            {billing.details.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-300">{detail.name}</span>
                <span className={detail.amount < 0 ? 'text-green-400' : 'text-white'}>
                  {detail.amount < 0 ? '-' : ''}¥{formatCurrency(Math.abs(detail.amount))}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-slate-700 pt-2 mt-2">
              <span className="text-white">合計（税込）</span>
              <span className="text-white">¥{formatCurrency(billing.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 支払い方法 */}
      {paymentMethod && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">支払い方法</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
            <CreditCard className="h-8 w-8 text-slate-400" />
            <div>
              {paymentMethod.cardInfo && (
                <>
                  <p className="text-white font-medium">{paymentMethod.cardInfo.brand}</p>
                  <p className="text-slate-400 text-sm">
                    **** **** **** {paymentMethod.cardInfo.last4}
                    <span className="ml-3">有効期限: {paymentMethod.cardInfo.expiryDate}</span>
                  </p>
                </>
              )}
              {paymentMethod.bankAccountInfo && (
                <>
                  <p className="text-white font-medium">{paymentMethod.bankAccountInfo.bankName}</p>
                  <p className="text-slate-400 text-sm">
                    {paymentMethod.bankAccountInfo.branchName} ****
                    {paymentMethod.bankAccountInfo.accountLast4}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 請求履歴 */}
      {billingHistory && billingHistory.history.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">請求履歴</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="請求履歴">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 pb-3 pr-4">請求月</th>
                  <th className="text-right text-slate-400 pb-3 pr-4">金額</th>
                  <th className="text-center text-slate-400 pb-3 pr-4">状態</th>
                  <th className="text-right text-slate-400 pb-3">支払い日</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.history.map(item => {
                  const statusInfo = getPaymentStatusInfo(item.paymentStatus)
                  const StatusIcon = statusInfo.icon
                  return (
                    <tr key={item.billingMonth} className="border-b border-slate-700/50">
                      <td className="py-3 pr-4 text-slate-300">{item.billingMonth}</td>
                      <td className="py-3 pr-4 text-right text-white">
                        ¥{formatCurrency(item.totalAmount)}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs ${statusInfo.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400">{item.paidAt || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
