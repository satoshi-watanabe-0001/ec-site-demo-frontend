/**
 * @fileoverview 契約情報状態管理ストア
 * @module store/contractStore
 *
 * Zustandを使用した契約情報の管理。
 * 契約サマリー、契約詳細、デバイス情報を管理する。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ContractSummary, ContractDetails, DeviceInfo } from '@/types'

/**
 * 契約ストアの状態型定義
 */
interface ContractState {
  /** 契約サマリー情報 */
  summary: ContractSummary | null
  /** 契約詳細情報 */
  details: ContractDetails | null
  /** デバイス情報 */
  deviceInfo: DeviceInfo | null
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /**
   * 契約サマリーを設定
   * @param summary - 契約サマリー
   */
  setSummary: (summary: ContractSummary) => void

  /**
   * 契約詳細を設定
   * @param details - 契約詳細
   */
  setDetails: (details: ContractDetails) => void

  /**
   * デバイス情報を設定
   * @param deviceInfo - デバイス情報
   */
  setDeviceInfo: (deviceInfo: DeviceInfo) => void

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
 * 契約情報状態管理ストア
 *
 * 契約サマリー、契約詳細、デバイス情報を管理する。
 * localStorageに永続化され、ページリロード後も状態が維持される。
 */
export const useContractStore = create<ContractState>()(
  persist(
    set => ({
      summary: null,
      details: null,
      deviceInfo: null,
      isLoading: false,
      error: null,

      setSummary: (summary: ContractSummary) => {
        set({ summary, error: null })
      },

      setDetails: (details: ContractDetails) => {
        set({ details, error: null })
      },

      setDeviceInfo: (deviceInfo: DeviceInfo) => {
        set({ deviceInfo, error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      reset: () => {
        set({
          summary: null,
          details: null,
          deviceInfo: null,
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'contract-storage',
    }
  )
)
