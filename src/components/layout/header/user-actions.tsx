/**
 * @fileoverview ユーザーアクションボタンコンポーネント
 * @module components/layout/header/user-actions
 *
 * ヘッダー内のユーザーアクションボタン（新規登録、ログイン、マイページ）。
 * 認証状態に応じて表示を切り替える。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GradientButton } from '@/components/ui/gradient-button'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

/**
 * ユーザーアクションコンポーネントのProps型定義
 */
interface UserActionsProps {
  /** 追加のCSSクラス */
  className?: string
  /** モバイル表示かどうか */
  isMobile?: boolean
}

/**
 * ユーザーアクションボタンコンポーネント
 *
 * 認証状態に応じて以下を表示:
 * - 未認証時: 新規登録ボタン、ログインボタン
 * - 認証時: マイページボタン
 *
 * @param props - ユーザーアクションのプロパティ
 * @returns ユーザーアクションボタン要素
 */
export function UserActions({ className, isMobile = false }: UserActionsProps): React.ReactElement {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return (
      <div
        className={cn(
          'flex items-center',
          isMobile ? 'flex-col space-y-3' : 'space-x-3',
          className
        )}
      >
        <Link href="/mypage">
          <Button
            variant="outline"
            className={cn(
              'border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-300',
              isMobile ? 'w-full px-6 py-3' : 'px-6 py-2'
            )}
          >
            <User className="h-4 w-4 mr-2" />
            マイページ
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div
      className={cn('flex items-center', isMobile ? 'flex-col space-y-3' : 'space-x-3', className)}
    >
      <Link href="/signup">
        <GradientButton
          className={cn(
            'shadow-md hover:shadow-lg',
            isMobile ? 'w-full px-6 py-3' : 'hidden sm:flex px-6 py-2'
          )}
          size="sm"
        >
          新規登録
        </GradientButton>
      </Link>
      <Link href="/login">
        <Button
          variant="outline"
          className={cn(
            'border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-300',
            isMobile ? 'w-full px-6 py-3' : 'hidden sm:flex px-6 py-2'
          )}
        >
          ログイン
        </Button>
      </Link>
    </div>
  )
}
