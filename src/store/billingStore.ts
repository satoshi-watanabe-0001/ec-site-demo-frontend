/**
 * @fileoverview 請求情報状態管理ストア
 * @module store/billingStore
 *
 * Zustandを使用した請求情報の管理。
 * 現在月の請求、請求履歴、支払い方法を管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrentBilling, BillingHistoryItem, PaymentMethod } from '@/types'

/**
 * 請求ストアの状態型定義
 */
interface BillingState {
  /** 現在月の請求情報 */
  currentBilling: CurrentBilling | null
  /** 請求履歴 */
  billingHistory: BillingHistoryItem[]
  /** 支払い方法 */
  paymentMethod: PaymentMethod | null
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * 現在月の請求情報を設定
   * @param billing - 現在月の請求情報
   */
  setCurrentBilling: (billing: CurrentBilling) => void

  /**
   * 請求履歴を設定
   * @param history - 請求履歴
   */
  setBillingHistory: (history: BillingHistoryItem[]) => void

  /**
   * 支払い方法を設定
   * @param method - 支払い方法
   */
  setPaymentMethod: (method: PaymentMethod) => void

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
 * 請求情報状態管理ストア
 *
 * 現在月の請求、請求履歴、支払い方法を管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useBillingStore = create<BillingState>()(
  persist(
    set => ({
      currentBilling: null,
      billingHistory: [],
      paymentMethod: null,
      isLoading: false,
      error: null,

      setCurrentBilling: (billing: CurrentBilling) => {
        set({ currentBilling: billing, error: null })
      },

      setBillingHistory: (history: BillingHistoryItem[]) => {
        set({ billingHistory: history, error: null })
      },

      setPaymentMethod: (method: PaymentMethod) => {
        set({ paymentMethod: method, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          currentBilling: null,
          billingHistory: [],
          paymentMethod: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'billing-storage',
    }
  )
)
