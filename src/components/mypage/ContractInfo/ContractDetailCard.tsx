'use client'

import React from 'react'
import type { ContractInfo } from '@/types'

interface ContractDetailCardProps {
  contract: ContractInfo
}

export function ContractDetailCard({ contract }: ContractDetailCardProps): React.ReactElement {
  const statusLabels: Record<string, string> = {
    active: '契約中',
    suspended: '一時停止中',
    cancelled: '解約済み',
  }

  const simLabels: Record<string, string> = {
    physical: '物理SIM',
    esim: 'eSIM',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="contract-detail">
      <h2 className="text-lg font-bold text-white mb-4">契約情報</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400">契約ID</p>
            <p className="text-white">{contract.contractId}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">電話番号</p>
            <p className="text-white">{contract.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">契約プラン</p>
            <p className="text-white">{contract.plan.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">月額料金</p>
            <p className="text-teal-400 font-semibold">
              ¥{contract.plan.monthlyFee.toLocaleString()}/月
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">データ容量</p>
            <p className="text-white">{contract.plan.dataCapacityGB}GB</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">契約状態</p>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                contract.status === 'active'
                  ? 'bg-teal-500/20 text-teal-400'
                  : contract.status === 'suspended'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {statusLabels[contract.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-400">SIMタイプ</p>
            <p className="text-white">{simLabels[contract.simType]}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">契約開始日</p>
            <p className="text-white">
              {new Date(contract.contractStartDate).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-400">{contract.plan.description}</p>
        </div>
      </div>
    </div>
  )
}
