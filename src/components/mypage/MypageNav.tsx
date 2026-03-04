/**
 * @fileoverview マイページ内ナビゲーションコンポーネント
 * @module components/mypage/MypageNav
 *
 * マイページ内の各セクションへのナビゲーションリンクを提供。
 * モバイルでは折りたたみハンバーガーメニュー、デスクトップではサイドバー表示。
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  ArrowLeftRight,
  Package,
  Menu,
  X,
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
  icon: React.ReactNode
}

/**
 * ナビゲーション項目一覧
 */
const navItems: NavItem[] = [
  { href: '/mypage', label: 'ダッシュボード', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/mypage/contract', label: '契約情報', icon: <FileText className="h-4 w-4" /> },
  { href: '/mypage/data-usage', label: 'データ使用量', icon: <BarChart3 className="h-4 w-4" /> },
  { href: '/mypage/billing', label: '請求・支払い', icon: <CreditCard className="h-4 w-4" /> },
  {
    href: '/mypage/plan-change',
    label: 'プラン変更',
    icon: <ArrowLeftRight className="h-4 w-4" />,
  },
  { href: '/mypage/options', label: 'オプション管理', icon: <Package className="h-4 w-4" /> },
  { href: '/mypage/settings', label: 'アカウント設定', icon: <Settings className="h-4 w-4" /> },
]

/**
 * マイページ内ナビゲーションコンポーネント
 */
export function MypageNav(): React.ReactElement {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string): boolean => {
    if (href === '/mypage') return pathname === '/mypage'
    return pathname.startsWith(href)
  }

  return (
    <nav aria-label="マイページナビゲーション">
      {/* モバイル: ハンバーガーメニュー */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
          aria-expanded={isOpen}
          aria-label="メニューを開く"
        >
          <span className="text-sm font-medium">
            {navItems.find(item => isActive(item.href))?.label || 'メニュー'}
          </span>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        {isOpen && (
          <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800 py-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* デスクトップ: サイドバー */}
      <div className="hidden lg:block">
        <div className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
