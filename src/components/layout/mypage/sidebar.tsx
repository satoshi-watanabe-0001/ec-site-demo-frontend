/**
 * @fileoverview マイページサイドバーナビゲーション
 * @module components/layout/mypage/sidebar
 *
 * マイページ内のナビゲーションを提供するサイドバーコンポーネント。
 * デスクトップではサイドバー、モバイルでは横スクロールタブとして表示。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  ArrowRightLeft,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * ナビゲーション項目の型定義
 */
interface NavItem {
  /** パス */
  href: string
  /** ラベル */
  label: string
  /** アイコン */
  icon: React.ElementType
}

/**
 * マイページナビゲーション項目
 */
const navItems: NavItem[] = [
  { href: '/mypage', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/mypage/contract', label: '契約情報', icon: FileText },
  { href: '/mypage/data-usage', label: 'データ使用量', icon: BarChart3 },
  { href: '/mypage/billing', label: '請求・支払い', icon: CreditCard },
  { href: '/mypage/settings', label: 'アカウント設定', icon: Settings },
  { href: '/mypage/plan', label: 'プラン変更', icon: ArrowRightLeft },
  { href: '/mypage/options', label: 'オプション管理', icon: Package },
]

/**
 * サイドバーナビゲーションコンポーネント
 *
 * @returns サイドバー要素
 */
export function MypageSidebar(): React.ReactElement {
  const pathname = usePathname()

  return (
    <>
      {/* デスクトップサイドバー */}
      <nav
        className="hidden lg:block w-64 flex-shrink-0"
        aria-label="マイページナビゲーション"
      >
        <div className="sticky top-24 bg-slate-800 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 px-3">マイページ</h2>
          <ul className="space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* モバイル・タブレット用横スクロールタブ */}
      <nav
        className="lg:hidden mb-6 -mx-4 px-4"
        aria-label="マイページナビゲーション"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex gap-2 min-w-max pb-2">
            {navItems.map(item => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
