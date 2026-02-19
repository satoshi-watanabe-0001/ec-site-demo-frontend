'use client'

import React from 'react'
import { Smartphone } from 'lucide-react'
import type { DeviceInfo } from '@/types'

interface DeviceDetailCardProps {
  device: DeviceInfo
}

export function DeviceDetailCard({ device }: DeviceDetailCardProps): React.ReactElement {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="device-detail">
      <h2 className="text-lg font-bold text-white mb-4">端末情報</h2>
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-10 h-10 text-slate-400" />
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-sm text-slate-400">端末名</p>
            <p className="text-lg font-semibold text-white">{device.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-slate-400">購入日</p>
              <p className="text-white">
                {new Date(device.purchaseDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">支払い状態</p>
              {device.paymentStatus === 'paid' ? (
                <p className="text-teal-400">支払い完了</p>
              ) : (
                <p className="text-yellow-400">分割払い中</p>
              )}
            </div>
            {device.paymentStatus === 'installment' && (
              <>
                <div>
                  <p className="text-sm text-slate-400">分割残額</p>
                  <p className="text-white">¥{device.remainingBalance?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">分割回数</p>
                  <p className="text-white">
                    {device.completedInstallments}/{device.totalInstallments}回
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
