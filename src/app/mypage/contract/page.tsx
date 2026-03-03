/**
 * @fileoverview 契約詳細ページ
 * @module app/mypage/contract/page
 *
 * EC-278: 契約内容の確認画面。
 * プラン情報、端末情報、SIM情報、契約オプション等を表示。
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Smartphone,
  CreditCard,
  ContactRound,
  Shield,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import type { ContractDetail } from '@/types/contract'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 金額のフォーマット
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount)
}

/**
 * 契約詳細ページコンポーネント
 *
 * @returns 契約詳細ページ要素
 */
export default function ContractPage(): React.ReactElement {
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/account/contract`)
        if (res.ok) {
          setContract(await res.json())
        }
      } catch (error) {
        console.error('契約情報の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContract()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">契約情報を取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">契約内容</h1>
        <p className="text-slate-400 mt-1">契約番号: {contract.contractNumber}</p>
      </div>

      {/* 契約状態 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">契約状態</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-sm">ステータス</p>
            <p className="text-white mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                {contract.status === 'active' ? '契約中' : contract.status}
              </span>
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">契約開始日</p>
            <p className="text-white mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              {contract.startDate}
            </p>
          </div>
        </div>
      </div>

      {/* プラン情報 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">現在のプラン</h2>
          </div>
          <Link
            href="/mypage/plan"
            className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
          >
            プラン変更 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{contract.currentPlan.name}</span>
            <span className="text-lg text-white">
              月額 ¥{formatCurrency(contract.currentPlan.monthlyPrice)}
            </span>
          </div>
          <p className="text-slate-400 text-sm">{contract.currentPlan.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {contract.currentPlan.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 端末情報 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">端末情報</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-12 w-12 text-slate-400" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold text-white">{contract.device.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-400">メーカー: </span>
                <span className="text-slate-200">{contract.device.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400">カラー: </span>
                <span className="text-slate-200">{contract.device.color}</span>
              </div>
              <div>
                <span className="text-slate-400">ストレージ: </span>
                <span className="text-slate-200">{contract.device.storage}</span>
              </div>
              <div>
                <span className="text-slate-400">購入日: </span>
                <span className="text-slate-200">{contract.device.purchaseDate}</span>
              </div>
            </div>
            {contract.device.installmentInfo && (
              <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-sm font-medium text-slate-300 mb-2">分割支払い情報</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">月額: </span>
                    <span className="text-white">
                      ¥{formatCurrency(contract.device.installmentInfo.monthlyAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">残回数: </span>
                    <span className="text-white">
                      {contract.device.installmentInfo.remainingInstallments}/
                      {contract.device.installmentInfo.totalInstallments}回
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">残債額: </span>
                    <span className="text-white">
                      ¥{formatCurrency(contract.device.installmentInfo.remainingAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">端末総額: </span>
                    <span className="text-white">
                      ¥{formatCurrency(contract.device.installmentInfo.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIM情報 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ContactRound className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">SIM情報</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-400">SIM種別</p>
            <p className="text-white mt-1">
              {contract.simInfo.simType === 'esim' ? 'eSIM' : '物理SIM'}
            </p>
          </div>
          <div>
            <p className="text-slate-400">電話番号</p>
            <p className="text-white mt-1">{contract.simInfo.phoneNumber}</p>
          </div>
          <div>
            <p className="text-slate-400">ICCID（下4桁）</p>
            <p className="text-white mt-1">****{contract.simInfo.iccidLast4}</p>
          </div>
        </div>
      </div>

      {/* 契約オプション */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">契約オプション</h2>
          </div>
          <Link
            href="/mypage/options"
            className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
          >
            オプション管理 <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {contract.options.length > 0 ? (
          <div className="space-y-3">
            {contract.options.map(option => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{option.name}</p>
                  <p className="text-slate-400 text-sm">{option.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">¥{formatCurrency(option.monthlyPrice)}/月</p>
                  <span
                    className={`text-xs ${option.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {option.status === 'active' ? '利用中' : option.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">契約中のオプションはありません</p>
        )}
      </div>
    </div>
  )
}
