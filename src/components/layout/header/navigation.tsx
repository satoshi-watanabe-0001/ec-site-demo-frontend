/**
 * @fileoverview ナビゲーションメニューコンポーネント
 * @module components/layout/header/navigation
 *
 * ヘッダー内のナビゲーションメニュー。
 * アクティブページのハイライト表示とアクセシビリティ対応。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { useActivePath } from '@/hooks/use-active-path'
import { cn } from '@/lib/utils'

/**
 * ナビゲーション項目の型定義
 */
export interface NavItem {
  /** 表示ラベル */
  label: string
  /** リンク先URL */
  href: string
}

/**
 * ナビゲーションコンポーネントのProps型定義
 */
interface NavigationProps {
  /** ナビゲーション項目の配列 */
  items: NavItem[]
  /** 追加のCSSクラス */
  className?: string
  /** モバイル表示かどうか */
  isMobile?: boolean
  /** メニュークリック時のコールバック（モバイル用） */
  onItemClick?: () => void
}

/**
 * ナビゲーションリンクコンポーネント
 *
 * 個別のナビゲーションリンクを表示し、アクティブ状態を管理する。
 */
function NavLink({
  item,
  isMobile,
  onItemClick,
}: {
  item: NavItem
  isMobile: boolean
  onItemClick?: () => void
}): React.ReactElement {
  const isActive = useActivePath(item.href)

  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className={cn(
        'transition-colors duration-200 font-medium',
        isMobile ? 'py-2 px-4 rounded-lg hover:bg-slate-700 block' : 'hover:text-white',
        isActive ? 'text-white' : 'text-gray-300'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </Link>
  )
}

/**
 * ナビゲーションメニューコンポーネント
 *
 * デスクトップとモバイルの両方に対応したナビゲーションメニュー。
 * アクティブページのハイライト表示とWCAG準拠のアクセシビリティを提供。
 *
 * @param props - ナビゲーションのプロパティ
 * @returns ナビゲーションメニュー要素
 */
export function Navigation({
  items,
  className,
  isMobile = false,
  onItemClick,
}: NavigationProps): React.ReactElement {
  return (
    <nav
      className={cn(
        isMobile ? 'flex flex-col space-y-3' : 'hidden md:flex items-center space-x-6',
        className
      )}
      aria-label="メインナビゲーション"
    >
      {items.map(item => (
        <NavLink key={item.href} item={item} isMobile={isMobile} onItemClick={onItemClick} />
      ))}
    </nav>
  )
}

/**
 * デフォルトのナビゲーション項目
 *
 * EC-266チケットで指定されたナビゲーション項目。
 */
export const defaultNavItems: NavItem[] = [
  { label: 'ホーム', href: '/' },
  { label: '申し込みの流れ', href: '/signup-flow' },
  { label: '料金/データ量', href: '/pricing' },
  { label: '製品', href: '/products' },
  { label: 'サポート', href: '/support' },
]
