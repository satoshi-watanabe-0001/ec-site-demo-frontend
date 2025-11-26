/**
 * @fileoverview ヘッダーナビゲーションコンポーネント
 * @module components/layout/header/header
 *
 * ahamoサイトのメインヘッダーコンポーネント。
 * ロゴ、ナビゲーション、検索、ユーザーアクションを含む。
 * レスポンシブデザインとアクセシビリティ対応。
 */

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GradientButton } from '@/components/ui/gradient-button'
import { Navigation, defaultNavItems } from './navigation'
import { SearchBar } from './search-bar'
import { UserActions } from './user-actions'
import { cn } from '@/lib/utils'

/**
 * ヘッダーコンポーネントのProps型定義
 */
interface HeaderProps {
  /** 追加のCSSクラス */
  className?: string
}

/**
 * ヘッダーナビゲーションコンポーネント
 *
 * ahamoサイトのメインヘッダー。以下の機能を提供:
 * - ahamoロゴ（ホームリンク）
 * - 5つのナビゲーション項目
 * - 検索機能
 * - 新規登録/ログインボタン（認証時はマイページ）
 * - レスポンシブハンバーガーメニュー
 * - 固定ヘッダー（sticky）
 *
 * @param props - ヘッダーのプロパティ
 * @returns ヘッダー要素
 */
export function Header({ className }: HeaderProps): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  /**
   * メニューの開閉を切り替える
   */
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  /**
   * メニューを閉じる
   */
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  /**
   * 検索実行時の処理
   * @param query - 検索クエリ
   */
  const handleSearch = useCallback((query: string) => {
    // 検索APIへの接続は後で実装
    // 現時点ではコンソールに出力
    console.log('検索クエリ:', query)
  }, [])

  // メニューが開いている時はスクロールを無効化
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Escapeキーでメニューを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen, closeMenu])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* ロゴとナビゲーション */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <GradientButton
                className="text-xl sm:text-2xl font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-105"
                size="sm"
              >
                ahamo
              </GradientButton>
            </Link>
            <Navigation items={defaultNavItems} />
          </div>

          {/* 検索とユーザーアクション */}
          <div className="flex items-center space-x-3">
            <SearchBar onSearch={handleSearch} className="hidden sm:flex" />
            <UserActions />

            {/* ハンバーガーメニューボタン */}
            <Button
              variant="ghost"
              onClick={toggleMenu}
              className="md:hidden text-slate-300 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-all duration-300"
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'opacity-0' : 'mb-1'
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* モバイルメニューオーバーレイ */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-slate-800 border-t border-slate-700 shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-label="モバイルメニュー"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              {/* モバイル用検索バー */}
              <div className="pb-4 border-b border-slate-600">
                <SearchBar onSearch={handleSearch} className="w-full" />
              </div>

              {/* モバイル用ユーザーアクション */}
              <div className="pb-4 border-b border-slate-600">
                <UserActions isMobile />
              </div>

              {/* モバイル用ナビゲーション */}
              <Navigation items={defaultNavItems} isMobile onItemClick={closeMenu} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
