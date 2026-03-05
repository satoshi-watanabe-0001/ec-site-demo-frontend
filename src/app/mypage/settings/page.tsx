/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * 連絡先情報の変更、パスワード変更などのアカウント設定ページ。
 * React Hook Form + Zodによるバリデーション。
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfile, changePassword } from '@/services/accountService'

/**
 * プロフィール更新のバリデーションスキーマ
 */
const profileSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  phoneNumber: z
    .string()
    .min(1, '電話番号を入力してください')
    .regex(/^[\d-]+$/, '有効な電話番号を入力してください'),
  postalCode: z
    .string()
    .min(1, '郵便番号を入力してください')
    .regex(/^\d{3}-?\d{4}$/, '有効な郵便番号を入力してください（例: 100-0001）'),
  address: z.string().min(1, '住所を入力してください'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

/**
 * パスワード変更のバリデーションスキーマ
 */
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/[A-Za-z]/, '英字を含めてください')
      .regex(/[0-9]/, '数字を含めてください'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * アカウント設定ページコンポーネント
 *
 * @returns アカウント設定ページ要素
 */
export default function SettingsPage(): React.ReactElement {
  // プロフィール更新フォーム
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isValid: isProfileValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: 'test@docomo.ne.jp',
      phoneNumber: '090-1234-5678',
      postalCode: '100-0001',
      address: '東京都千代田区千代田1-1-1 千代田マンション301',
    },
    mode: 'onChange',
  })

  // パスワード変更フォーム
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
    reset: resetPasswordForm,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  /**
   * プロフィール更新処理
   */
  const onProfileSubmit = async (data: ProfileFormValues): Promise<void> => {
    setIsProfileSubmitting(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const message = await updateProfile(data)
      setProfileSuccess(message)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : '更新に失敗しました')
    } finally {
      setIsProfileSubmitting(false)
    }
  }

  /**
   * パスワード変更処理
   */
  const onPasswordSubmit = async (data: PasswordFormValues): Promise<void> => {
    setIsPasswordSubmitting(true)
    setPasswordSuccess(null)
    setPasswordError(null)

    try {
      const message = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setPasswordSuccess(message)
      resetPasswordForm()
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました')
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">アカウント設定</h1>
        <p className="text-slate-400 mt-1">連絡先情報やパスワードを変更できます</p>
      </div>

      {/* 連絡先情報変更 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-orange-500" />
          連絡先情報
        </h2>

        {profileSuccess && (
          <div className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            {profileSuccess}
          </div>
        )}

        {profileError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-400 text-sm mb-4"
            role="alert"
          >
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              error={!!profileErrors.email}
              errorMessage={profileErrors.email?.message}
              {...registerProfile('email')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300">
              電話番号
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              error={!!profileErrors.phoneNumber}
              errorMessage={profileErrors.phoneNumber?.message}
              {...registerProfile('phoneNumber')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300">
              郵便番号
            </label>
            <Input
              id="postalCode"
              type="text"
              placeholder="例: 100-0001"
              error={!!profileErrors.postalCode}
              errorMessage={profileErrors.postalCode?.message}
              {...registerProfile('postalCode')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-slate-300">
              住所
            </label>
            <Input
              id="address"
              type="text"
              error={!!profileErrors.address}
              errorMessage={profileErrors.address?.message}
              {...registerProfile('address')}
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6"
            disabled={!isProfileValid || isProfileSubmitting}
          >
            {isProfileSubmitting ? '更新中...' : '連絡先を更新'}
          </Button>
        </form>
      </section>

      {/* パスワード変更 */}
      <section className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-orange-500" />
          パスワード変更
        </h2>

        {passwordSuccess && (
          <div className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-400 text-sm mb-4"
            role="alert"
          >
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300">
              現在のパスワード
            </label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              error={!!passwordErrors.currentPassword}
              errorMessage={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
              新しいパスワード
            </label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="8文字以上、英字と数字を含む"
              error={!!passwordErrors.newPassword}
              errorMessage={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              新しいパスワード（確認）
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              error={!!passwordErrors.confirmPassword}
              errorMessage={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6"
            disabled={!isPasswordValid || isPasswordSubmitting}
          >
            {isPasswordSubmitting ? '変更中...' : 'パスワードを変更'}
          </Button>
        </form>
      </section>
    </div>
  )
}
