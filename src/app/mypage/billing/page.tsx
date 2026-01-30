'use client'

/**
 * @fileoverview 請求・支払いページ
 * @module app/mypage/billing/page
 *
 * EC-278: アカウント管理機能
 * シナリオ5: 請求情報確認・支払い方法管理
 *
 * 現在の請求情報、請求履歴、支払い方法を表示・管理するページ。
 */

import { useEffect, useState } from 'react'
import { BillingSummary } from '@/components/mypage/dashboard'
import { BillingHistory, PaymentMethodCard } from '@/components/mypage/billing'
import { useBillingStore } from '@/store/billingStore'
import { getCurrentBilling, getBillingHistory, getPaymentMethod } from '@/services/billingService'
import type { BillingHistoryItem } from '@/types'

/**
 * 請求・支払いページコンポーネント
 *
 * @returns 請求・支払いページ要素
 */
export default function BillingPage() {
  const { currentBilling, paymentMethod, setCurrentBilling, setPaymentMethod, setLoading, isLoading } = useBillingStore()
  const [history, setHistory] = useState<BillingHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true)
      setHistoryLoading(true)

      try {
        const [billingRes, historyRes, paymentRes] = await Promise.all([
          getCurrentBilling(),
          getBillingHistory(),
          getPaymentMethod(),
        ])

        setCurrentBilling(billingRes)
        setHistory(historyRes.items)
        setPaymentMethod(paymentRes)
      } catch (error) {
        console.error('請求情報の取得に失敗しました:', error)
      } finally {
        setLoading(false)
        setHistoryLoading(false)
      }
    }

    fetchBillingData()
  }, [setCurrentBilling, setPaymentMethod, setLoading])

  const handleEditPaymentMethod = () => {
    console.log('支払い方法の編集')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">請求・支払い</h1>

      <div className="space-y-6">
        <BillingSummary billing={currentBilling} isLoading={isLoading} />
        <PaymentMethodCard
          paymentMethod={paymentMethod}
          isLoading={isLoading}
          onEdit={handleEditPaymentMethod}
        />
        <BillingHistory history={history} isLoading={historyLoading} />
      </div>
    </div>
  )
}
