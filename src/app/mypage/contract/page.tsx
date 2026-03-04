/**
 * @fileoverview 契約詳細ページ
 * @module app/mypage/contract/page
 *
 * 契約プラン、電話番号、端末情報、SIM情報、契約オプションを表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { getContractDetail } from '@/services/accountService'
import type { ContractDetailResponse } from '@/types/account'

/**
 * 契約詳細ページコンポーネント
 */
export default function ContractPage() {
  const [contract, setContract] = useState<ContractDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContract() {
      try {
        const data = await getContractDetail()
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchContract()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!contract) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">契約情報</h2>

      {/* プラン情報 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">ご契約プラン</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-400">プラン名</dt>
            <dd className="mt-1 text-white">{contract.plan.planName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">月額料金</dt>
            <dd className="mt-1 text-white">
              &yen;{contract.plan.monthlyPrice.toLocaleString()}/月（税込）
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">データ容量</dt>
            <dd className="mt-1 text-white">{contract.plan.dataCapacity}GB</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">契約開始日</dt>
            <dd className="mt-1 text-white">{contract.plan.contractStartDate}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">ステータス</dt>
            <dd className="mt-1">
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                {contract.plan.status === 'active'
                  ? '契約中'
                  : contract.plan.status === 'suspended'
                    ? '停止中'
                    : '解約済'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">電話番号</dt>
            <dd className="mt-1 text-white">{contract.phoneNumber}</dd>
          </div>
        </dl>
      </section>

      {/* 端末情報 */}
      {contract.device && (
        <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">ご利用端末</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-400">端末名</dt>
              <dd className="mt-1 text-white">{contract.device.deviceName}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">メーカー</dt>
              <dd className="mt-1 text-white">{contract.device.manufacturer}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">購入日</dt>
              <dd className="mt-1 text-white">{contract.device.purchaseDate}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-400">IMEI</dt>
              <dd className="mt-1 font-mono text-sm text-white">{contract.device.imei}</dd>
            </div>
            {contract.device.installmentRemaining > 0 && (
              <>
                <div>
                  <dt className="text-sm text-slate-400">分割払い残回数</dt>
                  <dd className="mt-1 text-white">{contract.device.installmentRemaining}回</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-400">分割払い月額</dt>
                  <dd className="mt-1 text-white">
                    &yen;{contract.device.installmentMonthly.toLocaleString()}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </section>
      )}

      {/* SIM情報 */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">SIM情報</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-400">SIMタイプ</dt>
            <dd className="mt-1 text-white">
              {contract.sim.simType === 'eSIM' ? 'eSIM' : '物理SIM'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-400">ICCID</dt>
            <dd className="mt-1 font-mono text-sm text-white">{contract.sim.iccid}</dd>
          </div>
        </dl>
      </section>

      {/* 契約オプション */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">ご契約オプション</h3>
        {contract.options.length === 0 ? (
          <p className="text-sm text-slate-400">契約中のオプションはありません</p>
        ) : (
          <div className="space-y-3">
            {contract.options.map(option => (
              <div
                key={option.optionId}
                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-700/30 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{option.optionName}</p>
                  <p className="text-xs text-slate-400">登録日: {option.enrolledDate}</p>
                </div>
                <span className="font-medium text-white">
                  &yen;{option.monthlyPrice.toLocaleString()}/月
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
