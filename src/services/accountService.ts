/**
 * @fileoverview Account Service API クライアント
 * @module services/accountService
 *
 * アカウント管理関連のAPIサービス。
 * マイページの各種データ取得・更新処理を提供。
 */

import type {
  DashboardResponse,
  ContractInfo,
  DataUsageDetailResponse,
  BillingDetailResponse,
  NotificationSettings,
  OptionService,
  ApiResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePlanRequest,
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
 * APIリクエストの共通エラーハンドリング
 *
 * @param response - fetchレスポンス
 * @param defaultMessage - デフォルトのエラーメッセージ
 * @throws HTTPエラー時にエラーをスロー
 */
async function handleErrorResponse(response: Response, defaultMessage: string): Promise<void> {
  let message = defaultMessage

  try {
    const errorData = await response.json()
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

/**
 * 共通のfetchラッパー
 *
 * @param error - キャッチしたエラー
 * @throws 適切なエラーメッセージでエラーをスロー
 */
function handleFetchError(error: unknown): never {
  if (error instanceof Error && !isNetworkError(error)) {
    throw error
  }
  if (isNetworkError(error)) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
  }
  throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
}

/**
 * ダッシュボードデータを取得
 *
 * @returns ダッシュボードレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getDashboard(): Promise<DashboardResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/dashboard`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      await handleErrorResponse(response, 'ダッシュボードデータの取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * 契約情報を取得
 *
 * @returns 契約情報
 * @throws APIエラー時にエラーをスロー
 */
export async function getContractInfo(): Promise<ContractInfo> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/contract`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      await handleErrorResponse(response, '契約情報の取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * データ使用量詳細を取得
 *
 * @returns データ使用量詳細レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getDataUsageDetail(): Promise<DataUsageDetailResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/data-usage`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      await handleErrorResponse(response, 'データ使用量の取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * 請求情報を取得
 *
 * @returns 請求詳細レスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function getBillingDetail(): Promise<BillingDetailResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/billing`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      await handleErrorResponse(response, '請求情報の取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * プロフィールを更新
 *
 * @param request - プロフィール更新リクエスト
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function updateProfile(request: UpdateProfileRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      await handleErrorResponse(response, '連絡先情報の更新に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * パスワードを変更
 *
 * @param request - パスワード変更リクエスト
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function changePassword(request: ChangePasswordRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      await handleErrorResponse(response, 'パスワードの変更に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * 通知設定を取得
 *
 * @returns 通知設定
 * @throws APIエラー時にエラーをスロー
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await fetch(
      `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notifications/settings`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      await handleErrorResponse(response, '通知設定の取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * 通知設定を更新
 *
 * @param settings - 更新する通知設定
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/notifications/settings`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      }
    )

    if (!response.ok) {
      await handleErrorResponse(response, '通知設定の更新に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * プランを変更
 *
 * @param request - プラン変更リクエスト
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function changePlan(request: ChangePlanRequest): Promise<ApiResponse> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      await handleErrorResponse(response, 'プランの変更に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * オプション一覧を取得
 *
 * @returns オプションサービスの配列
 * @throws APIエラー時にエラーをスロー
 */
export async function getOptions(): Promise<OptionService[]> {
  try {
    const response = await fetch(`${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      await handleErrorResponse(response, 'オプション一覧の取得に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * オプションを追加
 *
 * @param optionId - オプションID
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function addOption(optionId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
      {
        method: 'POST',
      }
    )

    if (!response.ok) {
      await handleErrorResponse(response, 'オプションの追加に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}

/**
 * オプションを解約
 *
 * @param optionId - オプションID
 * @returns APIレスポンス
 * @throws APIエラー時にエラーをスロー
 */
export async function cancelOption(optionId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${ACCOUNT_SERVICE_BASE_URL}/api/v1/account/options/${optionId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      await handleErrorResponse(response, 'オプションの解約に失敗しました。')
    }

    return response.json()
  } catch (error) {
    return handleFetchError(error)
  }
}
