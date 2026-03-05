/**
 * @fileoverview 設定フォームコンポーネント
 * @module components/mypage/SettingsForm
 *
 * プロフィール更新、パスワード変更、通知設定のフォーム。
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAccountInfo } from '@/hooks'
import { updateProfile, changePassword, updateNotificationSettings } from '@/services/accountService'

/**
 * プロフィール更新のバリデーションスキーマ
 */
const profileSchema = z.object({
  name: z.string().min(1, '氏名を入力してください'),
  email: z.string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
  phoneNumber: z.string().min(1, '電話番号を入力してください'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

/**
 * パスワード変更のバリデーションスキーマ
 */
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
    newPassword: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string().min(1, 'パスワード（確認）を入力してください'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * 設定フォームコンポーネント
 *
 * @returns 設定フォーム要素
 */
export function SettingsForm(): React.ReactElement {
  const { data: accountInfo } = useAccountInfo()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 通知設定の状態
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotification: true,
    pushNotification: true,
    campaignNotification: false,
    billingNotification: true,
  })

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: accountInfo?.customer.name ?? '',
      email: accountInfo?.customer.email ?? '',
      phoneNumber: accountInfo?.customer.phoneNumber ?? '',
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

  const handleProfileSubmit = async (data: ProfileFormValues): Promise<void> => {
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      await updateProfile(data)
      setSuccessMessage('プロフィールを更新しました。')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '更新に失敗しました')
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormValues): Promise<void> => {
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setSuccessMessage('パスワードを変更しました。')
      passwordForm.reset()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '変更に失敗しました')
    }
  }

  const handleNotificationSettingsSubmit = async (): Promise<void> => {
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      await updateNotificationSettings({ settings: notificationSettings })
      setSuccessMessage('通知設定を更新しました。')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '更新に失敗しました')
    }
  }

  const tabs = [
    { id: 'profile' as const, label: 'プロフィール' },
    { id: 'password' as const, label: 'パスワード変更' },
    { id: 'notifications' as const, label: '通知設定' },
  ]

  return (
    <div>
      {/* タブナビゲーション */}
      <div className="mb-6 flex border-b border-slate-700" role="tablist" aria-label="設定タブ">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-slate-400 hover:text-slate-300'
            }`}
            onClick={() => {
              setActiveTab(tab.id)
              setSuccessMessage(null)
              setErrorMessage(null)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* メッセージ */}
      {successMessage && (
        <div className="mb-4 rounded-md bg-emerald-500/10 border border-emerald-500 p-4 text-emerald-400 text-sm" role="status">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm" role="alert">
          {errorMessage}
        </div>
      )}

      {/* プロフィールフォーム */}
      {activeTab === 'profile' && (
        <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                氏名
              </label>
              <Input
                id="name"
                type="text"
                error={!!profileForm.formState.errors.name}
                errorMessage={profileForm.formState.errors.name?.message}
                aria-label="氏名"
                {...profileForm.register('name')}
              />
            </div>
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
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300">
                電話番号
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                error={!!profileForm.formState.errors.phoneNumber}
                errorMessage={profileForm.formState.errors.phoneNumber?.message}
                aria-label="電話番号"
                {...profileForm.register('phoneNumber')}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3">
              プロフィールを更新
            </Button>
          </form>
        </div>
      )}

      {/* パスワード変更フォーム */}
      {activeTab === 'password' && (
        <div id="panel-password" role="tabpanel" aria-labelledby="tab-password">
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300">
                現在のパスワード
              </label>
              <Input
                id="currentPassword"
                type="password"
                error={!!passwordForm.formState.errors.currentPassword}
                errorMessage={passwordForm.formState.errors.currentPassword?.message}
                aria-label="現在のパスワード"
                {...passwordForm.register('currentPassword')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
                新しいパスワード
              </label>
              <Input
                id="newPassword"
                type="password"
                error={!!passwordForm.formState.errors.newPassword}
                errorMessage={passwordForm.formState.errors.newPassword?.message}
                aria-label="新しいパスワード"
                {...passwordForm.register('newPassword')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                新しいパスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                type="password"
                error={!!passwordForm.formState.errors.confirmPassword}
                errorMessage={passwordForm.formState.errors.confirmPassword?.message}
                aria-label="新しいパスワード（確認）"
                {...passwordForm.register('confirmPassword')}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3">
              パスワードを変更
            </Button>
          </form>
        </div>
      )}

      {/* 通知設定 */}
      {activeTab === 'notifications' && (
        <div id="panel-notifications" role="tabpanel" aria-labelledby="tab-notifications">
          <div className="space-y-4">
            {[
              { key: 'emailNotification' as const, label: 'メール通知', description: '請求確定やお知らせをメールで受信します' },
              { key: 'pushNotification' as const, label: 'プッシュ通知', description: 'アプリのプッシュ通知を受信します' },
              { key: 'campaignNotification' as const, label: 'キャンペーン通知', description: 'キャンペーンやお得な情報を受信します' },
              { key: 'billingNotification' as const, label: '請求通知', description: '請求額確定時に通知を受信します' },
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between rounded-lg border border-slate-700 p-4">
                <div>
                  <p className="text-sm font-medium text-white">{setting.label}</p>
                  <p className="text-xs text-slate-400">{setting.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings[setting.key]}
                  aria-label={setting.label}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    notificationSettings[setting.key] ? 'bg-primary' : 'bg-slate-600'
                  }`}
                  onClick={() =>
                    setNotificationSettings(prev => ({
                      ...prev,
                      [setting.key]: !prev[setting.key],
                    }))
                  }
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      notificationSettings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
              onClick={handleNotificationSettingsSubmit}
            >
              通知設定を保存
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
