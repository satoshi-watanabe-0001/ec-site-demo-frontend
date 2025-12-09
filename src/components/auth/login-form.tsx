/**
 * @fileoverview ログインフォームコンポーネント
 * @module components/auth/login-form
 *
 * React Hook FormとZodを使用したログインフォーム。
 * メール、パスワード、ログイン状態保持のフィールドを含む。
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'
import { useAuthStore } from '@/store/auth-store'
import { login } from '@/services/authService'
import { loginSchema } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'
import type { z } from 'zod'

/**
 * ログインフォームの入力値の型
 */
type LoginFormData = z.infer<typeof loginSchema>

/**
 * ログインフォームコンポーネント
 *
 * 機能:
 * - メールアドレス入力（バリデーション付き）
 * - パスワード入力（表示/非表示トグル付き）
 * - ログイン状態保持チェックボックス
 * - フォーム送信時のローディング状態
 * - エラーメッセージ表示
 *
 * @returns ログインフォーム要素
 */
export function LoginForm(): React.ReactElement {
  const router = useRouter()
  const { login: storeLogin } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  /**
   * フォーム送信ハンドラー
   * 認証APIを呼び出し、成功時にストアを更新してリダイレクト
   *
   * @param data - フォーム入力値
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setSubmitError(null)

    try {
      const response = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      // Zustandストアにユーザー情報を保存
      storeLogin({
        id: response.user.id,
        name: response.user.email.split('@')[0],
        email: response.user.email,
      })

      // マイページへリダイレクト
      router.push('/mypage')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました'
      setSubmitError(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* エラーメッセージ表示 */}
      {submitError && (
        <div
          className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg"
          role="alert"
        >
          <p>{submitError}</p>
        </div>
      )}

      {/* メールアドレス入力 */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={cn(
            'w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all',
            errors.email ? 'border-red-500' : 'border-slate-600'
          )}
          placeholder="example@email.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* パスワード入力 */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          パスワード
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            className={cn(
              'w-full px-4 py-3 pr-12 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all',
              errors.password ? 'border-red-500' : 'border-slate-600'
            )}
            placeholder="パスワードを入力"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ログイン状態保持チェックボックス */}
      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          {...register('rememberMe')}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-300 cursor-pointer">
          ログイン状態を保持する
        </label>
      </div>

      {/* 送信ボタン */}
      <GradientButton type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ログイン中...
          </>
        ) : (
          'ログイン'
        )}
      </GradientButton>

      {/* 新規登録リンク */}
      <div className="text-center">
        <p className="text-sm text-slate-400">
          アカウントをお持ちでない方は{' '}
          <a
            href="/signup"
            className="text-orange-400 hover:text-orange-300 underline transition-colors"
          >
            新規登録
          </a>
        </p>
      </div>
    </form>
  )
}
