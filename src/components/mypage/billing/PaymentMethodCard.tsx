'use client'

/**
 * @fileoverview 支払い方法カードコンポーネント
 * @module components/mypage/billing/PaymentMethodCard
 *
 * 登録されている支払い方法を表示するコンポーネント。
 */

import type { PaymentMethod } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * 支払い方法カードコンポーネントのProps
 */
interface PaymentMethodCardProps {
  /** 支払い方法情報 */
  paymentMethod: PaymentMethod | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 編集ボタンクリック時のコールバック */
  onEdit?: () => void
  /** 追加のクラス名 */
  className?: string
}

/**
 * カードブランドのアイコンを取得
 */
function getCardBrandIcon(brand: string): string {
  switch (brand.toLowerCase()) {
    case 'visa':
      return '💳 VISA'
    case 'mastercard':
      return '💳 Mastercard'
    case 'jcb':
      return '💳 JCB'
    case 'amex':
      return '💳 AMEX'
    default:
      return '💳'
  }
}

/**
 * 支払い方法カードコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 支払い方法カード表示
 */
export function PaymentMethodCard({
  paymentMethod,
  isLoading,
  onEdit,
  className,
}: PaymentMethodCardProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-3/4 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!paymentMethod) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">お支払い方法</h3>
        <p className="mb-4 text-slate-400">支払い方法が登録されていません</p>
        {onEdit && (
          <Button onClick={onEdit} variant="outline" size="sm">
            支払い方法を登録
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">お支払い方法</h3>
        {onEdit && (
          <Button onClick={onEdit} variant="ghost" size="sm">
            変更
          </Button>
        )}
      </div>

      <div className="rounded bg-slate-700/50 p-4">
        {paymentMethod.type === 'credit_card' && paymentMethod.cardInfo && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCardBrandIcon(paymentMethod.cardInfo.brand)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">カード番号</span>
              <span className="font-mono text-white">
                **** **** **** {paymentMethod.cardInfo.lastFourDigits}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">有効期限</span>
              <span className="text-white">{paymentMethod.cardInfo.expiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">名義人</span>
              <span className="text-white">{paymentMethod.cardInfo.holderName}</span>
            </div>
          </div>
        )}

        {paymentMethod.type === 'bank_transfer' && paymentMethod.bankInfo && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏦</span>
              <span className="font-medium text-white">口座振替</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">金融機関</span>
              <span className="text-white">{paymentMethod.bankInfo.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">支店名</span>
              <span className="text-white">{paymentMethod.bankInfo.branchName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">口座種別</span>
              <span className="text-white">
                {paymentMethod.bankInfo.accountType === 'checking' ? '当座' : '普通'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">口座番号</span>
              <span className="font-mono text-white">
                ****{paymentMethod.bankInfo.accountNumberLast4}
              </span>
            </div>
          </div>
        )}

        {paymentMethod.type === 'carrier_billing' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span className="font-medium text-white">キャリア決済</span>
            </div>
            <p className="text-sm text-slate-400">
              毎月の携帯電話料金と合算してお支払いいただけます
            </p>
          </div>
        )}
      </div>

      {paymentMethod.isDefault && (
        <p className="mt-3 text-sm text-green-400">デフォルトの支払い方法</p>
      )}
    </div>
  )
}
