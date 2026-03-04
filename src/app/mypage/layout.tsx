/**
 * @fileoverview マイページレイアウト（認証ガード付き）
 * @module app/mypage/layout
 *
 * マイページ配下の全ページに適用される共通レイアウト。
 * 未認証ユーザーをログインページにリダイレクトする。
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  ArrowLeftRight,
  Package,
  LogOut,
} from 'lucide-react'

/**
 * サイドナビゲーションのメニュー項目
 */
const menuItems = [
  { href: '/mypage', label: 'ダッシュボード', icon: LayoutDashboard, exact: true },
  { href: '/mypage/contract', label: '契約情報', icon: FileText, exact: false },
  { href: '/mypage/data-usage', label: 'データ使用量', icon: BarChart3, exact: false },
  { href: '/mypage/billing', label: '請求・支払い', icon: CreditCard, exact: false },
  { href: '/mypage/plan', label: 'プラン変更', icon: ArrowLeftRight, exact: false },
  { href: '/mypage/options', label: 'オプション管理', icon: Package, exact: false },
  { href: '/mypage/settings', label: '設定', icon: Settings, exact: false },
]

/**
 * マイページレイアウトコンポーネント
 *
 * 認証ガード機能とサイドナビゲーションを提供する。
 * 未認証時はログインページへリダイレクトされる。
 *
 * @param props - 子要素を含むprops
 * @returns マイページレイアウト要素
 */
export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 認証チェック：未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // 未認証の場合はローディングを表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">認証を確認中...</div>
      </div>
    )
  }

  /**
   * ログアウト処理
   */
  const handleLogout = (): void => {
    logout()
    router.push('/login')
  }

  /**
   * メニュー項目がアクティブかどうかを判定
   */
  const isActive = (href: string, exact: boolean): boolean => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ユーザー情報バー */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">マイページ</h1>
            <p className="text-slate-400 text-sm mt-1">
              {user?.name}さん（{user?.email}）
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* モバイル用メニュートグル */}
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="メニューを開く"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* サイドナビゲーション */}
          <nav
            className={cn(
              'lg:w-64 lg:flex-shrink-0',
              isMobileMenuOpen ? 'block' : 'hidden lg:block'
            )}
            aria-label="マイページナビゲーション"
          >
            <div className="bg-slate-800 rounded-lg p-4 space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon
                const active = isActive(item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}

              {/* ログアウトボタン */}
              <div className="pt-4 border-t border-slate-700 mt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors w-full"
                  aria-label="ログアウト"
                >
                  <LogOut className="h-5 w-5" />
                  ログアウト
                </button>
              </div>
            </div>
          </nav>

          {/* メインコンテンツ */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
