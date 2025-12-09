/**
 * @fileoverview ログインページ
 * @module app/login/page
 *
 * ユーザーログイン機能を提供するページ。
 * ログインフォームを表示し、認証成功時にマイページへリダイレクト。
 */

import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

/**
 * ページメタデータ
 */
export const metadata: Metadata = {
  title: 'ログイン | ahamo',
  description: 'ahamoアカウントにログインして、マイページにアクセスしましょう。',
}

/**
 * ログインページコンポーネント
 *
 * ログインフォームを中央に配置したレスポンシブなページ。
 * モバイル、タブレット、デスクトップに対応。
 *
 * @returns ログインページ要素
 */
export default function LoginPage(): React.ReactElement {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ログイン</h1>
          <p className="text-slate-400">
            ahamoアカウントにログインしてください
          </p>
        </div>

        {/* ログインフォームカード */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
