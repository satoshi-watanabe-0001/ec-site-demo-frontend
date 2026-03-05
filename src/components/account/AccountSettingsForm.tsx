'use client'

/**
 * @fileoverview アカウント設定フォームコンポーネント
 * @module components/account/AccountSettingsForm
 *
 * プロフィール更新、パスワード変更、通知設定の3つのフォームを提供する。
 * react-hook-form + zodバリデーションを使用。
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth-store'
import { updateProfile, changePassword, updateNotificationSettings } from '@/services/accountService'

/**
 * プロフィール更新フォームのバリデーションスキーマ
 */
const profileSchema = z.object({
  name: z.string().min(1, '氏名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

/**
 * パスワード変更フォームのバリデーションスキーマ
 */
const passwordSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードは必須です'),
  newPassword: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string().min(1, '確認用パスワードは必須です'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * 通知設定フォームのバリデーションスキーマ
 */
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  campaignNotifications: z.boolean(),
  billingNotifications: z.boolean(),
  dataUsageAlerts: z.boolean(),
})

type NotificationFormValues = z.infer<typeof notificationSchema>

/**
 * アカウント設定フォームコンポーネント
 *
 * 3つのセクションに分かれたフォーム：
 * 1. プロフィール更新（氏名・メールアドレス）
 * 2. パスワード変更
 * 3. 通知設定
 */
export function AccountSettingsForm() {
  const { user } = useAuthStore()
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // プロフィールフォーム
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  // パスワードフォーム
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // 通知設定フォーム
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      campaignNotifications: true,
      billingNotifications: true,
      dataUsageAlerts: true,
    },
  })

  // プロフィール更新ハンドラー
  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setProfileMessage(null)
      await updateProfile(data)
      setProfileMessage({ type: 'success', text: 'プロフィールを更新しました。' })
    } catch (error) {
      setProfileMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '更新に失敗しました。',
      })
    }
  }

  // パスワード変更ハンドラー
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setPasswordMessage(null)
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setPasswordMessage({ type: 'success', text: 'パスワードを変更しました。' })
      passwordForm.reset()
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '変更に失敗しました。',
      })
    }
  }

  // 通知設定更新ハンドラー
  const onNotificationSubmit = async (data: NotificationFormValues) => {
    try {
      setNotificationMessage(null)
      await updateNotificationSettings(data)
      setNotificationMessage({ type: 'success', text: '通知設定を更新しました。' })
    } catch (error) {
      setNotificationMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '更新に失敗しました。',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* プロフィール更新セクション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">プロフィール</h2>
        {profileMessage && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              profileMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
            }`}
            role="alert"
          >
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-slate-300">
              氏名
            </label>
            <input
              id="profile-name"
              type="text"
              {...profileForm.register('name')}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {profileForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-400">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-slate-300">
              メールアドレス
            </label>
            <input
              id="profile-email"
              type="email"
              {...profileForm.register('email')}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {profileForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-400">{profileForm.formState.errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {profileForm.formState.isSubmitting ? '更新中...' : 'プロフィールを更新'}
          </button>
        </form>
      </div>

      {/* パスワード変更セクション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">パスワード変更</h2>
        {passwordMessage && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              passwordMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
            }`}
            role="alert"
          >
            {passwordMessage.text}
          </div>
        )}
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-slate-300">
              現在のパスワード
            </label>
            <input
              id="current-password"
              type="password"
              {...passwordForm.register('currentPassword')}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-300">
              新しいパスワード
            </label>
            <input
              id="new-password"
              type="password"
              {...passwordForm.register('newPassword')}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
              新しいパスワード（確認）
            </label>
            <input
              id="confirm-password"
              type="password"
              {...passwordForm.register('confirmPassword')}
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {passwordForm.formState.isSubmitting ? '変更中...' : 'パスワードを変更'}
          </button>
        </form>
      </div>

      {/* 通知設定セクション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">通知設定</h2>
        {notificationMessage && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              notificationMessage.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
            }`}
            role="alert"
          >
            {notificationMessage.text}
          </div>
        )}
        <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...notificationForm.register('emailNotifications')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">メール通知を受け取る</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...notificationForm.register('campaignNotifications')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">キャンペーン情報を受け取る</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...notificationForm.register('billingNotifications')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">請求・お支払い通知を受け取る</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...notificationForm.register('dataUsageAlerts')}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">データ使用量アラートを受け取る</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={notificationForm.formState.isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {notificationForm.formState.isSubmitting ? '更新中...' : '通知設定を更新'}
          </button>
        </form>
      </div>
    </div>
  )
}
