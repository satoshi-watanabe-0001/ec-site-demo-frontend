/**
 * @fileoverview アカウント管理API サービス
 * @module services/accountService
 *
 * マイページ関連のAPIサービス。
 * アカウント情報の取得・更新を行う。
 */

import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  OptionService,
  AvailablePlan,
  AccountApiResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  PlanChangeRequest,
} from '@/types'

/**
 * Account Service APIのベースURL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  UNAUTHORIZED: '認証が必要です。再度ログインしてください。',
} as const

/**
 * 認証トークンをlocalStorageから取得
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      if (parsed.state?.isAuthenticated) {
        return 'mock-token'
      }
    }
  } catch {
    // パースエラーは無視
  }
  return null
}

/**
 * 認証ヘッダー付きfetchリクエスト
 */
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()
  if (!token) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  return fetch(url, { ...options, headers })
}

/**
 * APIレスポンスを処理する共通関数
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message: string

    try {
      const errorData = await response.json()
      message = errorData?.message || ERROR_MESSAGES.SERVER_ERROR
    } catch {
      message =
        response.status >= 500 ? ERROR_MESSAGES.SERVER_ERROR : ERROR_MESSAGES.UNEXPECTED_ERROR
    }

    throw new Error(message)
  }

  const result: AccountApiResponse<T> = await response.json()
  return result.data as T
}

/**
 * ネットワークエラーかどうかを判定
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('cors') ||
      message.includes('timeout')
    )
  }
  return false
}

/**
 * APIリクエストのエラーハンドリングラッパー
 */
async function apiRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  try {
    return await requestFn()
  } catch (error) {
    if (error instanceof Error && !isNetworkError(error)) {
      throw error
    }
    if (isNetworkError(error)) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * ダッシュボード情報を取得
 */
export async function getDashboard(): Promise<DashboardData> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/dashboard`)
    return handleResponse<DashboardData>(response)
  })
}

/**
 * 契約情報を取得
 */
export async function getContract(): Promise<ContractInfo> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/contract`)
    return handleResponse<ContractInfo>(response)
  })
}

/**
 * データ使用量情報を取得
 */
export async function getDataUsage(): Promise<DataUsage> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/data-usage`)
    return handleResponse<DataUsage>(response)
  })
}

/**
 * 請求情報を取得
 */
export async function getBilling(): Promise<BillingInfo> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/billing`)
    return handleResponse<BillingInfo>(response)
  })
}

/**
 * プロフィールを更新
 */
export async function updateProfile(data: ProfileUpdateRequest): Promise<string> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/profile`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const result: AccountApiResponse = await response.json()
    if (!response.ok) {
      throw new Error(result.message || ERROR_MESSAGES.SERVER_ERROR)
    }
    return result.message || 'プロフィールを更新しました。'
  })
}

/**
 * パスワードを変更
 */
export async function changePassword(data: PasswordChangeRequest): Promise<string> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/password`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const result: AccountApiResponse = await response.json()
    if (!response.ok) {
      throw new Error(result.message || ERROR_MESSAGES.SERVER_ERROR)
    }
    return result.message || 'パスワードを変更しました。'
  })
}

/**
 * 利用可能プラン一覧を取得
 */
export async function getPlans(): Promise<AvailablePlan[]> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/plans`)
    return handleResponse<AvailablePlan[]>(response)
  })
}

/**
 * プランを変更
 */
export async function changePlan(data: PlanChangeRequest): Promise<string> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/plan`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result: AccountApiResponse = await response.json()
    if (!response.ok) {
      throw new Error(result.message || ERROR_MESSAGES.SERVER_ERROR)
    }
    return result.message || 'プラン変更を受け付けました。'
  })
}

/**
 * オプション一覧を取得
 */
export async function getOptions(): Promise<OptionService[]> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/account/options`)
    return handleResponse<OptionService[]>(response)
  })
}

/**
 * オプションを追加
 */
export async function subscribeOption(optionId: string): Promise<string> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/v1/account/options/${optionId}/subscribe`,
      { method: 'POST' }
    )
    const result: AccountApiResponse = await response.json()
    if (!response.ok) {
      throw new Error(result.message || ERROR_MESSAGES.SERVER_ERROR)
    }
    return result.message || 'オプションを追加しました。'
  })
}

/**
 * オプションを解除
 */
export async function unsubscribeOption(optionId: string): Promise<string> {
  return apiRequest(async () => {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/v1/account/options/${optionId}/unsubscribe`,
      { method: 'POST' }
    )
    const result: AccountApiResponse = await response.json()
    if (!response.ok) {
      throw new Error(result.message || ERROR_MESSAGES.SERVER_ERROR)
    }
    return result.message || 'オプションを解除しました。'
  })
}
