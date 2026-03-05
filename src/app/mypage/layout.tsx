'use client'

/**
 * @fileoverview マイページ保護レイアウト
 * @module app/mypage/layout
 *
 * マイページ配下の全ページに適用されるレイアウト。
 * 認証ガードを実装し、未認証ユーザーをログインページにリダイレクトする。
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

/**
 * マイページナビゲーションリンク定義
 */
const mypageNavLinks = [
  { href: '/mypage', label: 'ダッシュボード' },
  { href: '/mypage/contract', label: '契約情報' },
  { href: '/mypage/data-usage', label: 'データ使用量' },
  { href: '/mypage/billing', label: '請求・お支払い' },
  { href: '/mypage/settings', label: 'アカウント設定' },
  { href: '/mypage/plan-change', label: 'プラン変更' },
  { href: '/mypage/options', label: 'オプション管理' },
]

/**
 * マイページ保護レイアウト
 *
 * - 認証状態をチェックし、未認証の場合は /login にリダイレクト
 * - サイドナビゲーションを提供
 * - モバイルではハンバーガーメニュー風のナビゲーション
 *
 * @param props - children を受け取る
 */
export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Zustand永続化のhydrationを待つ
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // 未認証時はログインページにリダイレクト
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  // hydration前またはリダイレクト中はローディング表示
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
        {/* モバイルナビゲーショントグル */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-between rounded-lg bg-slate-800 px-4 py-3 text-left lg:hidden"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-controls="mypage-nav"
        >
          <span className="text-sm font-medium">メニュー</span>
          <svg
            className={`h-5 w-5 transition-transform ${isNavOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* サイドナビゲーション */}
        <nav
          id="mypage-nav"
          className={`${isNavOpen ? 'block' : 'hidden'} mb-6 lg:mb-0 lg:block`}
          aria-label="マイページメニュー"
        >
          <div className="rounded-lg bg-slate-800 p-4">
            <h2 className="mb-4 text-lg font-bold text-white">マイページ</h2>
            <ul className="space-y-1">
              {mypageNavLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                    onClick={() => setIsNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* メインコンテンツ */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
