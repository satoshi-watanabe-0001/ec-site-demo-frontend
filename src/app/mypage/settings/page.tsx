'use client'

/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * メール・パスワード・通知設定の変更フォームを提供するページ。
 */

import { AccountSettingsForm } from '@/components/account/AccountSettingsForm'

/**
 * アカウント設定ページコンポーネント
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">アカウント設定</h1>
      <AccountSettingsForm />
    </div>
  )
}
