'use client'

/**
 * @fileoverview 契約者情報コンポーネント
 * @module components/mypage/contract/ContractorInfo
 *
 * 契約者の詳細情報を表示するコンポーネント。
 */

import type { ContractDetails } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 契約者情報コンポーネントのProps
 */
interface ContractorInfoProps {
  /** 契約詳細情報 */
  details: ContractDetails | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 追加のクラス名 */
  className?: string
}

/**
 * 契約者情報コンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 契約者情報表示
 */
export function ContractorInfo({ details, isLoading, className }: ContractorInfoProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-3/4 rounded bg-slate-700" />
            <div className="h-4 w-1/2 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">契約者情報</h3>
        <p className="text-slate-400">契約者情報を取得できませんでした</p>
      </div>
    )
  }

  const { contractor } = details

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <h3 className="mb-6 text-lg font-semibold text-white">契約者情報</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">お名前</p>
            <p className="mt-1 font-medium text-white">{contractor.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">フリガナ</p>
            <p className="mt-1 font-medium text-white">{contractor.nameKana}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-400">生年月日</p>
          <p className="mt-1 font-medium text-white">{contractor.dateOfBirth}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">ご住所</p>
          <p className="mt-1 font-medium text-white">
            〒{contractor.postalCode}
            <br />
            {contractor.address}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">メールアドレス</p>
            <p className="mt-1 font-medium text-white">{contractor.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">連絡先電話番号</p>
            <p className="mt-1 font-medium text-white">{contractor.contactPhone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
