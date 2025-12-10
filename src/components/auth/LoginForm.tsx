/**
 * @fileoverview ログインフォームコンポーネント
 * @module components/auth/LoginForm
 *
 * メールアドレスとパスワードによるログインフォーム。
 * React Hook Form + Zodによるバリデーション、パスワード表示切替機能を提供。
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { loginUser } from '@/services/authService'

/**
 * ログインフォームのバリデーションスキーマ
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
  rememberMe: z.boolean(),
})

/**
 * ログインフォームの入力値の型
 */
type LoginFormValues = z.infer<typeof loginSchema>

/**
 * ログインフォームコンポーネント
 *
 * @returns ログインフォーム要素
 */
export function LoginForm(): React.ReactElement {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  })

  /**
   * フォーム送信処理
   * ログインAPIを呼び出し、成功時はマイページへリダイレクト
   */
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setIsSubmitting(true)
    setLoginError(null)

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      // 認証ストアにユーザー情報を保存
      login({
        id: response.user.id,
        name: response.user.email.split('@')[0],
        email: response.user.email,
      })

      // マイページへリダイレクト
      router.push('/mypage')
    } catch (error) {
      // エラーメッセージを表示（フォームフィールドはリセットしない）
      setLoginError(error instanceof Error ? error.message : 'ログインに失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * パスワード表示/非表示を切り替え
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* ログインエラーメッセージ */}
      {loginError && (
        <div
          className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm"
          role="alert"
          aria-live="polite"
        >
          {loginError}
        </div>
      )}

      {/* メールアドレス入力 */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          メールアドレス
        </label>
        <Input
          id="email"
          type="email"
          placeholder="例: example@docomo.ne.jp"
          autoComplete="email"
          error={!!errors.email}
          errorMessage={errors.email?.message}
          aria-label="メールアドレス"
          {...register('email')}
        />
      </div>

      {/* パスワード入力 */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          パスワード
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="パスワードを入力"
            autoComplete="current-password"
            error={!!errors.password}
            errorMessage={errors.password?.message}
            aria-label="パスワード"
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ログイン状態を保持するチェックボックス */}
      <div className="flex items-start space-x-3">
        <input
          id="rememberMe"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900"
          {...register('rememberMe')}
        />
        <div>
          <label htmlFor="rememberMe" className="text-sm font-medium text-slate-300">
            ログイン状態を保持する
          </label>
          <p className="text-xs text-slate-400">次回から自動的にログインします</p>
        </div>
      </div>

      {/* ログインボタン */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </Button>

      {/* リンク */}
      <div className="space-y-3 text-center text-sm">
        <Link
          href="/forgot-password"
          className="block text-slate-400 hover:text-primary transition-colors"
        >
          パスワードを忘れた方
        </Link>
        <div className="text-slate-400">
          アカウントをお持ちでない方{' '}
          <Link href="/signup" className="text-primary hover:underline">
            新規登録
          </Link>
        </div>
      </div>
    </form>
  )
}
