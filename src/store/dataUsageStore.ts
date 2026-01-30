/**
 * @fileoverview データ使用量状態管理ストア
 * @module store/dataUsageStore
 *
 * Zustandを使用したデータ使用量の管理。
 * 現在のデータ使用量、使用履歴を管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrentDataUsage, DailyDataUsage, MonthlyDataUsage } from '@/types'

/**
 * データ使用量ストアの状態型定義
 */
interface DataUsageState {
  /** 現在のデータ使用量 */
  currentUsage: CurrentDataUsage | null
  /** 日別使用量 */
  dailyUsage: DailyDataUsage[]
  /** 月別使用量 */
  monthlyUsage: MonthlyDataUsage[]
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * 現在のデータ使用量を設定
   * @param usage - 現在のデータ使用量
   */
  setCurrentUsage: (usage: CurrentDataUsage) => void

  /**
   * 日別使用量を設定
   * @param usage - 日別使用量
   */
  setDailyUsage: (usage: DailyDataUsage[]) => void

  /**
   * 月別使用量を設定
   * @param usage - 月別使用量
   */
  setMonthlyUsage: (usage: MonthlyDataUsage[]) => void

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
 * データ使用量状態管理ストア
 *
 * 現在のデータ使用量、使用履歴を管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useDataUsageStore = create<DataUsageState>()(
  persist(
    set => ({
      currentUsage: null,
      dailyUsage: [],
      monthlyUsage: [],
      isLoading: false,
      error: null,

      setCurrentUsage: (usage: CurrentDataUsage) => {
        set({ currentUsage: usage, error: null })
      },

      setDailyUsage: (usage: DailyDataUsage[]) => {
        set({ dailyUsage: usage, error: null })
      },

      setMonthlyUsage: (usage: MonthlyDataUsage[]) => {
        set({ monthlyUsage: usage, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          currentUsage: null,
          dailyUsage: [],
          monthlyUsage: [],
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'data-usage-storage',
    }
  )
)
