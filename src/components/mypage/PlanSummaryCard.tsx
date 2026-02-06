/**
 * @fileoverview プランサマリーカードコンポーネント
 * @module components/mypage/PlanSummaryCard
 *
 * 現在のahamoプラン情報を表示するカード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContractInfo } from '@/types'

interface PlanSummaryCardProps {
  contract: ContractInfo
  className?: string
}

export function PlanSummaryCard({
  contract,
  className,
}: PlanSummaryCardProps): React.ReactElement {
  const { plan, phoneNumber, options } = contract
  const optionTotal = options.reduce((sum, opt) => sum + opt.monthlyFee, 0)

  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-md p-6 transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">ご契約プラン</h2>
        <Link
          href="/mypage/contract"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          詳細
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">プラン</span>
          <span className="font-semibold text-gray-900">{plan.planName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">月額料金</span>
          <span className="font-semibold text-gray-900">
            ¥{plan.monthlyFee.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">データ容量</span>
          <span className="font-semibold text-gray-900">{plan.dataCapacity}GB</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">電話番号</span>
          <span className="font-semibold text-gray-900">{phoneNumber}</span>
        </div>
        {options.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">オプション ({options.length}件)</span>
              <span className="font-semibold text-gray-900">
                +¥{optionTotal.toLocaleString()}
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {options.map((opt) => (
                <li key={opt.optionId} className="text-xs text-gray-500 flex justify-between">
                  <span>{opt.optionName}</span>
                  <span>¥{opt.monthlyFee.toLocaleString()}/月</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Link
          href="/mypage/plan-change"
          className="block w-full text-center py-2 px-4 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          プラン変更
        </Link>
      </div>
    </div>
  )
}
