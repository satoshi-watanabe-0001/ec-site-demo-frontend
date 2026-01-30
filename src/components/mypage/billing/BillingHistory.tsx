'use client'

/**
 * @fileoverview 請求履歴コンポーネント
 * @module components/mypage/billing/BillingHistory
 *
 * 過去の請求履歴を表示するコンポーネント。
 */

import type { BillingHistoryItem } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 請求履歴コンポーネントのProps
 */
interface BillingHistoryProps {
  /** 請求履歴 */
  history: BillingHistoryItem[]
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 請求ステータスの表示ラベルとカラーを取得
 */
function getStatusDisplay(status: BillingHistoryItem['status']) {
  switch (status) {
    case 'paid':
      return { label: '支払い済み', color: 'text-green-400' }
    case 'pending':
      return { label: '請求中', color: 'text-blue-400' }
    case 'overdue':
      return { label: '支払い期限超過', color: 'text-red-400' }
    case 'cancelled':
      return { label: 'キャンセル', color: 'text-slate-400' }
    default:
      return { label: '不明', color: 'text-slate-400' }
  }
}

/**
 * 請求履歴コンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 請求履歴表示
 */
export function BillingHistory({ history, isLoading, className }: BillingHistoryProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-3">
            <div className="h-16 w-full rounded bg-slate-700" />
            <div className="h-16 w-full rounded bg-slate-700" />
            <div className="h-16 w-full rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <h3 className="mb-6 text-lg font-semibold text-white">請求履歴</h3>

      {history.length === 0 ? (
        <p className="text-slate-400">請求履歴がありません</p>
      ) : (
        <div className="space-y-4">
          {history.map(item => {
            const statusDisplay = getStatusDisplay(item.status)
            return (
              <div
                key={item.billingId}
                className="rounded border border-slate-700 bg-slate-700/30 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{item.billingMonth}</span>
                  <span className={cn('text-sm font-medium', statusDisplay.color)}>
                    {statusDisplay.label}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">基本料金</span>
                    <span className="text-white">¥{item.baseFee.toLocaleString()}</span>
                  </div>
                  {item.optionFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">オプション料金</span>
                      <span className="text-white">¥{item.optionFee.toLocaleString()}</span>
                    </div>
                  )}
                  {item.callCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">通話料</span>
                      <span className="text-white">¥{item.callCharges.toLocaleString()}</span>
                    </div>
                  )}
                  {item.dataOverageCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">データ超過料金</span>
                      <span className="text-white">
                        ¥{item.dataOverageCharges.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {item.deviceInstallment > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">端末分割払い</span>
                      <span className="text-white">¥{item.deviceInstallment.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-600 pt-2">
                    <span className="font-medium text-white">合計</span>
                    <span className="font-bold text-white">¥{item.total.toLocaleString()}</span>
                  </div>
                </div>

                {item.paidDate && (
                  <p className="mt-2 text-xs text-slate-500">支払日: {item.paidDate}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
