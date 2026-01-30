/**
 * @fileoverview プラン情報状態管理ストア
 * @module store/planStore
 *
 * Zustandを使用したプラン情報の管理。
 * 現在のプラン、利用可能プランを管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan } from '@/types'

/**
 * プランストアの状態型定義
 */
interface PlanState {
  /** 現在のプラン */
  currentPlan: Plan | null
  /** 利用可能なプラン一覧 */
  availablePlans: Plan[]
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * 現在のプランを設定
   * @param plan - 現在のプラン
   */
  setCurrentPlan: (plan: Plan) => void

  /**
   * 利用可能プラン一覧を設定
   * @param plans - 利用可能プラン一覧
   */
  setAvailablePlans: (plans: Plan[]) => void

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
 * プラン情報状態管理ストア
 *
 * 現在のプラン、利用可能プランを管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const usePlanStore = create<PlanState>()(
  persist(
    set => ({
      currentPlan: null,
      availablePlans: [],
      isLoading: false,
      error: null,

      setCurrentPlan: (plan: Plan) => {
        set({ currentPlan: plan, error: null })
      },

      setAvailablePlans: (plans: Plan[]) => {
        set({ availablePlans: plans, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          currentPlan: null,
          availablePlans: [],
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'plan-storage',
    }
  )
)
