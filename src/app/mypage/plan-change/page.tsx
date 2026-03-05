/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan-change/page
 *
 * ahamoプランの変更を行うページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { PlanChangeForm } from '@/components/mypage'

/**
 * プラン変更ページコンポーネント
 *
 * @returns プラン変更ページ要素
 */
export default function PlanChangePage(): React.ReactElement {
  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">プラン変更</h1>
      </div>

      <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
        <PlanChangeForm />
      </div>
    </div>
  )
}
