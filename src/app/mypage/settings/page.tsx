/**
 * @fileoverview 設定ページ
 * @module app/mypage/settings/page
 *
 * 連絡先情報の編集、パスワード変更、通知設定を管理するページ。
 * React Hook Form + Zodによるバリデーションを使用。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  updateProfile,
  changePassword,
  getNotificationSettings,
  updateNotificationSettings,
  getContractInfo,
} from '@/services/accountService'
import type { NotificationSettings } from '@/types'

/**
 * 連絡先情報のバリデーションスキーマ
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
    .regex(/^\d{3}-?\d{4}$/, '有効な郵便番号を入力してください'),
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
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'パスワードには英字と数字を含めてください'),
    confirmPassword: z.string().min(1, 'パスワード（確認用）を入力してください'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * 設定ページコンポーネント
 *
 * @returns 設定ページ要素
 */
export default function SettingsPage(): React.ReactElement {
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(
    null
  )
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null)
  const [notificationError, setNotificationError] = useState<string | null>(null)
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isNotificationSubmitting, setIsNotificationSubmitting] = useState(false)
  const [showConfirmProfile, setShowConfirmProfile] = useState(false)
  const [pendingProfileData, setPendingProfileData] = useState<ProfileFormValues | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      postalCode: '',
      address: '',
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

  // 初期データの取得
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [contractData, notifSettings] = await Promise.all([
          getContractInfo(),
          getNotificationSettings(),
        ])
        profileForm.reset({
          email: contractData.email,
          phoneNumber: contractData.phoneNumber,
          postalCode: contractData.postalCode,
          address: contractData.address,
        })
        setNotificationSettings(notifSettings)
      } catch {
        setProfileError('データの取得に失敗しました。')
      }
    }
    fetchData()
  }, [profileForm])

  /**
   * プロフィール更新の確認画面を表示
   */
  const handleProfilePreSubmit = (data: ProfileFormValues): void => {
    setPendingProfileData(data)
    setShowConfirmProfile(true)
  }

  /**
   * プロフィール更新処理
   */
  const handleProfileSubmit = async (): Promise<void> => {
    if (!pendingProfileData) return
    setIsProfileSubmitting(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const result = await updateProfile(pendingProfileData)
      setProfileSuccess(result.message)
      setShowConfirmProfile(false)
      setPendingProfileData(null)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : '更新に失敗しました。')
      setShowConfirmProfile(false)
    } finally {
      setIsProfileSubmitting(false)
    }
  }

  /**
   * パスワード変更処理
   */
  const handlePasswordSubmit = async (data: PasswordFormValues): Promise<void> => {
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
      setPasswordError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました。')
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  /**
   * 通知設定の切り替え処理
   */
  const handleNotificationToggle = async (
    field: 'emailEnabled' | 'smsEnabled' | string,
    value: boolean
  ): Promise<void> => {
    if (!notificationSettings) return
    setIsNotificationSubmitting(true)
    setNotificationSuccess(null)
    setNotificationError(null)

    let updatedSettings: NotificationSettings

    if (field === 'emailEnabled' || field === 'smsEnabled') {
      updatedSettings = {
        ...notificationSettings,
        [field]: value,
      }
    } else {
      // カテゴリの切り替え
      updatedSettings = {
        ...notificationSettings,
        categories: notificationSettings.categories.map(cat =>
          cat.categoryId === field ? { ...cat, enabled: value } : cat
        ),
      }
    }

    try {
      const result = await updateNotificationSettings(updatedSettings)
      setNotificationSettings(updatedSettings)
      setNotificationSuccess(result.message)
    } catch (err) {
      setNotificationError(err instanceof Error ? err.message : '通知設定の更新に失敗しました。')
    } finally {
      setIsNotificationSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">設定</h2>

      {/* 連絡先情報 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="profile-settings-title">
        <h3 id="profile-settings-title" className="text-lg font-bold text-white mb-4">
          連絡先情報
        </h3>

        {profileSuccess && (
          <div
            className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm mb-4"
            role="status"
          >
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm mb-4"
            role="alert"
          >
            {profileError}
          </div>
        )}

        {/* 確認画面 */}
        {showConfirmProfile && pendingProfileData && (
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 space-y-3">
            <p className="text-white font-medium">以下の内容で更新します。よろしいですか？</p>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-slate-400 w-32">メールアドレス:</dt>
                <dd className="text-white">{pendingProfileData.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-400 w-32">電話番号:</dt>
                <dd className="text-white">{pendingProfileData.phoneNumber}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-400 w-32">郵便番号:</dt>
                <dd className="text-white">{pendingProfileData.postalCode}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-400 w-32">住所:</dt>
                <dd className="text-white">{pendingProfileData.address}</dd>
              </div>
            </dl>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleProfileSubmit}
                disabled={isProfileSubmitting}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isProfileSubmitting ? '更新中...' : '更新する'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmProfile(false)
                  setPendingProfileData(null)
                }}
              >
                キャンセル
              </Button>
            </div>
          </div>
        )}

        {!showConfirmProfile && (
          <form
            onSubmit={profileForm.handleSubmit(handleProfilePreSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="settings-email" className="block text-sm font-medium text-slate-300">
                メールアドレス
              </label>
              <Input
                id="settings-email"
                type="email"
                error={!!profileForm.formState.errors.email}
                errorMessage={profileForm.formState.errors.email?.message}
                aria-label="メールアドレス"
                {...profileForm.register('email')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-phone" className="block text-sm font-medium text-slate-300">
                電話番号
              </label>
              <Input
                id="settings-phone"
                type="tel"
                error={!!profileForm.formState.errors.phoneNumber}
                errorMessage={profileForm.formState.errors.phoneNumber?.message}
                aria-label="電話番号"
                {...profileForm.register('phoneNumber')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-postal" className="block text-sm font-medium text-slate-300">
                郵便番号
              </label>
              <Input
                id="settings-postal"
                type="text"
                error={!!profileForm.formState.errors.postalCode}
                errorMessage={profileForm.formState.errors.postalCode?.message}
                aria-label="郵便番号"
                {...profileForm.register('postalCode')}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="settings-address"
                className="block text-sm font-medium text-slate-300"
              >
                住所
              </label>
              <Input
                id="settings-address"
                type="text"
                error={!!profileForm.formState.errors.address}
                errorMessage={profileForm.formState.errors.address?.message}
                aria-label="住所"
                {...profileForm.register('address')}
              />
            </div>
            <Button
              type="submit"
              disabled={!profileForm.formState.isValid || isProfileSubmitting}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              確認画面へ
            </Button>
          </form>
        )}
      </section>

      {/* パスワード変更 */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="password-settings-title">
        <h3 id="password-settings-title" className="text-lg font-bold text-white mb-4">
          パスワード変更
        </h3>

        {passwordSuccess && (
          <div
            className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm mb-4"
            role="status"
          >
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm mb-4"
            role="alert"
          >
            {passwordError}
          </div>
        )}

        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
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
              aria-label="現在のパスワード"
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
              aria-label="新しいパスワード"
              {...passwordForm.register('newPassword')}
            />
            <p className="text-xs text-slate-500">8文字以上、英字と数字を含めてください</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
              新しいパスワード（確認用）
            </label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              error={!!passwordForm.formState.errors.confirmPassword}
              errorMessage={passwordForm.formState.errors.confirmPassword?.message}
              aria-label="新しいパスワード（確認用）"
              {...passwordForm.register('confirmPassword')}
            />
          </div>
          <Button
            type="submit"
            disabled={!passwordForm.formState.isValid || isPasswordSubmitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isPasswordSubmitting ? '変更中...' : 'パスワードを変更'}
          </Button>
        </form>
      </section>

      {/* 通知設定 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="notification-settings-title"
      >
        <h3 id="notification-settings-title" className="text-lg font-bold text-white mb-4">
          通知設定
        </h3>

        {notificationSuccess && (
          <div
            className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm mb-4"
            role="status"
          >
            {notificationSuccess}
          </div>
        )}
        {notificationError && (
          <div
            className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm mb-4"
            role="alert"
          >
            {notificationError}
          </div>
        )}

        {notificationSettings && (
          <div className="space-y-6">
            {/* メール/SMS通知トグル */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">通知方法</h4>
              <div className="flex items-center justify-between">
                <span className="text-white">メール通知</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.emailEnabled}
                  aria-label="メール通知の切り替え"
                  disabled={isNotificationSubmitting}
                  onClick={() =>
                    handleNotificationToggle('emailEnabled', !notificationSettings.emailEnabled)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.emailEnabled ? 'bg-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">SMS通知</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.smsEnabled}
                  aria-label="SMS通知の切り替え"
                  disabled={isNotificationSubmitting}
                  onClick={() =>
                    handleNotificationToggle('smsEnabled', !notificationSettings.smsEnabled)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.smsEnabled ? 'bg-primary' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.smsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* カテゴリ別通知設定 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">通知カテゴリ</h4>
              {notificationSettings.categories.map(category => (
                <div key={category.categoryId} className="flex items-center justify-between">
                  <span className="text-white">{category.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.enabled}
                      onChange={e =>
                        handleNotificationToggle(category.categoryId, e.target.checked)
                      }
                      disabled={isNotificationSubmitting}
                      className="sr-only peer"
                      aria-label={`${category.name}の通知を切り替え`}
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-checked:bg-primary rounded-full peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
