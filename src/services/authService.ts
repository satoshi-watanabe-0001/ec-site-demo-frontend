/**
 * @fileoverview Auth Service API クライアント
 * @module services/authService
 *
 * 認証関連のAPIサービス。
 * Auth Service（port 8081）と通信。
 */

import { config } from '@/lib/env'
import type { LoginRequest, LoginResponse, AuthErrorResponse } from '@/types'

/**
 * Auth Service APIのベースURL
 */
const AUTH_SERVICE_BASE_URL = config.api.baseURL

/**
 * ログイン処理
 *
 * @param request - ログインリクエスト（メールアドレス、パスワード、ログイン状態保持フラグ）
 * @returns ログインレスポンス（トークン、ユーザー情報）
 * @throws 認証エラー時にエラーをスロー
 */
export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_SERVICE_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData: AuthErrorResponse = await response.json()
    throw new Error(errorData.message || 'ログインに失敗しました')
  }

  return response.json()
}
