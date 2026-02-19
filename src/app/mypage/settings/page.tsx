'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import {
  getAccount,
  updateContact,
  changePassword,
  updateNotificationSettings,
} from '@/services/AccountApiService'
import type { AccountInfo, NotificationSettings } from '@/types'
import {
  ContactInfoForm,
  PasswordChangeForm,
  NotificationSettingsForm,
} from '@/components/mypage/Settings'

export default function SettingsPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchAccount = async () => {
      try {
        const data = await getAccount()
        setAccount(data.account)
      } catch {
        setError('アカウント情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccount()
  }, [isAuthenticated, router])

  if (!isAuthenticated) return <div />

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8" data-testid="settings-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-48" />
          <div className="h-64 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
          <div className="h-48 bg-slate-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !account) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg" data-testid="settings-error">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    )
  }

  const handleContactSubmit = async (data: { email: string; phone: string; address: string }) => {
    await updateContact({
      email: data.email,
      phoneNumber: data.phone,
      address: data.address,
    })
  }

  const handlePasswordSubmit = async (data: { currentPassword: string; newPassword: string }) => {
    await changePassword(data)
  }

  const handleNotificationSubmit = async (settings: NotificationSettings) => {
    await updateNotificationSettings(settings)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="settings-page">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-2xl font-bold text-white">アカウント設定</h1>
      </div>
      <div className="space-y-6">
        <ContactInfoForm
          initialEmail={account.contact.email}
          initialPhone={account.contact.phoneNumber}
          initialAddress={account.contact.address}
          onSubmit={handleContactSubmit}
        />
        <PasswordChangeForm onSubmit={handlePasswordSubmit} />
        <NotificationSettingsForm
          initialSettings={account.notificationSettings}
          onSubmit={handleNotificationSubmit}
        />
      </div>
    </div>
  )
}
