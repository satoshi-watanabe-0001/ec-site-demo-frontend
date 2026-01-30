/**
 * @fileoverview 契約情報 API クライアント
 * @module services/contractService
 *
 * 契約情報、契約者情報、デバイス情報関連のAPIサービス。
 */

import type { ContractSummary, ContractDetails, DeviceInfo } from '@/types'

/**
 * APIのベースURL
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
} as const

/**
 * ネットワークエラーかどうかを判定
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
 * 契約サマリー取得
 *
 * @returns 契約サマリー情報
 * @throws エラー時にエラーをスロー
 */
export async function getContractSummary(): Promise<ContractSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    return response.json()
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
 * 契約詳細取得
 *
 * @returns 契約詳細情報
 * @throws エラー時にエラーをスロー
 */
export async function getContractDetails(): Promise<ContractDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    return response.json()
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
 * デバイス情報取得
 *
 * @returns デバイス情報
 * @throws エラー時にエラーをスロー
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contract/device`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    return response.json()
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
