'use client'

/**
 * @fileoverview 請求サマリーコンポーネント
 * @module components/mypage/dashboard/BillingSummary
 *
 * マイページダッシュボードに表示する請求情報のサマリー。
 */

import Link from 'next/link'
import type { CurrentBilling } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 請求サマリーコンポーネントのProps
 */
interface BillingSummaryProps {
  /** 現在月の請求情報 */
  billing: CurrentBilling | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 請求ステータスの表示ラベルとカラーを取得
 */
function getStatusDisplay(status: CurrentBilling['status']) {
  switch (status) {
    case 'pending':
      return { label: '請求予定', color: 'text-blue-400' }
    case 'paid':
      return { label: '支払い済み', color: 'text-green-400' }
    case 'overdue':
      return { label: '支払い期限超過', color: 'text-red-400' }
    case 'cancelled':
      return { label: 'キャンセル', color: 'text-slate-400' }
    default:
      return { label: '不明', color: 'text-slate-400' }
  }
}

/**
 * 請求サマリーコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 請求サマリー表示
 */
export function BillingSummary({ billing, isLoading, className }: BillingSummaryProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="mb-4 h-10 w-1/2 rounded bg-slate-700" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-3/4 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!billing) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">今月の請求</h3>
        <p className="text-slate-400">請求情報を取得できませんでした</p>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(billing.status)

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">今月の請求</h3>
        <span className={cn('text-sm font-medium', statusDisplay.color)}>
          {statusDisplay.label}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-white">¥{billing.total.toLocaleString()}</span>
        <span className="ml-2 text-sm text-slate-400">(税込)</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">基本料金</span>
          <span className="text-white">¥{billing.baseFee.toLocaleString()}</span>
        </div>
        {billing.optionFee > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-400">オプション料金</span>
            <span className="text-white">¥{billing.optionFee.toLocaleString()}</span>
          </div>
        )}
        {billing.deviceInstallment > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-400">端末分割払い</span>
            <span className="text-white">¥{billing.deviceInstallment.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-700 pt-2">
          <span className="text-slate-400">支払い期限</span>
          <span className="text-white">{billing.dueDate}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-700 pt-4">
        <Link href="/mypage/billing" className="text-sm text-primary hover:underline">
          請求詳細を見る →
        </Link>
      </div>
    </div>
  )
}
