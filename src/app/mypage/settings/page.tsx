/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * EC-278: アカウント設定ページ。
 * プロフィール編集、パスワード変更、通知設定を管理。
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences'
import {
  updateProfile,
  changePassword,
  updateNotificationPreferences,
} from '@/services/mypageService'
import type { ProfileUpdateRequest, PasswordChangeRequest, NotificationPreferences } from '@/types'

export default function SettingsPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { data: notifPrefs } = useNotificationPreferences(isAuthenticated)

  const [profileName, setProfileName] = React.useState('')
  const [profileEmail, setProfileEmail] = React.useState('')
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [emailNotification, setEmailNotification] = React.useState(true)
  const [campaignNotification, setCampaignNotification] = React.useState(true)
  const [billingNotification, setBillingNotification] = React.useState(true)
  const [dataUsageAlert, setDataUsageAlert] = React.useState(true)
  const [dataUsageAlertThreshold, setDataUsageAlertThreshold] = React.useState(80)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
    }
  }, [user])

  React.useEffect(() => {
    if (notifPrefs) {
      setEmailNotification(notifPrefs.emailNotification)
      setCampaignNotification(notifPrefs.campaignNotification)
      setBillingNotification(notifPrefs.billingNotification)
      setDataUsageAlert(notifPrefs.dataUsageAlert)
      setDataUsageAlertThreshold(notifPrefs.dataUsageAlertThreshold)
    }
  }, [notifPrefs])

  const handleProfileUpdate = async () => {
    setIsSubmitting(true)
    setMessage(null)
    try {
      const request: ProfileUpdateRequest = {
        name: profileName,
        email: profileEmail,
      }
      const result = await updateProfile(request)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '更新に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '新しいパスワードが一致しません。' })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'パスワードは8文字以上で入力してください。' })
      return
    }
    setIsSubmitting(true)
    setMessage(null)
    try {
      const request: PasswordChangeRequest = {
        currentPassword,
        newPassword,
      }
      const result = await changePassword(request)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '変更に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsSubmitting(true)
    setMessage(null)
    try {
      const request: NotificationPreferences = {
        emailNotification,
        campaignNotification,
        billingNotification,
        dataUsageAlert,
        dataUsageAlertThreshold,
      }
      const result = await updateNotificationPreferences(request)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '更新に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">各種設定</h1>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">プロフィール</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="block text-sm text-gray-600 mb-1">
                  表示名
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm text-gray-600 mb-1">
                  メールアドレス
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleProfileUpdate}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                プロフィールを更新
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">パスワード変更</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm text-gray-600 mb-1">
                  現在のパスワード
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm text-gray-600 mb-1">
                  新しいパスワード
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm text-gray-600 mb-1">
                  新しいパスワード（確認）
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                パスワードを変更
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">通知設定</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">メール通知</span>
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={e => setEmailNotification(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">キャンペーン通知</span>
                <input
                  type="checkbox"
                  checked={campaignNotification}
                  onChange={e => setCampaignNotification(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">請求通知</span>
                <input
                  type="checkbox"
                  checked={billingNotification}
                  onChange={e => setBillingNotification(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">データ使用量アラート</span>
                <input
                  type="checkbox"
                  checked={dataUsageAlert}
                  onChange={e => setDataUsageAlert(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              {dataUsageAlert && (
                <div>
                  <label htmlFor="threshold" className="block text-sm text-gray-600 mb-1">
                    アラート閾値: {dataUsageAlertThreshold}%
                  </label>
                  <input
                    id="threshold"
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={dataUsageAlertThreshold}
                    onChange={e => setDataUsageAlertThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={handleNotificationUpdate}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                通知設定を更新
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
