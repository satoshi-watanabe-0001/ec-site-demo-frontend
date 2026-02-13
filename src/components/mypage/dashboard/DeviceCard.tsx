/**
 * @fileoverview 端末情報カードコンポーネント
 * @module components/mypage/dashboard/DeviceCard
 *
 * 契約中の端末名・画像・購入日・支払い状況を表示するカード。
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { DeviceInfo } from '@/types'

interface DeviceCardProps {
  device: DeviceInfo
}

export function DeviceCard({ device }: DeviceCardProps): React.ReactElement {
  const formattedDate = format(new Date(device.purchaseDate), 'yyyy年M月d日', { locale: ja })

  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-white">契約中の端末</h2>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
          <Image
            src={device.imageUrl}
            alt={device.name}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        </div>

        <div className="flex-1">
          <p className="text-base font-bold text-white">{device.name}</p>
          <p className="mt-1 text-sm text-slate-400">購入日: {formattedDate}</p>

          {device.remainingBalance !== undefined && (
            <div className="mt-2">
              <p className="text-sm text-slate-400">分割払い残額</p>
              <p className="text-base font-bold text-yellow-400">
                ¥{device.remainingBalance.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
