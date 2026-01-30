/**
 * @fileoverview アカウント情報状態管理ストア
 * @module store/accountStore
 *
 * Zustandを使用したアカウント情報の管理。
 * プロファイル情報、通知設定を管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccountProfile, NotificationSettings } from '@/types'

/**
 * アカウントストアの状態型定義
 */
interface AccountState {
  /** アカウントプロファイル情報 */
  profile: AccountProfile | null
  /** 通知設定 */
  notificationSettings: NotificationSettings | null
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * プロファイル情報を設定
   * @param profile - アカウントプロファイル
   */
  setProfile: (profile: AccountProfile) => void

  /**
   * 通知設定を設定
   * @param settings - 通知設定
   */
  setNotificationSettings: (settings: NotificationSettings) => void

  /**
   * 読み込み状態を設定
   * @param loading - 読み込み中かどうか
   */
  setLoading: (loading: boolean) => void

  /**
   * エラーを設定
   * @param error - エラーメッセージ
   */
  setError: (error: string | null) => void

  /**
   * ストアをリセット
   */
  reset: () => void
}

/**
 * アカウント情報状態管理ストア
 *
 * アカウントプロファイル、通知設定を管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useAccountStore = create<AccountState>()(
  persist(
    set => ({
      profile: null,
      notificationSettings: null,
      isLoading: false,
      error: null,

      setProfile: (profile: AccountProfile) => {
        set({ profile, error: null })
      },

      setNotificationSettings: (settings: NotificationSettings) => {
        set({ notificationSettings: settings, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          profile: null,
          notificationSettings: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'account-storage',
    }
  )
)
