/**
 * @fileoverview 端末情報ウィジェットコンポーネント
 * @module components/mypage/Dashboard/DeviceInfoWidget
 */

'use client'

import React from 'react'
import type { DeviceInfo } from '@/types'

interface DeviceInfoWidgetProps {
  device: DeviceInfo
}

export function DeviceInfoWidget({ device }: DeviceInfoWidgetProps): React.ReactElement {
  const formattedDate = new Date(device.purchaseDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-6 shadow-lg border border-slate-600">
      <h3 className="text-lg font-semibold text-white mb-4">ご利用端末</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-2xl">
          📱
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{device.deviceName}</p>
          <p className="text-sm text-slate-400">購入日: {formattedDate}</p>
          <p className="text-sm text-slate-400">
            <span className="inline-flex items-center gap-1">
              {device.paymentStatus}
              {device.remainingBalance !== null && (
                <span className="text-yellow-400">
                  （残り ¥{device.remainingBalance.toLocaleString()}）
                </span>
              )}
            </span>
          </p>
          {device.monthlyPayment !== null && device.remainingMonths !== null && (
            <p className="text-xs text-slate-500 mt-1">
              月々 ¥{device.monthlyPayment.toLocaleString()} × 残り{device.remainingMonths}回
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
