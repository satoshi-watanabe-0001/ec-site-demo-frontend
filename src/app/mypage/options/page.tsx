'use client'

/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * オプションサービスの追加・解除を行うページ。
 */

import { OptionManager } from '@/components/account/OptionManager'

/**
 * オプション管理ページコンポーネント
 */
export default function OptionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">オプション管理</h1>
      <OptionManager />
    </div>
  )
}
