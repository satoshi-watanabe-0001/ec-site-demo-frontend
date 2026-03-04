/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * アカウント設定フォームとパスワード変更フォームを提供。
 * React Hook Form + Zodによるバリデーション。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getAccountSettings,
  updateAccountSettings,
  changePassword,
} from '@/services/accountService'
import type { AccountSettingsResponse } from '@/types/account'

/**
 * アカウント設定フォームのバリデーションスキーマ
 */
const settingsSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    dataWarning: z.boolean(),
    billing: z.boolean(),
  }),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

/**
 * パスワード変更フォームのバリデーションスキーマ
 */
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/[A-Z]/, '大文字を1文字以上含めてください')
      .regex(/[a-z]/, '小文字を1文字以上含めてください')
      .regex(/[0-9]/, '数字を1文字以上含めてください'),
    confirmPassword: z.string().min(1, 'パスワード確認を入力してください'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * アカウント設定ページコンポーネント
 */
export default function SettingsPage() {
  const [settings, setSettings] = useState<AccountSettingsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null)
  const [settingsError, setSettingsError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSettingsSubmitting, setIsSettingsSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      email: '',
      notifications: {
        email: true,
        sms: false,
        dataWarning: true,
        billing: true,
      },
    },
    mode: 'onChange',
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getAccountSettings()
        setSettings(data)
        settingsForm.reset({
          name: data.name,
          email: data.email,
          notifications: data.notifications,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [settingsForm])

  const onSettingsSubmit = async (data: SettingsFormValues): Promise<void> => {
    setIsSettingsSubmitting(true)
    setSettingsSuccess(null)
    setSettingsError(null)
    try {
      const result = await updateAccountSettings(data)
      setSettingsSuccess(result.message)
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : '設定の更新に失敗しました')
    } finally {
      setIsSettingsSubmitting(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues): Promise<void> => {
    setIsPasswordSubmitting(true)
    setPasswordSuccess(null)
    setPasswordError(null)
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
      setPasswordSuccess(result.message)
      passwordForm.reset()
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました')
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">アカウント設定</h2>

      {/* アカウント情報フォーム */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">基本情報</h3>

        {settingsSuccess && (
          <div
            className="mb-4 rounded-md bg-green-500/10 border border-green-500 p-3 text-sm text-green-400"
            role="alert"
          >
            {settingsSuccess}
          </div>
        )}
        {settingsError && (
          <div
            className="mb-4 rounded-md bg-red-500/10 border border-red-500 p-3 text-sm text-red-400"
            role="alert"
          >
            {settingsError}
          </div>
        )}

        <form
          onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="settings-name" className="block text-sm font-medium text-slate-300">
              名前
            </label>
            <Input
              id="settings-name"
              type="text"
              error={!!settingsForm.formState.errors.name}
              errorMessage={settingsForm.formState.errors.name?.message}
              {...settingsForm.register('name')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-email" className="block text-sm font-medium text-slate-300">
              メールアドレス
            </label>
            <Input
              id="settings-email"
              type="email"
              error={!!settingsForm.formState.errors.email}
              errorMessage={settingsForm.formState.errors.email?.message}
              {...settingsForm.register('email')}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300">電話番号</p>
            <p className="text-white">{settings.phoneNumber}</p>
            <p className="text-xs text-slate-500">電話番号の変更はサポートにお問い合わせください</p>
          </div>

          {/* 通知設定 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300">通知設定</p>
            <div className="space-y-2">
              {[
                { key: 'email' as const, label: 'メール通知' },
                { key: 'sms' as const, label: 'SMS通知' },
                { key: 'dataWarning' as const, label: 'データ量警告' },
                { key: 'billing' as const, label: '請求通知' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary"
                    {...settingsForm.register(`notifications.${item.key}`)}
                  />
                  <span className="text-sm text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white sm:w-auto"
            disabled={!settingsForm.formState.isValid || isSettingsSubmitting}
          >
            {isSettingsSubmitting ? '保存中...' : '設定を保存'}
          </Button>
        </form>
      </section>

      {/* パスワード変更フォーム */}
      <section className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">パスワード変更</h3>

        {passwordSuccess && (
          <div
            className="mb-4 rounded-md bg-green-500/10 border border-green-500 p-3 text-sm text-green-400"
            role="alert"
          >
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div
            className="mb-4 rounded-md bg-red-500/10 border border-red-500 p-3 text-sm text-red-400"
            role="alert"
          >
            {passwordError}
          </div>
        )}

        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <label htmlFor="current-password" className="block text-sm font-medium text-slate-300">
              現在のパスワード
            </label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              error={!!passwordForm.formState.errors.currentPassword}
              errorMessage={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-300">
              新しいパスワード
            </label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              error={!!passwordForm.formState.errors.newPassword}
              errorMessage={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            <p className="text-xs text-slate-500">
              8文字以上、大文字・小文字・数字をそれぞれ1文字以上含む
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
              新しいパスワード（確認）
            </label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              error={!!passwordForm.formState.errors.confirmPassword}
              errorMessage={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white sm:w-auto"
            disabled={!passwordForm.formState.isValid || isPasswordSubmitting}
          >
            {isPasswordSubmitting ? '変更中...' : 'パスワードを変更'}
          </Button>
        </form>
      </section>
    </div>
  )
}
