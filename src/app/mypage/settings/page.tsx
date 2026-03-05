/**
 * @fileoverview アカウント設定ページ
 * @module app/mypage/settings/page
 *
 * プロフィール更新、パスワード変更、通知設定を管理するページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { SettingsForm } from '@/components/mypage'

/**
 * アカウント設定ページコンポーネント
 *
 * @returns アカウント設定ページ要素
 */
export default function SettingsPage(): React.ReactElement {
  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">設定</h1>
      </div>

      <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
        <SettingsForm />
      </div>
    </div>
  )
}
