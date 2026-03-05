/**
 * @fileoverview マイページダッシュボード
 * @module app/mypage/page
 *
 * マイページのトップページ。契約情報サマリー、データ通信量、
 * 請求情報、端末情報、通知を表示する。
 */

'use client'

import React from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DashboardSummary } from '@/components/mypage'

/**
 * マイページダッシュボードコンポーネント
 *
 * @returns マイページダッシュボード要素
 */
export default function MypagePage(): React.ReactElement {
  const { user } = useAuthStore()

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">マイページ</h1>
        {user && (
          <p className="mt-1 text-slate-400">
            ようこそ、{user.name}さん
          </p>
        )}
      </div>

      {/* ダッシュボードサマリー */}
      <DashboardSummary />
    </div>
  )
}
