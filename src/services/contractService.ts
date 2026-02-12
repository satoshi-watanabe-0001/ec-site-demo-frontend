/**
 * @fileoverview 契約情報APIクライアント
 * @module services/contractService
 *
 * 契約情報関連のAPIサービス。
 * 契約情報取得、プラン変更、オプション管理を提供。
 */

import type {
  ContractInfo,
  PlanInfo,
  PlanChangeRequest,
  PlanChangeResponse,
  AvailableOption,
} from '@/types/contract'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 契約情報を取得
 *
 * @param token - 認証トークン
 * @returns 契約情報
 */
export async function getContractInfo(token: string): Promise<ContractInfo> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/contract`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('契約情報の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('契約情報取得エラー:', error)
    throw error
  }
}

/**
 * 利用可能なプラン一覧を取得
 *
 * @param token - 認証トークン
 * @returns プラン一覧
 */
export async function getAvailablePlans(token: string): Promise<PlanInfo[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('プラン一覧の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('プラン一覧取得エラー:', error)
    throw error
  }
}

/**
 * プランを変更
 *
 * @param token - 認証トークン
 * @param request - プラン変更リクエスト
 * @returns プラン変更レスポンス
 */
export async function changePlan(
  token: string,
  request: PlanChangeRequest
): Promise<PlanChangeResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/plan`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('プラン変更に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('プラン変更エラー:', error)
    throw error
  }
}

/**
 * 追加可能なオプション一覧を取得
 *
 * @param token - 認証トークン
 * @returns 追加可能なオプション一覧
 */
export async function getAvailableOptions(token: string): Promise<AvailableOption[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/options/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('オプション一覧の取得に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('オプション一覧取得エラー:', error)
    throw error
  }
}

/**
 * オプションを追加
 *
 * @param token - 認証トークン
 * @param optionId - 追加するオプションID
 * @returns 追加結果
 */
export async function addOption(
  token: string,
  optionId: string
): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/options`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionId }),
    })

    if (!response.ok) {
      throw new Error('オプション追加に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('オプション追加エラー:', error)
    throw error
  }
}

/**
 * オプションを解約
 *
 * @param token - 認証トークン
 * @param optionId - 解約するオプションID
 * @returns 解約結果
 */
export async function removeOption(
  token: string,
  optionId: string
): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/account/options/${optionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('オプション解約に失敗しました')
    }

    return response.json()
  } catch (error) {
    console.error('オプション解約エラー:', error)
    throw error
  }
}
