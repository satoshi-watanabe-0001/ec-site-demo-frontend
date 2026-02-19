/**
 * @fileoverview プラン管理 API クライアント
 * @module services/PlanApiService
 */

import type {
  PlanInfo,
  AvailablePlansResponse,
  PlanChangeRequest,
  PlanChangeResponse,
  OptionsResponse,
  OptionSubscribeResponse,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getCurrentPlan(): Promise<PlanInfo> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/current`)
  if (!response.ok) {
    throw new Error(`現在のプラン情報の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getAvailablePlans(): Promise<AvailablePlansResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/available`)
  if (!response.ok) {
    throw new Error(`利用可能なプラン一覧の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function changePlan(request: PlanChangeRequest): Promise<PlanChangeResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/plans/change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(`プラン変更に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function getOptions(): Promise<OptionsResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/options`)
  if (!response.ok) {
    throw new Error(`オプションサービス一覧の取得に失敗しました: ${response.status}`)
  }
  return response.json()
}

export async function subscribeOption(optionId: string): Promise<OptionSubscribeResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/mypage/options/${optionId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`オプションの申込に失敗しました: ${response.status}`)
  }
  return response.json()
}
