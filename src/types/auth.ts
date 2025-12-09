/**
 * @fileoverview 認証関連の型定義
 * @module types/auth
 *
 * ログイン機能で使用する型定義。
 * バックエンドのAuth ServiceのDTOと一致させる。
 */

/**
 * ログインリクエストの型定義
 * バックエンドのLoginRequest DTOと一致
 */
export interface LoginRequest {
  /** メールアドレス（必須、有効なメール形式） */
  email: string
  /** パスワード（必須、空白不可） */
  password: string
  /** ログイン状態を保持するかどうか（オプション、デフォルトfalse） */
  rememberMe?: boolean
}

/**
 * ログインレスポンスのユーザー情報
 */
export interface LoginUser {
  /** ユーザーID */
  id: string
  /** メールアドレス */
  email: string
  /** ユーザーの権限ロール */
  roles: string[]
  /** 多要素認証が有効かどうか */
  mfaEnabled: boolean
}

/**
 * ログインレスポンスの型定義
 * バックエンドのLoginResponse DTOと一致
 */
export interface LoginResponse {
  /** アクセストークン（JWT、15分有効） */
  accessToken: string
  /** リフレッシュトークン（JWT、30日有効） */
  refreshToken: string
  /** トークンタイプ（常に"bearer"） */
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
  /** エラーメッセージ */
  message: string
  /** エラーコード */
  code?: string
}
