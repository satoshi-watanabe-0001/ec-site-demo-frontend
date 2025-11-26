/**
 * @fileoverview 認証状態管理ストア
 * @module store/auth-store
 *
 * Zustandを使用した認証状態の管理。
 * ログイン/ログアウト状態、ユーザー情報を管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * ユーザー情報の型定義
 */
export interface User {
  /** ユーザーID */
  id: string
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
}

/**
 * 認証ストアの状態型定義
 */
interface AuthState {
  /** 現在のユーザー情報（未認証時はnull） */
  user: User | null
  /** 認証済みかどうか */
  isAuthenticated: boolean
  /** 読み込み中かどうか */
  isLoading: boolean

  /**
   * ログイン処理
   * @param user - ログインするユーザー情報
   */
  login: (user: User) => void

  /**
   * ログアウト処理
   */
  logout: () => void

  /**
   * 読み込み状態を設定
   * @param loading - 読み込み中かどうか
   */
  setLoading: (loading: boolean) => void
}

/**
 * 認証状態管理ストア
 *
 * ユーザーの認証状態を管理し、ログイン/ログアウト機能を提供する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
