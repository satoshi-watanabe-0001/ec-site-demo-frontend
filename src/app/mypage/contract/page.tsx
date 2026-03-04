/**
 * @fileoverview 契約詳細ページ
 * @module app/mypage/contract/page
 *
 * 契約者情報と契約内容の詳細を表示するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { getContractInfo } from '@/services/accountService'
import type { ContractInfo } from '@/types'

/**
 * 契約詳細ページコンポーネント
 *
 * @returns 契約詳細ページ要素
 */
export default function ContractPage(): React.ReactElement {
  const [contract, setContract] = useState<ContractInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContract = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getContractInfo()
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '契約情報の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchContract()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-slate-700 rounded w-3/4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!contract) return <></>

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">契約情報</h2>

      {/* 契約者情報 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="contractor-info-title">
        <h3 id="contractor-info-title" className="text-lg font-bold text-white mb-4">
          契約者情報
        </h3>
        <dl className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">氏名</dt>
            <dd className="text-white">
              {contract.name}（{contract.nameKana}）
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">生年月日</dt>
            <dd className="text-white">
              {new Date(contract.dateOfBirth).toLocaleDateString('ja-JP')}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">住所</dt>
            <dd className="text-white">
              〒{contract.postalCode} {contract.address}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">電話番号</dt>
            <dd className="text-white">{contract.phoneNumber}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">メールアドレス</dt>
            <dd className="text-white">{contract.email}</dd>
          </div>
        </dl>
      </section>

      {/* 契約内容 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="contract-detail-title">
        <h3 id="contract-detail-title" className="text-lg font-bold text-white mb-4">
          契約内容
        </h3>
        <dl className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">契約電話番号</dt>
            <dd className="text-white">{contract.contractPhoneNumber}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">契約日</dt>
            <dd className="text-white">
              {new Date(contract.contractDate).toLocaleDateString('ja-JP')}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">現在のプラン</dt>
            <dd className="text-white font-bold">{contract.currentPlanName}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-slate-400 text-sm sm:w-40 flex-shrink-0">契約中オプション</dt>
            <dd className="text-white">
              {contract.activeOptions.length > 0 ? contract.activeOptions.join('、') : 'なし'}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
