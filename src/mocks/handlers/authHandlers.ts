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
 * テスト用ユーザーデータ
 * 開発・テスト環境で使用する認証情報
 */
const TEST_USERS = [
  {
    email: 'test@example.com',
    password: 'password123',
    user: {
      id: 'user-001',
      email: 'test@example.com',
      roles: ['user'],
      mfaEnabled: false,
    },
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    user: {
      id: 'user-002',
      email: 'admin@example.com',
      roles: ['admin', 'user'],
      mfaEnabled: false,
    },
  },
]

/**
 * モック用JWTトークンを生成
 * 実際のJWTではなく、テスト用のダミートークン
 *
 * @param userId - ユーザーID
 * @returns ダミーJWTトークン
 */
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900,
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

    // テストユーザーを検索
    const testUser = TEST_USERS.find(
      user => user.email === body.email && user.password === body.password
    )

    if (testUser) {
      // 認証成功
      const response: LoginResponse = {
        accessToken: generateMockToken(testUser.user.id),
        refreshToken: generateMockToken(`refresh-${testUser.user.id}`),
        tokenType: 'bearer',
        expiresIn: 900,
        user: testUser.user,
      }
      return HttpResponse.json(response)
    }

    // 認証失敗（アンチ列挙パターン: メール/パスワードどちらが間違っているか明かさない）
    const errorResponse: AuthErrorResponse = {
      message: 'メールアドレスまたはパスワードが正しくありません',
      code: 'INVALID_CREDENTIALS',
    }
    return HttpResponse.json(errorResponse, { status: 401 })
  }),
]
