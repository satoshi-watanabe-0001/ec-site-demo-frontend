'use client'

/**
 * @fileoverview 契約詳細コンポーネント
 * @module components/mypage/contract/ContractDetails
 *
 * 契約の詳細情報を表示するコンポーネント。
 */

import type { ContractDetails as ContractDetailsType } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 契約詳細コンポーネントのProps
 */
interface ContractDetailsProps {
  /** 契約詳細情報 */
  details: ContractDetailsType | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 契約ステータスの表示ラベルとカラーを取得
 */
function getStatusDisplay(status: ContractDetailsType['status']) {
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
 * 契約詳細コンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 契約詳細表示
 */
export function ContractDetails({ details, isLoading, className }: ContractDetailsProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-3/4 rounded bg-slate-700" />
            <div className="h-4 w-1/2 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">契約詳細</h3>
        <p className="text-slate-400">契約詳細を取得できませんでした</p>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(details.status)

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">契約詳細</h3>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium text-white',
            statusDisplay.color
          )}
        >
          {statusDisplay.label}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-white">基本情報</h4>
          <div className="space-y-3 rounded bg-slate-700/50 p-4">
            <div className="flex justify-between">
              <span className="text-slate-400">契約番号</span>
              <span className="font-mono text-white">{details.contractNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">電話番号</span>
              <span className="text-white">{details.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">契約開始日</span>
              <span className="text-white">{details.startDate}</span>
            </div>
            {details.endDate && (
              <div className="flex justify-between">
                <span className="text-slate-400">契約終了日</span>
                <span className="text-white">{details.endDate}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-white">プラン情報</h4>
          <div className="space-y-3 rounded bg-slate-700/50 p-4">
            <div className="flex justify-between">
              <span className="text-slate-400">プラン名</span>
              <span className="text-white">{details.plan.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">データ容量</span>
              <span className="text-white">{details.plan.dataCapacity}GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">月額基本料金</span>
              <span className="text-white">¥{details.plan.monthlyFee.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {details.options.length > 0 && (
          <div>
            <h4 className="mb-3 font-medium text-white">契約中オプション</h4>
            <div className="space-y-2">
              {details.options.map(option => (
                <div
                  key={option.optionId}
                  className="flex items-center justify-between rounded bg-slate-700/50 p-3"
                >
                  <span className="text-white">{option.optionName}</span>
                  <span className="text-slate-400">¥{option.monthlyFee.toLocaleString()}/月</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="mb-3 font-medium text-white">SIM情報</h4>
          <div className="space-y-3 rounded bg-slate-700/50 p-4">
            <div className="flex justify-between">
              <span className="text-slate-400">SIMタイプ</span>
              <span className="text-white">
                {details.simInfo.simType === 'physical' ? '物理SIM' : 'eSIM'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ICCID</span>
              <span className="font-mono text-sm text-white">{details.simInfo.iccid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">アクティベーション日</span>
              <span className="text-white">{details.simInfo.activationDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
