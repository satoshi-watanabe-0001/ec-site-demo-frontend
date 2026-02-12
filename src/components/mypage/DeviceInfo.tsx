/**
 * @fileoverview 契約中端末情報コンポーネント
 * @module components/mypage/DeviceInfo
 *
 * ダッシュボードに表示する端末情報カード。
 */

'use client'

import React from 'react'
import { Smartphone } from 'lucide-react'
import type { DeviceInfoData } from '@/services/accountService'

/**
 * 端末情報コンポーネントのProps型定義
 */
interface DeviceInfoProps {
  /** 端末情報 */
  device: DeviceInfoData
}

/**
 * 端末情報コンポーネント
 *
 * @param props - 端末情報のプロパティ
 * @returns 端末情報要素
 */
export function DeviceInfo({ device }: DeviceInfoProps): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700">
          <Smartphone className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-white">{device.name}</p>
          <p className="text-sm text-slate-400">
            購入日: {new Date(device.purchaseDate).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">支払い状況</span>
          <span className="text-slate-300">{device.paymentStatus}</span>
        </div>
        {device.remainingBalance > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">残債額</span>
              <span className="text-slate-300">¥{device.remainingBalance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">残り回数</span>
              <span className="text-slate-300">{device.remainingInstallments}回</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
