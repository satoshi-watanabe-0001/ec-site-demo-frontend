'use client'

/**
 * @fileoverview ダッシュボードサマリーコンポーネント
 * @module components/account/DashboardSummary
 *
 * ユーザー名、現在のプラン、月額料金をカード形式で表示する。
 */

/**
 * DashboardSummaryのProps
 */
interface DashboardSummaryProps {
  /** ユーザー名 */
  userName: string
  /** 現在のプラン名 */
  currentPlan: string
  /** 月額料金（税込） */
  monthlyCharge: number
}

/**
 * ダッシュボードサマリーコンポーネント
 *
 * ログインユーザーの基本情報をウェルカムカード形式で表示する。
 *
 * @param props - コンポーネントプロパティ
 */
export function DashboardSummary({ userName, currentPlan, monthlyCharge }: DashboardSummaryProps) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6">
      <p className="text-sm text-blue-200">ようこそ</p>
      <h2 className="mt-1 text-2xl font-bold text-white">{userName} さん</h2>
      <div className="mt-4 flex flex-wrap gap-6">
        <div>
          <p className="text-sm text-blue-200">ご契約プラン</p>
          <p className="mt-1 text-lg font-semibold text-white">{currentPlan}</p>
        </div>
        <div>
          <p className="text-sm text-blue-200">月額料金</p>
          <p className="mt-1 text-lg font-semibold text-white">
            ¥{monthlyCharge.toLocaleString()}
            <span className="text-sm font-normal text-blue-200">（税込）</span>
          </p>
        </div>
      </div>
    </div>
  )
}
