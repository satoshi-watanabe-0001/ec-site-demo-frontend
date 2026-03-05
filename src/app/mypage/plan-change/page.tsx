'use client'

/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan-change/page
 *
 * プラン変更を行うページ。
 * 利用可能なプランの一覧と変更手続きを提供する。
 */

import { PlanSelector } from '@/components/account/PlanSelector'

/**
 * プラン変更ページコンポーネント
 */
export default function PlanChangePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プラン変更</h1>
      <PlanSelector />
    </div>
  )
}
