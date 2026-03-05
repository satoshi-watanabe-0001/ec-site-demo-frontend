/**
 * @fileoverview Account Service API クライアント
 * @module services/accountService
 *
 * マイページ関連のアカウントAPIサービス。
 * Account Service と通信し、ダッシュボード・契約・データ使用量・
 * 請求・オプション等の情報を取得・更新する。
 */

import type {
  AccountDashboardResponse,
  ContractInfoResponse,
  DataUsageResponse,
  BillingInfoResponse,
  AccountOptionsResponse,
  AccountApiResponse,
  PlanChangeResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  NotificationSettings,
  PlanChangeRequest,
  AddOptionRequest,
} from '@/types'

/**
 * Account Service APIのベースURL
 * クライアントサイドで使用するため、NEXT_PUBLIC_API_URLを直接参照
 */
const ACCOUNT_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNAUTHORIZED: '認証が切れました。再度ログインしてください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

/**
 * localStorageからアクセストークンを取得するヘルパー
 * auth-storageのpersistデータからtokenを取得する
 *
 * @returns Bearerトークン文字列またはnull
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    const parsed = JSON.parse(authStorage)
    // auth-storeにはtokenは保存されないため、
    // ログイン時にlocalStorageに別途保存されたtokenを取得
    return parsed?.state?.accessToken || localStorage.getItem('access-token')
  } catch {
    return null
  }
}

/**
 * 認証ヘッダー付きのfetchリクエストを実行する共通関数
 *
 * @param url - リクエストURL
 * @param options - fetchオプション
 * @returns レスポンスオブジェクト
 * @throws 認証エラー、ネットワークエラー時にエラーをスロー
 */
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
    }

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR)
      }
      // エラーレスポンスからメッセージを取得
      try {
        const errorData = await response.json()
        throw new Error(errorData.message || ERROR_MESSAGES.UNEXPECTED_ERROR)
      } catch (e) {
        if (e instanceof Error && Object.values(ERROR_MESSAGES).some(msg => e.message === msg)) {
          throw e
        }
        if (e instanceof Error && e.message && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
      }
    }

    return response
  } catch (error) {
    if (error instanceof Error) {
      // 既に処理済みのエラーはそのまま再スロー
      if (Object.values(ERROR_MESSAGES).some(msg => error.message === msg)) {
        throw error
      }
      // ネットワークエラー
      if (error instanceof TypeError || error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
      }
      throw error
    }
    throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * ダッシュボード情報を取得
 *
 * @returns ダッシュボードレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getAccountDashboard(): Promise<AccountDashboardResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/dashboard`)
  return response.json()
}

/**
 * 契約情報を取得
 *
 * @returns 契約情報レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getContractInfo(): Promise<ContractInfoResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/contract`)
  return response.json()
}

/**
 * データ使用量を取得
 *
 * @returns データ使用量レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getDataUsage(): Promise<DataUsageResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/data-usage`)
  return response.json()
}

/**
 * 請求情報を取得
 *
 * @returns 請求情報レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getBillingInfo(): Promise<BillingInfoResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/billing`)
  return response.json()
}

/**
 * オプションサービス情報を取得
 *
 * @returns オプションサービスレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getAccountOptions(): Promise<AccountOptionsResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options`)
  return response.json()
}

/**
 * プロフィールを更新
 *
 * @param data - 更新データ
 * @returns 更新結果
 * @throws APIエラー時にエラーをスロー
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<AccountApiResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/profile`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * パスワードを変更
 *
 * @param data - パスワード変更データ
 * @returns 変更結果
 * @throws APIエラー時にエラーをスロー
 */
export async function changePassword(data: ChangePasswordRequest): Promise<AccountApiResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * 通知設定を更新
 *
 * @param data - 通知設定データ
 * @returns 更新結果
 * @throws APIエラー時にエラーをスロー
 */
export async function updateNotificationSettings(
  data: NotificationSettings
): Promise<AccountApiResponse> {
  const response = await authenticatedFetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notifications`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

/**
 * プランを変更
 *
 * @param data - プラン変更リクエスト
 * @returns プラン変更結果
 * @throws APIエラー時にエラーをスロー
 */
export async function changePlan(data: PlanChangeRequest): Promise<PlanChangeResponse> {
  const response = await authenticatedFetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/plan-change`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

/**
 * オプションを追加
 *
 * @param data - オプション追加リクエスト
 * @returns 追加結果
 * @throws APIエラー時にエラーをスロー
 */
export async function addOption(data: AddOptionRequest): Promise<AccountApiResponse> {
  const response = await authenticatedFetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

/**
 * オプションを解除
 *
 * @param optionId - 解除するオプションID
 * @returns 解除結果
 * @throws APIエラー時にエラーをスロー
 */
export async function removeOption(optionId: string): Promise<AccountApiResponse> {
  const response = await authenticatedFetch(
    `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
    {
      method: 'DELETE',
    }
  )
  return response.json()
}
