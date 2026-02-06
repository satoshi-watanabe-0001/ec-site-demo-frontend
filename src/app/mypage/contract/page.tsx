/**
 * @fileoverview 契約情報詳細ページ
 * @module app/mypage/contract/page
 *
 * EC-278: 契約情報の詳細表示ページ。
 * 契約プラン、オプション、個人情報、SIM情報を表示。
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useContractDetails } from '@/hooks/useContractDetails'

export default function ContractDetailPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading, error } = useContractDetails(isAuthenticated)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">契約情報の取得に失敗しました。</p>
          </div>
        </div>
      </div>
    )
  }

  const contractDate = new Date(data.contractDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">契約情報</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ご契約プラン</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">プラン名</dt>
                <dd className="font-semibold text-gray-900">{data.plan.planName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">月額料金</dt>
                <dd className="font-semibold text-gray-900">
                  ¥{data.plan.monthlyFee.toLocaleString()}（税込）
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">データ容量</dt>
                <dd className="font-semibold text-gray-900">{data.plan.dataCapacity}GB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">5分以内通話無料</dt>
                <dd className="font-semibold text-gray-900">
                  {data.plan.freeCallIncluded ? '対象' : '対象外'}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <Link
                href="/mypage/plan-change"
                className="block w-full text-center py-2 px-4 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                プラン変更
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ご契約者情報</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">契約者名</dt>
                <dd className="font-semibold text-gray-900">{data.contractorName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">電話番号</dt>
                <dd className="font-semibold text-gray-900">{data.phoneNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">メールアドレス</dt>
                <dd className="font-semibold text-gray-900">{data.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">契約日</dt>
                <dd className="font-semibold text-gray-900">{contractDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">SIMタイプ</dt>
                <dd className="font-semibold text-gray-900">{data.simType}</dd>
              </div>
            </dl>
          </div>

          {data.options.length > 0 && (
            <div className="rounded-2xl bg-white shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">ご契約オプション</h2>
                <Link href="/mypage/options" className="text-sm text-blue-600 hover:text-blue-800">
                  オプション管理
                </Link>
              </div>
              <div className="space-y-4">
                {data.options.map(option => (
                  <div key={option.optionId} className="p-4 border rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{option.optionName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          契約開始日: {new Date(option.startDate).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap ml-4">
                        ¥{option.monthlyFee.toLocaleString()}/月
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
