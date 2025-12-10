/**
 * @fileoverview ログインページ
 * @module app/login/page
 *
 * ユーザーログイン画面。
 * メールアドレスとパスワードによる認証を提供。
 */

import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

/**
 * ログインページのメタデータ
 */
export const metadata = {
  title: 'ログイン | ahamo',
  description: 'ahamoアカウントにログインして、マイページにアクセスしましょう。',
}

/**
 * ログインページコンポーネント
 *
 * @returns ログインページ要素
 */
export default function LoginPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ログイン</h1>
          <p className="text-slate-400">ahamoアカウントにログイン</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
