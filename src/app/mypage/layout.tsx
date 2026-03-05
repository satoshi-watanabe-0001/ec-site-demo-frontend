/**
 * @fileoverview マイページレイアウト（認証ガード付き）
 * @module app/mypage/layout
 *
 * 認証状態をチェックし、未認証の場合はログインページへリダイレクト。
 * マイページ配下のすべてのルートに適用される。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

/**
 * マイページレイアウトコンポーネント
 *
 * @param props - レイアウトのProps
 * @returns レイアウト要素（認証済みの場合は子要素、未認証の場合はリダイレクト）
 */
export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  // Zustandのhydration完了前はローディング表示
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
      </div>
    )
  }

  // 未認証の場合はリダイレクト中（nullを返す）
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  )
}
