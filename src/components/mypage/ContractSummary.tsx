/**
 * @fileoverview 契約情報サマリーコンポーネント
 * @module components/mypage/ContractSummary
 *
 * ダッシュボードに表示する契約情報のサマリー。
 */

'use client'

import React from 'react'
import type { ContractInfo } from '@/types/contract'

/**
 * 契約情報サマリーのProps型定義
 */
interface ContractSummaryProps {
  /** 契約情報 */
  contract: ContractInfo
}

/**
 * 契約情報サマリーコンポーネント
 *
 * @param props - サマリーのプロパティ
 * @returns 契約情報サマリー要素
 */
export function ContractSummary({ contract }: ContractSummaryProps): React.ReactElement {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">プラン</span>
        <span className="font-semibold text-white">{contract.details.planName}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">データ容量</span>
        <span className="font-semibold text-white">{contract.details.dataCapacity}GB</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">月額料金</span>
        <span className="font-semibold text-white">
          ¥{contract.details.monthlyBasicFee.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">電話番号</span>
        <span className="text-sm text-slate-300">{contract.details.phoneNumber}</span>
      </div>
    </div>
  )
}
