/**
 * @fileoverview 契約情報ページ
 * @module app/mypage/contract/page
 *
 * 契約内容・顧客情報の詳細を表示するページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useAccountInfo } from '@/hooks'

/**
 * 契約情報ページコンポーネント
 *
 * @returns 契約情報ページ要素
 */
export default function ContractPage(): React.ReactElement {
  const { data: accountInfo, isLoading, error } = useAccountInfo()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
        <span className="ml-3 text-slate-400">読み込み中...</span>
      </div>
    )
  }

  if (error || !accountInfo) {
    return (
      <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm" role="alert">
        契約情報の取得に失敗しました。
      </div>
    )
  }

  const { customer, plan } = accountInfo

  const contractStatusLabel: Record<string, { text: string; color: string }> = {
    active: { text: '契約中', color: 'bg-emerald-500/20 text-emerald-400' },
    suspended: { text: '一時停止', color: 'bg-yellow-500/20 text-yellow-400' },
    cancelled: { text: '解約済み', color: 'bg-red-500/20 text-red-400' },
  }

  const status = contractStatusLabel[customer.contractStatus] ?? {
    text: customer.contractStatus,
    color: 'bg-slate-500/20 text-slate-400',
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">契約情報</h1>
      </div>

      <div className="space-y-6">
        {/* 契約プラン */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">ご契約プラン</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">プラン名</span>
              <span className="text-lg font-semibold text-white">{plan.planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">月額料金</span>
              <span className="text-white">¥{plan.monthlyPrice.toLocaleString()}（税込）</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">データ容量</span>
              <span className="text-white">{plan.dataCapacityGB}GB/月</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">プラン説明</span>
              <span className="text-white">{plan.description}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">契約ステータス</span>
              <span className={`rounded-full px-3 py-1 text-sm ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>
        </div>

        {/* 顧客情報 */}
        <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">お客さま情報</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">お客さまID</span>
              <span className="text-white font-mono">{customer.customerId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">氏名</span>
              <span className="text-white">{customer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">メールアドレス</span>
              <span className="text-white">{customer.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">電話番号</span>
              <span className="text-white">{customer.phoneNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">契約日</span>
              <span className="text-white">{customer.contractDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">契約中オプション数</span>
              <span className="text-white">{accountInfo.activeOptionsCount}件</span>
            </div>
          </div>
        </div>

        {/* アクション */}
        <div className="flex gap-3">
          <Link
            href="/mypage/plan-change"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            プランを変更する
          </Link>
          <Link
            href="/mypage/settings"
            className="rounded-md bg-slate-700 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors"
          >
            設定を変更する
          </Link>
        </div>
      </div>
    </div>
  )
}
