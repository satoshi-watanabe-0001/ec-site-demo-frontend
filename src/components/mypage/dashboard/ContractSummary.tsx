/**
 * @fileoverview 契約情報サマリーカードコンポーネント
 * @module components/mypage/dashboard/ContractSummary
 *
 * 現在の料金プラン・月額料金・データ容量を表示するカード。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import type { ContractInfo } from '@/types'

interface ContractSummaryProps {
  contract: ContractInfo
}

export function ContractSummary({ contract }: ContractSummaryProps): React.ReactElement {
  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">契約情報</h2>
        <Link href="/mypage/contract" className="text-sm text-primary hover:underline">
          詳細を見る →
        </Link>
      </div>

      <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <p className="text-sm text-blue-100">現在のプラン</p>
        <p className="text-2xl font-bold text-white">{contract.planName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400">月額料金</p>
          <p className="text-xl font-bold text-white">
            ¥{contract.monthlyFee.toLocaleString()}
            <span className="text-sm font-normal text-slate-400">/月</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">データ容量</p>
          <p className="text-xl font-bold text-white">{contract.dataCapacity}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-700 pt-4">
        <p className="text-sm text-slate-400">電話番号</p>
        <p className="text-base font-medium text-white">{contract.phoneNumber}</p>
      </div>

      {contract.options.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-sm text-slate-400">契約中オプション</p>
          {contract.options.map(option => (
            <div
              key={option.id}
              className="flex items-center justify-between rounded-lg bg-slate-700/50 px-3 py-2"
            >
              <span className="text-sm text-slate-300">{option.name}</span>
              <span className="text-sm font-medium text-white">
                ¥{option.monthlyFee.toLocaleString()}/月
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
