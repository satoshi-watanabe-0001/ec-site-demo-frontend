'use client'

/**
 * @fileoverview 支払い方法表示コンポーネント
 * @module components/account/PaymentMethod
 *
 * 登録されている支払い方法の情報を表示する。
 */

import type { PaymentMethodInfo } from '@/types'

/**
 * PaymentMethodのProps
 */
interface PaymentMethodProps {
  /** 支払い方法情報 */
  paymentMethod: PaymentMethodInfo
}

/**
 * 支払い方法タイプのラベルを取得
 */
function getPaymentTypeLabel(type: PaymentMethodInfo['type']): string {
  switch (type) {
    case 'credit_card':
      return 'クレジットカード'
    case 'bank_transfer':
      return '口座振替'
    case 'convenience_store':
      return 'コンビニ払い'
  }
}

/**
 * 支払い方法表示コンポーネント
 *
 * @param props - コンポーネントプロパティ
 */
export function PaymentMethod({ paymentMethod }: PaymentMethodProps) {
  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h2 className="mb-4 text-lg font-semibold">お支払い方法</h2>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700">
          <span className="text-xl" aria-hidden="true">💳</span>
        </div>
        <div>
          <p className="font-medium">{paymentMethod.displayName}</p>
          <p className="text-sm text-slate-400">
            {getPaymentTypeLabel(paymentMethod.type)}
            {paymentMethod.expiryDate && ` ・ 有効期限: ${paymentMethod.expiryDate}`}
          </p>
        </div>
      </div>
    </div>
  )
}
