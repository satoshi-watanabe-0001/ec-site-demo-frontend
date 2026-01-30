'use client'

/**
 * @fileoverview マイページレイアウト
 * @module app/mypage/layout
 *
 * EC-278: アカウント管理機能
 *
 * マイページ共通レイアウト。サイドナビゲーションとメインコンテンツエリアを提供。
 * 認証チェックを行い、未認証の場合はログインページにリダイレクト。
 */

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

/**
 * ナビゲーションアイテムの型定義
 */
interface NavItem {
  href: string
  label: string
  icon: string
}

/**
 * サイドナビゲーションアイテム
 */
const navItems: NavItem[] = [
  { href: '/mypage', label: 'ダッシュボード', icon: '🏠' },
  { href: '/mypage/contract', label: '契約情報', icon: '📋' },
  { href: '/mypage/data-usage', label: 'データ使用量', icon: '📊' },
  { href: '/mypage/billing', label: '請求・支払い', icon: '💰' },
  { href: '/mypage/plan-change', label: 'プラン変更', icon: '🔄' },
  { href: '/mypage/options', label: 'オプション', icon: '⚙️' },
  { href: '/mypage/settings', label: 'アカウント設定', icon: '👤' },
]

/**
 * マイページレイアウトコンポーネント
 *
 * @param props - レイアウトのプロパティ
 * @returns マイページレイアウト要素
 */
export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-slate-400">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* サイドナビゲーション */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <nav className="rounded-lg bg-slate-800 p-4">
              <h2 className="mb-4 text-lg font-semibold text-white">マイページ</h2>
              <ul className="space-y-1">
                {navItems.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        )}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
