/**
 * @fileoverview 請求情報詳細ページ
 * @module app/mypage/billing/page
 *
 * EC-278: 請求情報の詳細表示ページ。
 * 当月見込み、請求履歴、支払い方法を表示。
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useBillingInfo } from '@/hooks/useBillingInfo'
import { cn } from '@/lib/utils'

export default function BillingDetailPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading, error } = useBillingInfo(isAuthenticated)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">請求情報の取得に失敗しました。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">請求・お支払い</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {data.currentMonthEstimate.month} のご利用料金
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {data.currentMonthEstimate.isConfirmed
                ? '確定済み'
                : '※ 見込み額です。確定後に変動する場合があります。'}
            </p>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900">
                ¥{data.currentMonthEstimate.totalAmount.toLocaleString()}
              </div>
              <span className="text-xs text-gray-500">税込</span>
            </div>

            <div className="space-y-2 border-t pt-4">
              {data.currentMonthEstimate.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.itemName}</span>
                  <span className="text-gray-900">¥{item.amount.toLocaleString()}</span>
                </div>
              ))}
              {data.currentMonthEstimate.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>割引</span>
                  <span>-¥{data.currentMonthEstimate.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>合計</span>
                <span>¥{data.currentMonthEstimate.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">お支払い方法</h2>
            <div className="p-4 border rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{data.paymentMethod.displayName}</p>
                {data.paymentMethod.expiryDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    有効期限: {data.paymentMethod.expiryDate}
                  </p>
                )}
              </div>
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {data.paymentMethod.type === 'credit_card' ? 'クレジットカード' : '銀行口座'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">請求履歴</h2>
            <div className="space-y-4">
              {data.history.map(billing => (
                <div key={billing.month} className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{billing.month}</h3>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        billing.isConfirmed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {billing.isConfirmed ? '確定' : '見込み'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {billing.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-500">{item.itemName}</span>
                        <span className="text-gray-700">¥{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                      <span>合計</span>
                      <span>¥{billing.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
