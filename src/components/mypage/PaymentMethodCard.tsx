/**
 * @fileoverview 支払い方法カードコンポーネント
 * @module components/mypage/PaymentMethodCard
 *
 * 登録されている支払い方法を表示するカード。
 */

'use client'

import React from 'react'
import { CreditCard, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PaymentMethod } from '@/types/billing'

/**
 * 支払い方法カードのProps型定義
 */
interface PaymentMethodCardProps {
  /** 支払い方法 */
  paymentMethod: PaymentMethod
}

/**
 * 支払い方法カードコンポーネント
 *
 * @param props - カードのプロパティ
 * @returns 支払い方法カード要素
 */
export function PaymentMethodCard({ paymentMethod }: PaymentMethodCardProps): React.ReactElement {
  return (
    <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">お支払い方法</h3>
        {paymentMethod.isDefault && <Badge variant="info">デフォルト</Badge>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700">
          {paymentMethod.type === 'credit_card' ? (
            <CreditCard className="h-6 w-6 text-blue-400" />
          ) : (
            <Building2 className="h-6 w-6 text-green-400" />
          )}
        </div>

        <div className="flex-1">
          {paymentMethod.type === 'credit_card' ? (
            <>
              <p className="font-medium text-white">
                {paymentMethod.cardBrand} **** {paymentMethod.lastFourDigits}
              </p>
              <p className="text-sm text-slate-400">有効期限: {paymentMethod.expiryDate}</p>
            </>
          ) : (
            <>
              <p className="font-medium text-white">{paymentMethod.bankName}</p>
              <p className="text-sm text-slate-400">
                {paymentMethod.accountType} **** {paymentMethod.accountLastFourDigits}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
