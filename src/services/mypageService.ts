/**
 * @fileoverview マイページ API サービス
 * @module services/mypageService
 *
 * ahamoアカウント管理のAPIサービス。
 * ダッシュボード、契約情報、データ使用量、請求情報等のAPI通信を行う。
 */

import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  PlanChangeRequest,
  PlanChangeResponse,
  OptionChangeRequest,
  OptionChangeResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  NotificationPreferences,
  SettingsUpdateResponse,
  AvailableOption,
} from '@/types'

/**
 * マイページAPIのベースURL
 */
const MYPAGE_API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  FETCH_FAILED: 'データの取得に失敗しました。',
  UPDATE_FAILED: '更新に失敗しました。',
} as const

/**
 * ネットワークエラーかどうかを判定
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true
  }
  if (error instanceof Error) {
    const message: string = error.message.toLowerCase()
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
 * 共通のエラーハンドリング
 */
function handleApiError(error: unknown, fallbackMessage: string): never {
  if (error instanceof Error && !isNetworkError(error)) {
    throw error
  }
  if (isNetworkError(error)) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
  }
  throw new Error(fallbackMessage)
}

/**
 * 共通のレスポンス処理
 */
async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    let message: string = errorMessage
    try {
      const errorData: { message?: string } = await response.json()
      if (errorData?.message) {
        message = errorData.message
      } else if (response.status >= 500) {
        message = ERROR_MESSAGES.SERVER_ERROR
      }
    } catch {
      if (response.status >= 500) {
        message = ERROR_MESSAGES.SERVER_ERROR
      }
    }
    throw new Error(message)
  }
  return response.json()
}

/**
 * ダッシュボードデータを取得
 *
 * @returns ダッシュボードデータ
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/dashboard`, {
      cache: 'no-store',
    })
    return handleResponse<DashboardData>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * 契約情報を取得
 *
 * @returns 契約情報
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getContractDetails(): Promise<ContractInfo> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/contract`, {
      cache: 'no-store',
    })
    return handleResponse<ContractInfo>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * データ使用量を取得
 *
 * @returns データ使用量
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getDataUsage(): Promise<DataUsage> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/data-usage`, {
      cache: 'no-store',
    })
    return handleResponse<DataUsage>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * 請求情報を取得
 *
 * @returns 請求情報
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getBillingInfo(): Promise<BillingInfo> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/billing`, {
      cache: 'no-store',
    })
    return handleResponse<BillingInfo>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * 利用可能オプション一覧を取得
 *
 * @returns 利用可能オプション一覧
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getAvailableOptions(): Promise<AvailableOption[]> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/options`, {
      cache: 'no-store',
    })
    return handleResponse<AvailableOption[]>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * 通知設定を取得
 *
 * @returns 通知設定
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const response: Response = await fetch(
      `${MYPAGE_API_BASE_URL}/api/v1/mypage/settings/notifications`,
      { cache: 'no-store' }
    )
    return handleResponse<NotificationPreferences>(response, ERROR_MESSAGES.FETCH_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * プロフィールを更新
 *
 * @param request - プロフィール更新リクエスト
 * @returns 更新結果
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function updateProfile(
  request: ProfileUpdateRequest
): Promise<SettingsUpdateResponse> {
  try {
    const response: Response = await fetch(
      `${MYPAGE_API_BASE_URL}/api/v1/mypage/settings/profile`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }
    )
    return handleResponse<SettingsUpdateResponse>(response, ERROR_MESSAGES.UPDATE_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * パスワードを変更
 *
 * @param request - パスワード変更リクエスト
 * @returns 変更結果
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function changePassword(
  request: PasswordChangeRequest
): Promise<SettingsUpdateResponse> {
  try {
    const response: Response = await fetch(
      `${MYPAGE_API_BASE_URL}/api/v1/mypage/settings/password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }
    )
    return handleResponse<SettingsUpdateResponse>(response, ERROR_MESSAGES.UPDATE_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * 通知設定を更新
 *
 * @param request - 通知設定
 * @returns 更新結果
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function updateNotificationPreferences(
  request: NotificationPreferences
): Promise<SettingsUpdateResponse> {
  try {
    const response: Response = await fetch(
      `${MYPAGE_API_BASE_URL}/api/v1/mypage/settings/notifications`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }
    )
    return handleResponse<SettingsUpdateResponse>(response, ERROR_MESSAGES.UPDATE_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * プランを変更
 *
 * @param request - プラン変更リクエスト
 * @returns プラン変更結果
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function changePlan(request: PlanChangeRequest): Promise<PlanChangeResponse> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    return handleResponse<PlanChangeResponse>(response, ERROR_MESSAGES.UPDATE_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

/**
 * オプションを変更（追加/解除）
 *
 * @param request - オプション変更リクエスト
 * @returns オプション変更結果
 * @throws ネットワークエラーまたはAPIエラー
 */
export async function manageOption(request: OptionChangeRequest): Promise<OptionChangeResponse> {
  try {
    const response: Response = await fetch(`${MYPAGE_API_BASE_URL}/api/v1/mypage/options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    return handleResponse<OptionChangeResponse>(response, ERROR_MESSAGES.UPDATE_FAILED)
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}
