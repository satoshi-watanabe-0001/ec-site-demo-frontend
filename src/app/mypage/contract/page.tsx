/**
 * @fileoverview 契約情報詳細ページ
 * @module app/mypage/contract/page
 *
 * 契約者情報と契約内容の詳細表示。
 */

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getContractInfo } from '@/services/contractService'
import { Badge } from '@/components/ui/badge'

export default function ContractPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['contract'],
    queryFn: () => getContractInfo('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="h-64 rounded-xl bg-slate-800" />
            <div className="h-64 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-900/20 p-6 text-center">
            <p className="text-red-400">データの読み込みに失敗しました。再度お試しください。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/mypage"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">契約情報</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">契約者情報</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-400">氏名</dt>
                <dd className="mt-1 text-white">
                  {data.contractor.lastName} {data.contractor.firstName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">氏名（カナ）</dt>
                <dd className="mt-1 text-white">
                  {data.contractor.lastNameKana} {data.contractor.firstNameKana}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">生年月日</dt>
                <dd className="mt-1 text-white">
                  {new Date(data.contractor.dateOfBirth).toLocaleDateString('ja-JP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">電話番号</dt>
                <dd className="mt-1 text-white">{data.contractor.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">メールアドレス</dt>
                <dd className="mt-1 text-white">{data.contractor.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">住所</dt>
                <dd className="mt-1 text-white">
                  〒{data.contractor.postalCode} {data.contractor.address}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">契約内容</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-400">契約ID</dt>
                <dd className="mt-1 text-white">{data.contractId}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">電話番号</dt>
                <dd className="mt-1 text-white">{data.details.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">契約日</dt>
                <dd className="mt-1 text-white">
                  {new Date(data.details.contractDate).toLocaleDateString('ja-JP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">プラン</dt>
                <dd className="mt-1 text-white">{data.details.planName}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">データ容量</dt>
                <dd className="mt-1 text-white">{data.details.dataCapacity}GB</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">基本料金</dt>
                <dd className="mt-1 text-white">
                  ¥{data.details.monthlyBasicFee.toLocaleString()}/月
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">オプションサービス</h2>
            {data.details.options.length === 0 ? (
              <p className="text-sm text-slate-400">契約中のオプションはありません</p>
            ) : (
              <div className="space-y-3">
                {data.details.options.map(option => (
                  <div
                    key={option.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-slate-700/50 p-3 gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{option.name}</span>
                        <Badge
                          variant={option.status === 'active' ? 'success' : 'warning'}
                        >
                          {option.status === 'active' ? '利用中' : '申込中'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{option.description}</p>
                    </div>
                    <span className="text-sm font-medium text-white shrink-0">
                      ¥{option.monthlyFee.toLocaleString()}/月
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
