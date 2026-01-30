'use client'

/**
 * @fileoverview デバイス情報コンポーネント
 * @module components/mypage/dashboard/DeviceInfo
 *
 * マイページダッシュボードに表示するデバイス情報。
 */

import type { DeviceInfo as DeviceInfoType } from '@/types'
import { cn } from '@/lib/utils'

/**
 * デバイス情報コンポーネントのProps
 */
interface DeviceInfoProps {
  /** デバイス情報 */
  device: DeviceInfoType | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * デバイス情報コンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns デバイス情報表示
 */
export function DeviceInfo({ device, isLoading, className }: DeviceInfoProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-3/4 rounded bg-slate-700" />
            <div className="h-4 w-1/2 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">ご利用端末</h3>
        <p className="text-slate-400">端末情報を取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <h3 className="mb-4 text-lg font-semibold text-white">ご利用端末</h3>

      <div className="mb-4">
        <p className="text-xl font-bold text-white">{device.deviceName}</p>
        <p className="text-sm text-slate-400">{device.manufacturer}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">型番</span>
          <span className="text-white">{device.modelNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">IMEI</span>
          <span className="font-mono text-white">{device.imei}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">購入日</span>
          <span className="text-white">{device.purchaseDate}</span>
        </div>
        {device.warrantyEndDate && (
          <div className="flex justify-between">
            <span className="text-slate-400">保証期限</span>
            <span className="text-white">{device.warrantyEndDate}</span>
          </div>
        )}
      </div>

      {device.installmentBalance !== undefined && device.installmentBalance > 0 && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">分割払い残高</span>
            <span className="font-medium text-white">
              ¥{device.installmentBalance.toLocaleString()}
            </span>
          </div>
          {device.installmentRemainingCount !== undefined && (
            <div className="mt-1 flex justify-between text-sm">
              <span className="text-slate-400">残り回数</span>
              <span className="text-white">{device.installmentRemainingCount}回</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
