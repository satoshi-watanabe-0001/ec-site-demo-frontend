/**
 * @fileoverview Auth Service API クライアント
 * @module services/authService
 *
 * 認証関連のAPIサービス。
 * Auth Service（port 8081）と通信。
 */

import type { LoginRequest, LoginResponse, AuthErrorResponse } from '@/types'

/**
 * Auth Service APIのベースURL
 * クライアントサイドで使用するため、NEXT_PUBLIC_API_URLを直接参照
 * @t3-oss/env-nextjsのenvオブジェクトはサーバーサイド変数を含むため、
 * クライアントコンポーネントでは直接process.envを使用
 */
const AUTH_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * エラーメッセージの定数
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認して、再度お試しください。',
  SERVER_ERROR: 'サーバーでエラーが発生しました。時間をおいて再度お試しください。',
  UNEXPECTED_ERROR: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
  LOGIN_FAILED: 'ログインに失敗しました。',
} as const

/**
 * ログイン処理
 *
 * @param request - ログインリクエスト（メールアドレス、パスワード、ログイン状態保持フラグ）
 * @returns ログインレスポンス（トークン、ユーザー情報）
 * @throws 認証エラー時にエラーをスロー（日本語メッセージ）
 */
export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${AUTH_SERVICE_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      // HTTPエラーレスポンスの処理
      let message: string = ERROR_MESSAGES.LOGIN_FAILED

      try {
        const errorData: AuthErrorResponse = await response.json()
        if (errorData?.message) {
          // APIからのエラーメッセージを使用
          message = errorData.message
        } else if (response.status >= 500) {
          // サーバーエラー
          message = ERROR_MESSAGES.SERVER_ERROR
        }
      } catch {
        // JSONパースエラーの場合
        if (response.status >= 500) {
          message = ERROR_MESSAGES.SERVER_ERROR
        }
      }

      throw new Error(message)
    }

    return response.json()
  } catch (error) {
    // 既に処理済みのエラー（上記でthrowしたもの）はそのまま再スロー
    if (error instanceof Error && !isNetworkError(error)) {
      throw error
    }

    // ネットワークエラー（fetch自体が失敗した場合）
    if (isNetworkError(error)) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }

    // 想定外のエラー
    throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR)
  }
}

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
