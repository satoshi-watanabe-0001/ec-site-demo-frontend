/**
 * @fileoverview アカウント状態管理ストア
 * @module store/account-store
 *
 * Zustandを使用したアカウント情報の状態管理。
 * マイページで使用するデータを一元管理する。
 */

import { create } from 'zustand'
import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  OptionService,
  AvailablePlan,
} from '@/types'

/**
 * アカウントストアの状態型定義
 */
interface AccountState {
  /** ダッシュボードデータ */
  dashboard: DashboardData | null
  /** 契約情報 */
  contract: ContractInfo | null
  /** データ使用量 */
  dataUsage: DataUsage | null
  /** 請求情報 */
  billing: BillingInfo | null
  /** オプション一覧 */
  options: OptionService[]
  /** 利用可能プラン */
  plans: AvailablePlan[]
  /** 読み込み中かどうか */
  isLoading: boolean
  /** エラーメッセージ */
  error: string | null

  /** ダッシュボードデータを設定 */
  setDashboard: (data: DashboardData) => void
  /** 契約情報を設定 */
  setContract: (data: ContractInfo) => void
  /** データ使用量を設定 */
  setDataUsage: (data: DataUsage) => void
  /** 請求情報を設定 */
  setBilling: (data: BillingInfo) => void
  /** オプション一覧を設定 */
  setOptions: (data: OptionService[]) => void
  /** 利用可能プランを設定 */
  setPlans: (data: AvailablePlan[]) => void
  /** 読み込み状態を設定 */
  setLoading: (loading: boolean) => void
  /** エラーを設定 */
  setError: (error: string | null) => void
  /** ストアをリセット */
  reset: () => void
}

/**
 * 初期状態
 */
const initialState = {
  dashboard: null,
  contract: null,
  dataUsage: null,
  billing: null,
  options: [] as OptionService[],
  plans: [] as AvailablePlan[],
  isLoading: false,
  error: null,
}

/**
 * アカウント状態管理ストア
 *
 * マイページで使用する各種データを管理し、
 * ページ間でのデータ共有を提供する。
 */
export const useAccountStore = create<AccountState>()(set => ({
  ...initialState,

  setDashboard: (data: DashboardData) => {
    set({ dashboard: data, error: null })
  },

  setContract: (data: ContractInfo) => {
    set({ contract: data, error: null })
  },

  setDataUsage: (data: DataUsage) => {
    set({ dataUsage: data, error: null })
  },

  setBilling: (data: BillingInfo) => {
    set({ billing: data, error: null })
  },

  setOptions: (data: OptionService[]) => {
    set({ options: data, error: null })
  },

  setPlans: (data: AvailablePlan[]) => {
    set({ plans: data, error: null })
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  reset: () => {
    set(initialState)
  },
}))
