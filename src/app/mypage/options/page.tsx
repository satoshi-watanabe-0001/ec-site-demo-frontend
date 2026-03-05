/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * オプションサービスの追加・解除を行うページ。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { OptionsManager } from '@/components/mypage'

/**
 * オプション管理ページコンポーネント
 *
 * @returns オプション管理ページ要素
 */
export default function OptionsPage(): React.ReactElement {
  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/mypage" className="text-slate-400 hover:text-white transition-colors">
          ← マイページ
        </Link>
        <h1 className="text-3xl font-bold text-white">オプション管理</h1>
      </div>

      <div className="rounded-lg bg-slate-800 p-6 shadow-xl">
        <OptionsManager />
      </div>
    </div>
  )
}
