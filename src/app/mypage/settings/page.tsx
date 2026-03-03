/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * EC-278: アカウント設定画面。
 * プロフィール編集、パスワード変更、通知設定を提供。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { User, Lock, Bell, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UserProfile, NotificationSettings } from '@/types/account'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * アカウント設定ページコンポーネント
 *
 * @returns アカウント設定ページ要素
 */
export default function SettingsPage(): React.ReactElement {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // パスワード変更フォーム
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, notifRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/account/profile`),
          fetch(`${BASE_URL}/api/v1/account/notification-settings`),
        ])
        if (profileRes.ok) setProfile(await profileRes.json())
        if (notifRes.ok) setNotificationSettings(await notifRes.json())
      } catch (error) {
        console.error('設定情報の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  /**
   * メッセージを表示して自動クリア
   */
  const showMessage = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMessage(message)
      setErrorMessage('')
    } else {
      setErrorMessage(message)
      setSuccessMessage('')
    }
    setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 5000)
  }

  /**
   * プロフィール保存
   */
  const handleSaveProfile = async () => {
    if (!profile) return
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          address: profile.address,
        }),
      })
      if (res.ok) {
        showMessage('success', 'プロフィールを更新しました')
      } else {
        showMessage('error', 'プロフィールの更新に失敗しました')
      }
    } catch {
      showMessage('error', 'ネットワークエラーが発生しました')
    }
  }

  /**
   * パスワード変更
   */
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showMessage('error', '新しいパスワードが一致しません')
      return
    }
    if (newPassword.length < 8) {
      showMessage('error', 'パスワードは8文字以上で入力してください')
      return
    }
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        showMessage('success', 'パスワードを変更しました')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        showMessage('error', data.message || 'パスワードの変更に失敗しました')
      }
    } catch {
      showMessage('error', 'ネットワークエラーが発生しました')
    }
  }

  /**
   * 通知設定保存
   */
  const handleSaveNotifications = async () => {
    if (!notificationSettings) return
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/notification-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings),
      })
      if (res.ok) {
        showMessage('success', '通知設定を更新しました')
      } else {
        showMessage('error', '通知設定の更新に失敗しました')
      }
    } catch {
      showMessage('error', 'ネットワークエラーが発生しました')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile' as const, label: 'プロフィール', icon: User },
    { id: 'password' as const, label: 'パスワード変更', icon: Lock },
    { id: 'notifications' as const, label: '通知設定', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">アカウント設定</h1>
        <p className="text-slate-400 mt-1">アカウント情報の確認・変更ができます</p>
      </div>

      {/* メッセージ表示 */}
      {successMessage && (
        <div
          className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-4"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300 text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div
          className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg p-4"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* タブナビゲーション */}
      <div
        className="flex border-b border-slate-700 overflow-x-auto"
        role="tablist"
        aria-label="設定カテゴリ"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* プロフィール編集タブ */}
      {activeTab === 'profile' && profile && (
        <div id="panel-profile" role="tabpanel" className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">プロフィール情報</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-slate-400 mb-1">
                名前
              </label>
              <Input
                id="name"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-400 mb-1">
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-slate-400 mb-1">
                電話番号
              </label>
              <Input
                id="phone"
                value={profile.phoneNumber}
                onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm text-slate-400 mb-1">
                生年月日
              </label>
              <Input
                id="dob"
                value={profile.dateOfBirth}
                disabled
                className="bg-slate-700/50 border-slate-600 text-slate-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 mt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">住所</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal" className="block text-sm text-slate-400 mb-1">
                  郵便番号
                </label>
                <Input
                  id="postal"
                  value={profile.address.postalCode}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, postalCode: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label htmlFor="prefecture" className="block text-sm text-slate-400 mb-1">
                  都道府県
                </label>
                <Input
                  id="prefecture"
                  value={profile.address.prefecture}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, prefecture: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm text-slate-400 mb-1">
                  市区町村
                </label>
                <Input
                  id="city"
                  value={profile.address.city}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, city: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm text-slate-400 mb-1">
                  番地
                </label>
                <Input
                  id="street"
                  value={profile.address.street}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="building" className="block text-sm text-slate-400 mb-1">
                  建物名・部屋番号
                </label>
                <Input
                  id="building"
                  value={profile.address.building || ''}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      address: { ...profile.address, building: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              保存する
            </Button>
          </div>
        </div>
      )}

      {/* パスワード変更タブ */}
      {activeTab === 'password' && (
        <div id="panel-password" role="tabpanel" className="bg-slate-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">パスワード変更</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm text-slate-400 mb-1">
                現在のパスワード
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm text-slate-400 mb-1">
                新しいパスワード
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="8文字以上"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-slate-400 mb-1">
                新しいパスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleChangePassword}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                <Lock className="h-4 w-4 mr-2" />
                パスワードを変更
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 通知設定タブ */}
      {activeTab === 'notifications' && (
        <div
          id="panel-notifications"
          role="tabpanel"
          className="bg-slate-800 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white mb-4">通知設定</h2>
          {!notificationSettings ? (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">通知設定を読み込んでいます...</p>
              <Button
                onClick={async () => {
                  // デフォルト値で初期化
                  setNotificationSettings({
                    emailNotification: true,
                    smsNotification: false,
                    pushNotification: true,
                    campaignInfo: true,
                    billingNotification: true,
                    dataUsageAlert: true,
                    dataUsageAlertThreshold: 80,
                  })
                }}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                デフォルト設定を使用
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key: 'emailNotification' as const, label: 'メール通知' },
                { key: 'smsNotification' as const, label: 'SMS通知' },
                { key: 'pushNotification' as const, label: 'プッシュ通知' },
                { key: 'campaignInfo' as const, label: 'キャンペーン情報' },
                { key: 'billingNotification' as const, label: '請求通知' },
                { key: 'dataUsageAlert' as const, label: 'データ使用量アラート' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <span className="text-slate-300">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notificationSettings[key]}
                    aria-label={label}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings[key] ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                    onClick={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        [key]: !notificationSettings[key],
                      })
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}

              {notificationSettings.dataUsageAlert && (
                <div className="border-t border-slate-700 pt-4">
                  <label htmlFor="threshold" className="block text-sm text-slate-400 mb-2">
                    データ使用量アラートしきい値: {notificationSettings.dataUsageAlertThreshold}%
                  </label>
                  <input
                    id="threshold"
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={notificationSettings.dataUsageAlertThreshold}
                    onChange={e =>
                      setNotificationSettings({
                        ...notificationSettings,
                        dataUsageAlertThreshold: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  通知設定を保存
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
