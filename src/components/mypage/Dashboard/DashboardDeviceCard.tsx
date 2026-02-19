'use client'

import React from 'react'
import { Smartphone } from 'lucide-react'

interface DashboardDeviceCardProps {
  name: string
  purchaseDate: string
  paymentStatus: 'paid' | 'installment'
  remainingBalance?: number
}

export function DashboardDeviceCard({
  name,
  purchaseDate,
  paymentStatus,
  remainingBalance,
}: DashboardDeviceCardProps): React.ReactElement {
  const formattedDate = new Date(purchaseDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="device-card">
      <h3 className="text-sm font-medium text-slate-400 mb-3">ご利用端末</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{name}</p>
          <p className="text-sm text-slate-400">購入日: {formattedDate}</p>
          {paymentStatus === 'installment' && remainingBalance !== undefined && (
            <p className="text-sm text-yellow-400">
              分割残額: ¥{remainingBalance.toLocaleString()}
            </p>
          )}
          {paymentStatus === 'paid' && (
            <p className="text-sm text-teal-400">支払い完了</p>
          )}
        </div>
      </div>
    </div>
  )
}
