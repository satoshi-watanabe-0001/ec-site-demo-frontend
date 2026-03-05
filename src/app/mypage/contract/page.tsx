/**
 * @fileoverview 契約情報ページ
 * @module app/mypage/contract/page
 *
 * 契約者の個人情報と契約内容を表示するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { User, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react'
import { getContract } from '@/services/accountService'
import type { ContractInfo } from '@/types'

/**
 * 情報行コンポーネント
 */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}): React.ReactElement {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700 last:border-0">
      <Icon className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <dt className="text-sm text-slate-400">{label}</dt>
        <dd className="text-white mt-0.5">{value}</dd>
      </div>
    </div>
  )
}

/**
 * 契約情報ページコンポーネント
 *
 * @returns 契約情報ページ要素
 */
export default function ContractPage(): React.ReactElement {
  const [contract, setContract] = useState<ContractInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await getContract()
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (!contract) return <div />

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">契約情報</h1>
        <p className="text-slate-400 mt-1">ご契約内容と個人情報をご確認いただけます</p>
      </div>

      {/* 個人情報セクション */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          個人情報
        </h2>
        <dl>
          <InfoRow icon={User} label="契約者名" value={`${contract.name}（${contract.nameKana}）`} />
          <InfoRow icon={Calendar} label="生年月日" value={contract.birthday} />
          <InfoRow icon={MapPin} label="住所" value={`〒${contract.postalCode} ${contract.address}`} />
          <InfoRow icon={Phone} label="電話番号" value={contract.phoneNumber} />
          <InfoRow icon={Mail} label="メールアドレス" value={contract.email} />
        </dl>
      </section>

      {/* 契約内容セクション */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" />
          契約内容
        </h2>
        <dl>
          <InfoRow icon={Phone} label="契約電話番号" value={contract.contractPhoneNumber} />
          <InfoRow icon={Calendar} label="契約日" value={contract.contractDate} />
          <InfoRow icon={FileText} label="現在のプラン" value={contract.currentPlanName} />
          <InfoRow
            icon={FileText}
            label="契約中のオプション"
            value={
              contract.subscribedOptionIds.length > 0
                ? contract.subscribedOptionIds.join('、')
                : 'なし'
            }
          />
        </dl>
      </section>
    </div>
  )
}
