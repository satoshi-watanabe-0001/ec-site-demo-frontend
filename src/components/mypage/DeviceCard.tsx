/**
 * @fileoverview 端末情報カードコンポーネント
 * @module components/mypage/DeviceCard
 *
 * 契約中の端末情報を表示するカード。
 */

'use client'

import React from 'react'
import type { DeviceInfoResponse } from '@/types'

/**
 * DeviceCardコンポーネントのProps
 */
interface DeviceCardProps {
  /** 端末情報 */
  device: DeviceInfoResponse
}

/**
 * 端末情報カードコンポーネント
 *
 * @param props - コンポーネントのProps
 * @returns 端末情報カード要素
 */
export function DeviceCard({ device }: DeviceCardProps): React.ReactElement {
  const paymentProgress =
    device.payment.method === 'installment' && device.payment.totalInstallments
      ? ((device.payment.totalInstallments - (device.payment.remainingInstallments ?? 0)) /
          device.payment.totalInstallments) *
        100
      : 100

  return (
    <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">ご利用端末</h3>

      <div className="flex gap-4">
        {/* 端末画像 */}
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700">
          <div className="text-center text-xs text-slate-400">
            <div className="mb-1 text-2xl">📱</div>
            {device.manufacturer}
          </div>
        </div>

        {/* 端末情報 */}
        <div className="flex-1">
          <p className="text-lg font-semibold text-white">{device.deviceName}</p>
          <p className="text-sm text-slate-400">
            {device.color} / {device.storage}
          </p>
          <p className="mt-1 text-xs text-slate-500">購入日: {device.purchaseDate}</p>
        </div>
      </div>

      {/* 支払い情報 */}
      {device.payment.method === 'installment' && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">月額支払い</span>
            <span className="text-white">
              ¥{device.payment.monthlyAmount?.toLocaleString()}/月
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">残り回数</span>
            <span className="text-white">
              {device.payment.remainingInstallments}/{device.payment.totalInstallments}回
            </span>
          </div>
          <div className="mt-2">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-700"
              role="progressbar"
              aria-valuenow={paymentProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="端末支払い進捗"
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              支払い済み: ¥{device.payment.paidAmount.toLocaleString()} / ¥
              {device.payment.totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
