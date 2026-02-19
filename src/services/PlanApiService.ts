/**
 * @fileoverview プラン管理APIサービス
 * @module services/PlanApiService
 *
 * プラン情報の取得・変更、オプションサービスの管理を行うAPIサービス。
 */

import type {
  AvailablePlan,
  PlanChangeRequest,
  PlanChangeResponse,
  OptionsResponse,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getCurrentPlan(): Promise<{
  plan: AvailablePlan
}> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/current`)
  if (!response.ok) {
    throw new Error(`現在のプラン情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getAvailablePlans(): Promise<{ plans: AvailablePlan[] }> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/available`)
  if (!response.ok) {
    throw new Error(`利用可能なプラン一覧の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function changePlan(data: PlanChangeRequest): Promise<PlanChangeResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `プラン変更に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getOptions(): Promise<OptionsResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/options`)
  if (!response.ok) {
    throw new Error(`オプションサービスの取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function subscribeOption(
  optionId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/options/${optionId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `オプション加入に失敗しました: ${response.status}`)
  }
  return response.json()
}
