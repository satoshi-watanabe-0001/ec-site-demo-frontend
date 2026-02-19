/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import {
  getAccountInfo,
  updateContact,
  changePassword,
  updateNotificationSettings,
} from '@/services/AccountApiService'
import type { AccountInfo, NotificationSettings } from '@/types'

export default function SettingsPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [isEditingContact, setIsEditingContact] = useState(false)
  const [editEmail, setEditEmail] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editPostalCode, setEditPostalCode] = useState('')

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAccountInfo()
        setAccount(data)
        setEditEmail(data.email)
        setEditAddress(data.address)
        setEditPostalCode(data.postalCode)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router])

  const handleContactUpdate = async () => {
    try {
      setSuccessMessage(null)
      const result = await updateContact({
        email: editEmail,
        address: editAddress,
        postalCode: editPostalCode,
      })
      if (result.success) {
        setSuccessMessage(result.message)
        setIsEditingContact(false)
        if (account) {
          setAccount({ ...account, email: editEmail, address: editAddress, postalCode: editPostalCode })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました')
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('パスワードは8文字以上で入力してください')
      return
    }

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (result.success) {
        setSuccessMessage(result.message)
        setIsChangingPassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'パスワードの変更に失敗しました')
    }
  }

  const handleNotificationToggle = async (key: keyof NotificationSettings) => {
    if (!account) return

    try {
      const result = await updateNotificationSettings({
        [key]: !account.notificationSettings[key],
      })
      if (result.success) {
        setAccount({
          ...account,
          notificationSettings: result.settings,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知設定の更新に失敗しました')
    }
  }

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-700 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!account) return <div />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/mypage" className="text-cyan-400 hover:text-cyan-300 text-sm">
          ← マイページに戻る
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">アカウント設定</h1>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">基本情報</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 block">お名前</span>
              <span className="text-white mt-1 block">{account.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">生年月日</span>
              <span className="text-white mt-1 block">{new Date(account.dateOfBirth).toLocaleDateString('ja-JP')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">電話番号</span>
              <span className="text-white mt-1 block">{account.phoneNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">登録日</span>
              <span className="text-white mt-1 block">{new Date(account.registeredAt).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">連絡先情報</h2>
            {!isEditingContact && (
              <button
                onClick={() => setIsEditingContact(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                編集する
              </button>
            )}
          </div>

          {isEditingContact ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-email" className="text-slate-400 text-sm block mb-1">メールアドレス</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="edit-postal" className="text-slate-400 text-sm block mb-1">郵便番号</label>
                <input
                  id="edit-postal"
                  type="text"
                  value={editPostalCode}
                  onChange={e => setEditPostalCode(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="edit-address" className="text-slate-400 text-sm block mb-1">住所</label>
                <input
                  id="edit-address"
                  type="text"
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleContactUpdate}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                >
                  保存する
                </button>
                <button
                  onClick={() => {
                    setIsEditingContact(false)
                    setEditEmail(account.email)
                    setEditAddress(account.address)
                    setEditPostalCode(account.postalCode)
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block">メールアドレス</span>
                <span className="text-white mt-1 block">{account.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">郵便番号</span>
                <span className="text-white mt-1 block">{account.postalCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block">住所</span>
                <span className="text-white mt-1 block">{account.address}</span>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">パスワード変更</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                変更する
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              {passwordError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                  <p className="text-red-400 text-sm">{passwordError}</p>
                </div>
              )}
              <div>
                <label htmlFor="current-password" className="text-slate-400 text-sm block mb-1">現在のパスワード</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="text-slate-400 text-sm block mb-1">新しいパスワード</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-slate-400 text-sm block mb-1">新しいパスワード（確認）</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                >
                  パスワードを変更
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError(null)
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">セキュリティのため、定期的なパスワード変更をおすすめします。</p>
          )}
        </section>

        <section className="rounded-xl bg-slate-800 p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">通知設定</h2>
          <div className="space-y-4">
            {([
              { key: 'email' as const, label: 'メール通知', description: '重要なお知らせをメールで受信' },
              { key: 'sms' as const, label: 'SMS通知', description: '重要なお知らせをSMSで受信' },
              { key: 'push' as const, label: 'プッシュ通知', description: 'アプリのプッシュ通知を受信' },
              { key: 'marketing' as const, label: 'マーケティング通知', description: 'キャンペーンやお得な情報を受信' },
            ]).map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <span className="text-white text-sm font-medium">{item.label}</span>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    account.notificationSettings[item.key] ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                  role="switch"
                  aria-checked={account.notificationSettings[item.key]}
                  aria-label={item.label}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      account.notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
