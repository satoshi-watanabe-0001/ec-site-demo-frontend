/**
 * @fileoverview ログインページ
 * @module app/login/page
 *
 * ユーザーログイン画面。
 * メールアドレスとパスワードによる認証を提供。
 * 過去ログインアカウントの選択機能を含む。
 */

'use client'

import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RecentAccountsList } from '@/components/auth/RecentAccountsList'

/**
 * ログインページコンポーネント
 *
 * @returns ログインページ要素
 */
export default function LoginPage(): React.ReactElement {
  const [selectedEmail, setSelectedEmail] = useState<string>('')

  const handleSelectAccount = (email: string): void => {
    setSelectedEmail(email)
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        {/* 左側: ログインフォーム */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ログイン</h1>
            <p className="text-slate-400">ahamoアカウントにログイン</p>
          </div>

          {/* ログインフォーム */}
          <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
            <LoginForm selectedEmail={selectedEmail} />
          </div>
        </div>

        {/* 右側: 過去ログインアカウント一覧 */}
        <div className="lg:w-80">
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <RecentAccountsList onSelectAccount={handleSelectAccount} />
          </div>
        </div>
      </div>
    </main>
  )
}
