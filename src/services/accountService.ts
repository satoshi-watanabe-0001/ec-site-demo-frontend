/**
 * @fileoverview アカウント管理 API クライアント
 * @module services/accountService
 *
 * マイページ関連のAPIサービス。
 * ダッシュボード、契約、データ使用量、請求、設定、プラン変更、オプション管理のAPIを提供。
 */

import type {
  DashboardResponse,
  ContractDetailResponse,
  DataUsageDetailResponse,
  BillingDetailResponse,
  AccountSettingsResponse,
  UpdateSettingsRequest,
  ChangePasswordRequest,
  PlansResponse,
  ChangePlanRequest,
  OptionsResponse,
  ApiSuccessResponse,
} from '@/types/account'

/**
 * APIのベースURL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 認証ヘッダーを取得
 * モック実装のため、任意のBearerトークンを送信
 */
function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: 'Bearer mock-token',
  }
}

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNAUTHORIZED: '認証が必要です。再度ログインしてください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
} as const

/**
 * ネットワークエラーかどうかを判定
 *
 * @param error - エラーオブジェクト
 * @returns ネットワークエラーの場合true
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true
  }
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
 * APIリクエストのラッパー関数
 *
 * fetch自体の失敗（ネットワーク切断等）とレスポンス処理エラーを区別するため、
 * fetch呼び出しのみを内側のtry/catchでラップし、レスポンス処理エラーはそのまま伝播させる。
 */
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response

  // fetch呼び出し（ネットワークエラーのみキャッチ）
  try {
    response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options,
    })
  } catch (error) {
    // fetch自体が失敗した場合（ネットワーク切断、CORS、タイムアウト等）
    if (isNetworkError(error)) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
  }

  // レスポンス処理（エラーはそのまま伝播）
  if (response.status === 401) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }
    const errorData = await response.json().catch(() => null)
    throw new Error((errorData as { message?: string })?.message || ERROR_MESSAGES.UNEXPECTED_ERROR)
  }

  return response.json()
}

// ============================================================
// ダッシュボード
// ============================================================

/**
 * ダッシュボードデータを取得
 */
export async function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(`${API_BASE_URL}/api/v1/account/dashboard`)
}

// ============================================================
// 契約
// ============================================================

/**
 * 契約詳細を取得
 */
export async function getContractDetail(): Promise<ContractDetailResponse> {
  return apiRequest<ContractDetailResponse>(`${API_BASE_URL}/api/v1/account/contract`)
}

// ============================================================
// データ使用量
// ============================================================

/**
 * データ使用量詳細を取得
 */
export async function getDataUsageDetail(): Promise<DataUsageDetailResponse> {
  return apiRequest<DataUsageDetailResponse>(`${API_BASE_URL}/api/v1/account/data-usage`)
}

// ============================================================
// 請求・支払い
// ============================================================

/**
 * 請求詳細を取得
 */
export async function getBillingDetail(): Promise<BillingDetailResponse> {
  return apiRequest<BillingDetailResponse>(`${API_BASE_URL}/api/v1/account/billing`)
}

// ============================================================
// アカウント設定
// ============================================================

/**
 * アカウント設定を取得
 */
export async function getAccountSettings(): Promise<AccountSettingsResponse> {
  return apiRequest<AccountSettingsResponse>(`${API_BASE_URL}/api/v1/account/settings`)
}

/**
 * アカウント設定を更新
 */
export async function updateAccountSettings(
  data: UpdateSettingsRequest
): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(`${API_BASE_URL}/api/v1/account/settings`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * パスワードを変更
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(`${API_BASE_URL}/api/v1/account/password`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================
// プラン変更
// ============================================================

/**
 * 利用可能プラン一覧を取得
 */
export async function getAvailablePlans(): Promise<PlansResponse> {
  return apiRequest<PlansResponse>(`${API_BASE_URL}/api/v1/account/plans`)
}

/**
 * プランを変更
 */
export async function changePlan(data: ChangePlanRequest): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(`${API_BASE_URL}/api/v1/account/plan`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ============================================================
// オプション管理
// ============================================================

/**
 * 利用可能オプション一覧を取得
 */
export async function getAvailableOptions(): Promise<OptionsResponse> {
  return apiRequest<OptionsResponse>(`${API_BASE_URL}/api/v1/account/options`)
}

/**
 * オプションに登録
 */
export async function enrollOption(optionId: string): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(`${API_BASE_URL}/api/v1/account/options/${optionId}`, {
    method: 'POST',
  })
}

/**
 * オプションを解除
 */
export async function cancelOption(optionId: string): Promise<ApiSuccessResponse> {
  return apiRequest<ApiSuccessResponse>(`${API_BASE_URL}/api/v1/account/options/${optionId}`, {
    method: 'DELETE',
  })
}
