/**
 * @fileoverview 端末情報カードコンポーネント
 * @module components/mypage/DeviceInfoCard
 *
 * 利用中の端末情報と分割払い状況を表示するカード。
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { DeviceInfo } from '@/types'

interface DeviceInfoCardProps {
  device: DeviceInfo | null
  className?: string
}

export function DeviceInfoCard({
  device,
  className,
}: DeviceInfoCardProps): React.ReactElement {
  if (!device) {
    return (
      <div
        className={cn(
          'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
          className
        )}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">ご利用端末</h2>
        <p className="text-sm text-gray-500">端末情報が登録されていません。</p>
      </div>
    )
  }

  const purchaseDate = new Date(device.purchaseDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4">ご利用端末</h2>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📱</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{device.name}</h3>
          <p className="text-xs text-gray-500 mt-1">購入日: {purchaseDate}</p>
        </div>
      </div>

      {device.remainingPayments > 0 && (
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">月々のお支払い</span>
            <span className="font-semibold text-gray-900">
              ¥{device.monthlyPayment.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">残り回数</span>
            <span className="text-gray-900">{device.remainingPayments}回</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">残債</span>
            <span className="font-semibold text-gray-900">
              ¥{device.remainingBalance.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
