/**
 * @fileoverview 過去ログインアカウント一覧コンポーネント
 * @module components/auth/RecentAccountsList
 *
 * 過去にログインしたアカウントを一覧表示し、
 * 選択するとメールアドレスを自動入力する機能を提供。
 */

'use client'

import React from 'react'
import { User, X } from 'lucide-react'
import { useRecentAccountsStore, RecentAccount } from '@/store/recent-accounts-store'

/**
 * 過去ログインアカウント一覧コンポーネントのProps
 */
interface RecentAccountsListProps {
  /** アカウント選択時のコールバック */
  onSelectAccount: (email: string) => void
}

/**
 * 日付をフォーマットする
 * @param dateString - ISO形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
function formatLastLogin(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return '今日'
  } else if (diffDays === 1) {
    return '昨日'
  } else if (diffDays < 7) {
    return `${diffDays}日前`
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    })
  }
}

/**
 * 過去ログインアカウント一覧コンポーネント
 *
 * @param props - コンポーネントのProps
 * @returns 過去ログインアカウント一覧要素
 */
export function RecentAccountsList({
  onSelectAccount,
}: RecentAccountsListProps): React.ReactElement | null {
  const { accounts, removeAccount } = useRecentAccountsStore()

  if (accounts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">過去にログインしたアカウント</h3>
      <div className="space-y-2">
        {accounts.map((account: RecentAccount) => (
          <div
            key={account.email}
            className="group relative bg-slate-700/50 hover:bg-slate-700 rounded-lg p-3 cursor-pointer transition-colors"
            onClick={() => onSelectAccount(account.email)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectAccount(account.email)
              }
            }}
            aria-label={`${account.email}でログイン`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{account.displayName}</p>
                <p className="text-xs text-slate-400 truncate">{account.email}</p>
              </div>
              <div className="text-xs text-slate-500">{formatLastLogin(account.lastLoginAt)}</div>
            </div>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                removeAccount(account.email)
              }}
              className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-600 transition-opacity"
              aria-label={`${account.email}を履歴から削除`}
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
