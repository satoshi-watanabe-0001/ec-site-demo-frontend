/**
 * @fileoverview 認証関連の型定義
 * @module types/auth
 *
 * ログイン/認証APIのリクエスト・レスポンス型を定義。
 * Auth Serviceとの通信で使用される。
 */

/**
 * ログインリクエストの型定義
 */
export interface LoginRequest {
  /** メールアドレス */
  email: string
  /** パスワード */
  password: string
  /** ログイン状態を保持するかどうか */
  rememberMe: boolean
}

/**
 * ログインレスポンスのユーザー情報
 *
 * バックエンドのUserResponseに対応。
 */
export interface LoginUser {
  /** ユーザーID */
  id: string
  /** ユーザー名 */
  name: string
  /** メールアドレス */
  email: string
}

/**
 * ログインレスポンスの型定義
 */
export interface LoginResponse {
  /** アクセストークン */
  accessToken: string
  /** リフレッシュトークン */
  refreshToken: string
  /** トークンタイプ（通常は"Bearer"） */
  tokenType: string
  /** トークンの有効期限（秒） */
  expiresIn: number
  /** ユーザー情報 */
  user: LoginUser
}

/**
 * 認証エラーレスポンスの型定義
 */
export interface AuthErrorResponse {
  /** ステータス */
  status: 'error'
  /** エラーメッセージ */
  message: string
  /** タイムスタンプ */
  timestamp: string
}
