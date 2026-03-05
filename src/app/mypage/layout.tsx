/**
 * @fileoverview マイページレイアウト
 * @module app/mypage/layout
 *
 * マイページの共通レイアウト。
 * 認証ガード機能とサイドバーナビゲーションを提供。
 * 未認証ユーザーはログインページにリダイレクトされる。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { MypageSidebar } from '@/components/layout/mypage'

/**
 * マイページレイアウトコンポーネント
 *
 * 認証状態をチェックし、未認証の場合はログインページへリダイレクト。
 * 認証済みの場合はサイドバー付きレイアウトを表示。
 *
 * @param props - レイアウトのProps
 * @returns マイページレイアウト要素
 */
export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, router])

  // 認証チェック中は何も表示しない
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <MypageSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
