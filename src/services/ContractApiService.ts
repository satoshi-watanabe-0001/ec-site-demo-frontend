/**
 * @fileoverview 契約情報 API クライアント
 * @module services/ContractApiService
 */

import type { DashboardResponse, ContractDetail, NotificationsResponse } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/dashboard`)
  if (!response.ok) {
    throw new Error(`ダッシュボード情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getContractDetail(): Promise<ContractDetail> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/contract`)
  if (!response.ok) {
    throw new Error(`契約情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/notifications`)
  if (!response.ok) {
    throw new Error(`通知の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}
