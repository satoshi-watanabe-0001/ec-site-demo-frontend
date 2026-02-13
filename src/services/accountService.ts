/**
 * @fileoverview アカウント管理APIクライアント
 * @module services/accountService
 *
 * マイページ関連のAPIサービス。
 * ダッシュボード・契約情報・データ使用量・請求情報の取得を提供。
 */

import type { DashboardData, ContractInfo, DataUsage, BillingInfo } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  FETCH_FAILED: 'データの取得に失敗しました。',
} as const

/**
 * ダッシュボードデータを取得
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/mypage/dashboard?userId=${userId}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR)
      }
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * 契約情報を取得
 */
export async function getContractInfo(contractId: string): Promise<ContractInfo> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/contracts/${contractId}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR)
      }
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * データ使用量を取得
 */
export async function getDataUsage(contractId: string): Promise<DataUsage> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/data-usage/${contractId}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR)
      }
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * 請求情報を取得
 */
export async function getBillingInfo(contractId: string): Promise<BillingInfo> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/billing/${contractId}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(ERROR_MESSAGES.SERVER_ERROR)
      }
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}
