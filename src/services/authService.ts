/**
 * @fileoverview 認証サービス API クライアント
 * @module services/authService
 *
 * 認証関連のAPIを呼び出すサービス。
 * Auth Service（/api/v1/auth）と通信。
 */

import { config } from '@/lib/env'
import type { LoginRequest, LoginResponse, AuthErrorResponse } from '@/types'

/**
 * Auth Service APIのベースURL
 */
const AUTH_SERVICE_BASE_URL = config.api.baseURL

/**
 * ログインAPIを呼び出す
 *
 * @param credentials - ログイン認証情報
 * @returns ログインレスポンス（トークンとユーザー情報）
 * @throws 認証失敗時またはAPIエラー時にエラーをスロー
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_SERVICE_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData: AuthErrorResponse = await response.json().catch(() => ({
      message: 'ログインに失敗しました',
    }))
    throw new Error(errorData.message || 'ログインに失敗しました')
  }

  return response.json()
}
