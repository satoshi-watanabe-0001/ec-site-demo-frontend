'use client'

/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * EC-278: アカウント管理機能
 * シナリオ6: アカウント設定変更
 *
 * 連絡先情報、パスワード変更、通知設定を管理するページ。
 */

import { useEffect, useState } from 'react'
import { ContactInfoForm, PasswordChangeForm, NotificationSettings } from '@/components/mypage/settings'
import { useAccountStore } from '@/store/accountStore'
import {
  getAccountProfile,
  updateAccountProfile,
  changePassword,
  getNotificationSettings,
  updateNotificationSettings,
} from '@/services/accountService'
import type { UpdateAccountProfileRequest, ChangePasswordRequest, NotificationSettings as NotificationSettingsType } from '@/types'

/**
 * アカウント設定ページコンポーネント
 *
 * @returns アカウント設定ページ要素
 */
export default function SettingsPage() {
  const { profile, notificationSettings, setProfile, setNotificationSettings, setLoading, isLoading } = useAccountStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true)

      try {
        const [profileRes, settingsRes] = await Promise.all([
          getAccountProfile(),
          getNotificationSettings(),
        ])

        setProfile(profileRes)
        setNotificationSettings(settingsRes)
      } catch (error) {
        console.error('アカウント情報の取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccountData()
  }, [setProfile, setNotificationSettings, setLoading])

  const handleUpdateProfile = async (data: UpdateAccountProfileRequest) => {
    setIsSubmitting(true)
    try {
      const updatedProfile = await updateAccountProfile(data)
      setProfile(updatedProfile)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    setIsSubmitting(true)
    try {
      await changePassword(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateNotificationSettings = async (settings: NotificationSettingsType) => {
    setIsSubmitting(true)
    try {
      const updatedSettings = await updateNotificationSettings(settings)
      setNotificationSettings(updatedSettings)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">アカウント設定</h1>

      <div className="space-y-6">
        <ContactInfoForm
          profile={profile}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateProfile}
        />
        <PasswordChangeForm
          isSubmitting={isSubmitting}
          onSubmit={handleChangePassword}
        />
        <NotificationSettings
          settings={notificationSettings}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateNotificationSettings}
        />
      </div>
    </div>
  )
}
