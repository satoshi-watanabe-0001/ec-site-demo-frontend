/**
 * @fileoverview オプションサービス状態管理ストア
 * @module store/optionStore
 *
 * Zustandを使用したオプションサービスの管理。
 * 契約中オプション、利用可能オプションを管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OptionService } from '@/types'

/**
 * オプションストアの状態型定義
 */
interface OptionState {
  /** 契約中のオプション */
  subscribedOptions: OptionService[]
  /** 利用可能なオプション */
  availableOptions: OptionService[]
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * 契約中オプションを設定
   * @param options - 契約中オプション
   */
  setSubscribedOptions: (options: OptionService[]) => void

  /**
   * 利用可能オプションを設定
   * @param options - 利用可能オプション
   */
  setAvailableOptions: (options: OptionService[]) => void

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
 * オプションサービス状態管理ストア
 *
 * 契約中オプション、利用可能オプションを管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useOptionStore = create<OptionState>()(
  persist(
    set => ({
      subscribedOptions: [],
      availableOptions: [],
      isLoading: false,
      error: null,

      setSubscribedOptions: (options: OptionService[]) => {
        set({ subscribedOptions: options, error: null })
      },

      setAvailableOptions: (options: OptionService[]) => {
        set({ availableOptions: options, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          subscribedOptions: [],
          availableOptions: [],
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'option-storage',
    }
  )
)
