/**
 * @fileoverview マイページ共通レイアウト
 * @module app/mypage/layout
 *
 * マイページ配下の全ルートに適用される認証ガード。
 * 未認証ユーザーを/loginにリダイレクトする。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  Smartphone,
  ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

/**
 * マイページナビゲーション項目
 */
const navigationItems = [
  { href: '/mypage', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/mypage/contract', label: '契約内容', icon: FileText },
  { href: '/mypage/data-usage', label: 'データ使用量', icon: BarChart3 },
  { href: '/mypage/billing', label: '請求・支払い', icon: CreditCard },
  { href: '/mypage/settings', label: 'アカウント設定', icon: Settings },
  { href: '/mypage/plan', label: 'プラン変更', icon: Smartphone },
  { href: '/mypage/options', label: 'オプション管理', icon: Smartphone },
]

/**
 * マイページレイアウトコンポーネント
 *
 * 認証ガードとサイドナビゲーションを提供。
 * 未認証時は/loginにリダイレクトする。
 *
 * @param props - レイアウトのプロパティ
 * @returns マイページレイアウト要素
 */
export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isClient, isAuthenticated, router])

  // サーバーサイドレンダリング時とクライアント初期化前は何も表示しない
  if (!isClient || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドナビゲーション */}
          <aside className="lg:w-64 flex-shrink-0" aria-label="マイページナビゲーション">
            <nav className="bg-slate-800 rounded-lg p-4 lg:sticky lg:top-24">
              <div className="mb-4 pb-4 border-b border-slate-700">
                <Link
                  href="/"
                  className="flex items-center text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  トップページに戻る
                </Link>
              </div>
              <ul className="space-y-1">
                {navigationItems.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0" role="main">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
