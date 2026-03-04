/**
 * @fileoverview マイページレイアウト
 * @module app/mypage/layout
 *
 * マイページ共通レイアウト。
 * 認証ガード機能を提供し、未認証ユーザーをログインページにリダイレクトする。
 * サイドバーナビゲーションとメインコンテンツエリアを提供。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { MypageNav } from '@/components/mypage'

/**
 * マイページレイアウトコンポーネント
 *
 * 認証済みユーザーのみアクセス可能。
 * 未認証の場合は /login へリダイレクト。
 */
export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setIsReady(false)
      router.push('/login')
    } else {
      setIsReady(true)
    }
  }, [isAuthenticated, router])

  // 認証チェック中は読み込み表示
  if (!isReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-white">マイページ</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* サイドバーナビゲーション */}
        <aside className="w-full lg:w-64 lg:shrink-0">
          <MypageNav />
        </aside>
        {/* メインコンテンツ */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
