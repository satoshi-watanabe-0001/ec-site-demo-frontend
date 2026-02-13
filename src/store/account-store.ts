/**
 * @fileoverview アカウント状態管理ストア
 * @module store/account-store
 *
 * Zustandを使用したアカウント情報の状態管理。
 * ダッシュボードデータ・契約情報を管理する。
 */

import { create } from 'zustand'
import type { DashboardData } from '@/types'
import { getDashboardData } from '@/services/accountService'

interface AccountState {
  dashboardData: DashboardData | null
  isLoading: boolean
  error: string | null

  fetchDashboardData: (userId: string) => Promise<void>
  clearAccountData: () => void
}

export const useAccountStore = create<AccountState>()(set => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await getDashboardData(userId)
      set({ dashboardData: data, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'データの取得に失敗しました。'
      set({ error: message, isLoading: false })
    }
  },

  clearAccountData: () => {
    set({ dashboardData: null, isLoading: false, error: null })
  },
}))
