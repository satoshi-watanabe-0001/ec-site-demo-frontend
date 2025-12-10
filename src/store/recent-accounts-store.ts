/**
 * @fileoverview 過去ログインアカウント管理ストア
 * @module store/recent-accounts-store
 *
 * Zustandを使用した過去ログインアカウントの管理。
 * ログイン履歴を保存し、アカウント選択機能を提供する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 過去ログインアカウント情報の型定義
 */
export interface RecentAccount {
  /** メールアドレス */
  email: string
  /** 表示名（メールアドレスの@より前の部分） */
  displayName: string
  /** 最終ログイン日時 */
  lastLoginAt: string
}

/**
 * 開発環境用の初期アカウントデータ
 */
const INITIAL_ACCOUNTS: RecentAccount[] =
  process.env.NODE_ENV === 'development'
    ? [
        {
          email: 'test@docomo.ne.jp',
          displayName: 'test',
          lastLoginAt: '2024-12-09T10:30:00Z',
        },
        {
          email: 'demo@docomo.ne.jp',
          displayName: 'demo',
          lastLoginAt: '2024-12-08T15:45:00Z',
        },
      ]
    : []

/**
 * 過去ログインアカウントストアの状態型定義
 */
interface RecentAccountsState {
  /** 過去ログインアカウントのリスト */
  accounts: RecentAccount[]

  /**
   * アカウントを追加または更新
   * @param email - メールアドレス
   */
  addAccount: (email: string) => void

  /**
   * アカウントを削除
   * @param email - 削除するアカウントのメールアドレス
   */
  removeAccount: (email: string) => void

  /**
   * すべてのアカウントをクリア
   */
  clearAccounts: () => void
}

/**
 * 過去ログインアカウント管理ストア
 *
 * 過去にログインしたアカウント情報を管理し、
 * ログイン画面でのアカウント選択機能を提供する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useRecentAccountsStore = create<RecentAccountsState>()(
  persist(
    set => ({
      accounts: INITIAL_ACCOUNTS,

      addAccount: (email: string) => {
        const displayName = email.split('@')[0]
        const lastLoginAt = new Date().toISOString()
        const newAccount: RecentAccount = { email, displayName, lastLoginAt }

        set(state => {
          const filteredAccounts = state.accounts.filter(acc => acc.email !== email)
          const updatedAccounts = [newAccount, ...filteredAccounts].slice(0, 5)
          return { accounts: updatedAccounts }
        })
      },

      removeAccount: (email: string) => {
        set(state => ({
          accounts: state.accounts.filter(acc => acc.email !== email),
        }))
      },

      clearAccounts: () => {
        set({ accounts: [] })
      },
    }),
    {
      name: 'recent-accounts-storage',
    }
  )
)
