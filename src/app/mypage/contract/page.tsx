/**
 * @fileoverview 契約情報詳細ページ
 * @module app/mypage/contract/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { getContractDetail } from '@/services/ContractApiService'
import type { ContractDetail } from '@/types'

export default function ContractPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchContract = async () => {
      try {
        setIsLoading(true)
        const data = await getContractDetail()
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContract()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error || 'データの取得に失敗しました'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mypage" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← マイページに戻る
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">契約情報</h1>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">契約概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between md:block">
              <span className="text-slate-400">契約番号</span>
              <span className="text-white md:block md:mt-1 font-mono">{contract.contractId}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">契約日</span>
              <span className="text-white md:block md:mt-1">
                {new Date(contract.contractDate).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">契約状態</span>
              <span className="text-white md:block md:mt-1">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  {contract.contractStatus}
                </span>
              </span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">次回更新日</span>
              <span className="text-white md:block md:mt-1">
                {new Date(contract.nextRenewalDate).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">プラン情報</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{contract.plan.planName}</p>
              <p className="text-slate-400 text-sm mt-1">{contract.plan.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                ¥{contract.plan.monthlyFee.toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">/月（税込）</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/mypage/plan"
              className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
            >
              プランを変更する
            </Link>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">回線情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between md:block">
              <span className="text-slate-400">電話番号</span>
              <span className="text-white md:block md:mt-1">{contract.phoneNumber}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">SIMタイプ</span>
              <span className="text-white md:block md:mt-1">{contract.simType}</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="text-slate-400">自動更新</span>
              <span className="text-white md:block md:mt-1">
                {contract.autoRenewal ? 'あり' : 'なし'}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">端末情報</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <p className="text-white font-medium">{contract.device.deviceName}</p>
              <p className="text-sm text-slate-400">
                購入日: {new Date(contract.device.purchaseDate).toLocaleDateString('ja-JP')}
              </p>
              <p className="text-sm text-slate-400">{contract.device.paymentStatus}</p>
              {contract.device.remainingBalance !== null && (
                <p className="text-sm text-yellow-400">
                  残り ¥{contract.device.remainingBalance.toLocaleString()}
                  {contract.device.monthlyPayment !== null &&
                    ` (月々¥${contract.device.monthlyPayment.toLocaleString()})`}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">オプションサービス</h2>
          <div className="space-y-3">
            {contract.options.map(option => (
              <div
                key={option.optionId}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">{option.optionName}</p>
                  {option.startDate && (
                    <p className="text-xs text-slate-400">
                      開始日: {new Date(option.startDate).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">¥{option.monthlyFee.toLocaleString()}/月</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      option.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-600 text-slate-400'
                    }`}
                  >
                    {option.status === 'active' ? '契約中' : '未契約'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
