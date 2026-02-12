/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * 連絡先情報、パスワード、通知設定の変更機能。
 */

'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getAccountSettings, updateAccountSettings } from '@/services/accountService'
import type { UpdateSettingsRequest } from '@/services/accountService'
import { Button } from '@/components/ui/button'

export default function SettingsPage(): React.ReactElement {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [emailNotif, setEmailNotif] = useState(false)
  const [smsNotif, setSmsNotif] = useState(false)
  const [pushNotif, setPushNotif] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['accountSettings'],
    queryFn: () => getAccountSettings('mock-token'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })

  React.useEffect(() => {
    if (data) {
      setEmail(data.email)
      setPhoneNumber(data.phoneNumber)
      setEmailNotif(data.notificationPreferences.email)
      setSmsNotif(data.notificationPreferences.sms)
      setPushNotif(data.notificationPreferences.push)
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (settings: UpdateSettingsRequest) => updateAccountSettings('mock-token', settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountSettings'] })
      setSaveMessage('設定を保存しました')
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setSaveMessage(''), 3000)
    },
    onError: () => {
      setSaveMessage('設定の保存に失敗しました')
      setTimeout(() => setSaveMessage(''), 3000)
    },
  })

  const handleSaveContact = () => {
    updateMutation.mutate({ email, phoneNumber })
  }

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword) return
    updateMutation.mutate({
      password: { current: currentPassword, newPassword },
    })
  }

  const handleSaveNotifications = () => {
    updateMutation.mutate({
      notificationPreferences: {
        email: emailNotif,
        sms: smsNotif,
        push: pushNotif,
      },
    })
  }

  if (!isAuthenticated) {
    return <div />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-700" />
            <div className="h-48 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-900/20 p-6 text-center">
            <p className="text-red-400">データの読み込みに失敗しました。再度お試しください。</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/mypage"
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">アカウント設定</h1>
        </div>

        {saveMessage && (
          <div
            className={`mb-6 rounded-lg p-3 text-sm ${
              saveMessage.includes('失敗')
                ? 'bg-red-900/20 text-red-400'
                : 'bg-green-900/20 text-green-400'
            }`}
            role="alert"
          >
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">連絡先情報</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  電話番号
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSaveContact}
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                連絡先を保存
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">パスワード変更</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  現在のパスワード
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 px-4 py-2 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSavePassword}
                disabled={updateMutation.isPending || !currentPassword || !newPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                パスワードを変更
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">通知設定</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">メール通知</span>
                <button
                  role="switch"
                  aria-checked={emailNotif}
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotif ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotif ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">SMS通知</span>
                <button
                  role="switch"
                  aria-checked={smsNotif}
                  onClick={() => setSmsNotif(!smsNotif)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    smsNotif ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smsNotif ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">プッシュ通知</span>
                <button
                  role="switch"
                  aria-checked={pushNotif}
                  onClick={() => setPushNotif(!pushNotif)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotif ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotif ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              <Button
                onClick={handleSaveNotifications}
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                通知設定を保存
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
