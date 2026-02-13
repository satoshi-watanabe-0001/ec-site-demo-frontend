/**
 * @fileoverview 請求・支払い情報ページ（Phase 2で実装予定）
 * @module app/mypage/billing/page
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

export default function BillingPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/mypage" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← マイページに戻る
        </Link>
        <h1 className="mb-4 text-2xl font-bold text-white">請求・支払い情報</h1>
        <div className="rounded-xl bg-slate-800 p-8 text-center shadow-lg">
          <p className="text-slate-400">このページはPhase 2で実装予定です。</p>
        </div>
      </div>
    </div>
  )
}
