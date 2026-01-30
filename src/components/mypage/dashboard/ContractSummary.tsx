'use client'

/**
 * @fileoverview 契約サマリーコンポーネント
 * @module components/mypage/dashboard/ContractSummary
 *
 * マイページダッシュボードに表示する契約情報のサマリー。
 */

import Link from 'next/link'
import type { ContractSummary as ContractSummaryType } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 契約サマリーコンポーネントのProps
 */
interface ContractSummaryProps {
  /** 契約サマリー情報 */
  summary: ContractSummaryType | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 契約ステータスの表示ラベルとカラーを取得
 */
function getStatusDisplay(status: ContractSummaryType['status']) {
  switch (status) {
    case 'active':
      return { label: '契約中', color: 'bg-green-500' }
    case 'suspended':
      return { label: '一時停止中', color: 'bg-yellow-500' }
    case 'cancelled':
      return { label: '解約済み', color: 'bg-red-500' }
    case 'pending':
      return { label: '手続き中', color: 'bg-blue-500' }
    default:
      return { label: '不明', color: 'bg-gray-500' }
  }
}

/**
 * 契約サマリーコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 契約サマリー表示
 */
export function ContractSummary({ summary, isLoading, className }: ContractSummaryProps) {
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

  if (!summary) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">契約情報</h3>
        <p className="text-slate-400">契約情報を取得できませんでした</p>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(summary.status)

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">契約情報</h3>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium text-white',
            statusDisplay.color
          )}
        >
          {statusDisplay.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">プラン</span>
          <span className="font-medium text-white">{summary.planName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">電話番号</span>
          <span className="font-medium text-white">{summary.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">月額基本料金</span>
          <span className="font-medium text-white">¥{summary.monthlyBaseFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">契約開始日</span>
          <span className="font-medium text-white">{summary.startDate}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-700 pt-4">
        <Link href="/mypage/contract" className="text-sm text-primary hover:underline">
          契約詳細を見る →
        </Link>
      </div>
    </div>
  )
}
