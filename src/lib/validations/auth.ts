/**
 * @fileoverview 認証関連のバリデーションスキーマ
 * @module lib/validations/auth
 *
 * ログインフォームで使用するZodバリデーションスキーマ。
 * バックエンドのLoginRequest DTOと一致させる。
 */

import { z } from 'zod'

/**
 * ログインフォームのバリデーションスキーマ
 *
 * バックエンドのLoginRequest DTOに対応:
 * - email: 必須、有効なメール形式
 * - password: 必須、空白不可
 * - rememberMe: オプション、boolean（デフォルトfalse）
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '有効なメールアドレスを入力してください' }),
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください' }),
  rememberMe: z.boolean().default(false),
})

/**
 * ログインフォームの入力値の型
 * Zodスキーマから推論
 */
export type LoginFormValues = z.infer<typeof loginSchema>
