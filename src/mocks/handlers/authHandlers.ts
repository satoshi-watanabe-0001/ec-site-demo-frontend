/**
 * @fileoverview Auth Service用MSWハンドラー
 * @module mocks/handlers/authHandlers
 *
 * 認証APIのモックハンドラー。
 * Auth Serviceが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type { LoginRequest, LoginResponse, AuthErrorResponse } from '@/types'

/**
 * テスト用の有効なユーザー認証情報
 */
const VALID_CREDENTIALS = {
  email: 'test@docomo.ne.jp',
  password: 'password123',
}

/**
 * ロックされたアカウントのメールアドレス
 */
const LOCKED_ACCOUNT_EMAIL = 'locked@docomo.ne.jp'

/**
 * モック用のJWTトークン生成
 * 実際のJWTではなく、テスト用のダミートークン
 */
const generateMockToken = (): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: 'user-001',
      email: VALID_CREDENTIALS.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  )
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

/**
 * Auth Service用MSWハンドラー
 */
export const authHandlers = [
  // ログインAPI
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest

    // アカウントロックのチェック
    if (body.email === LOCKED_ACCOUNT_EMAIL) {
      const errorResponse: AuthErrorResponse = {
        status: 'error',
        message: 'アカウントがロックされています。しばらく時間をおいてから再度お試しください。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 401 })
    }

    // 認証情報の検証
    if (body.email !== VALID_CREDENTIALS.email || body.password !== VALID_CREDENTIALS.password) {
      const errorResponse: AuthErrorResponse = {
        status: 'error',
        message: 'メールアドレスまたはパスワードが正しくありません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 401 })
    }

    // rememberMeに応じて有効期限を設定（バックエンドと同じロジック）
    const expiresIn = body.rememberMe ? 25200 : 3600

    // 成功レスポンス（バックエンドのAuthResponseに対応）
    const successResponse: LoginResponse = {
      accessToken: generateMockToken(),
      refreshToken: generateMockToken(),
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: 'user-001',
        name: 'テストユーザー',
        email: body.email,
      },
    }

    return HttpResponse.json(successResponse)
  }),
]
