/**
 * @fileoverview iPhoneキャンペーンバナーコンポーネント
 * @module components/product/IPhoneCampaignBanner
 *
 * PBI-DP-002: iPhoneカテゴリページ閲覧機能 (EC-269)
 *
 * iPhoneカテゴリページ上部にキャンペーン情報を表示するバナー。
 */

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * iPhoneキャンペーンバナーのProps型定義
 */
interface IPhoneCampaignBannerProps {
  /** 追加のCSSクラス */
  className?: string
}

/**
 * iPhoneキャンペーンバナーコンポーネント
 *
 * iPhoneカテゴリページ上部にキャンペーン情報を表示。
 * 割引情報と期間を視覚的に強調。
 *
 * @param props - バナーのプロパティ
 * @returns キャンペーンバナー要素
 */
export function IPhoneCampaignBanner({
  className,
}: IPhoneCampaignBannerProps): React.ReactElement {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6 shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl" role="img" aria-label="キャンペーン">
          🎉
        </span>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">iPhone特別キャンペーン実施中！</h2>
          <p className="text-sm opacity-90">対象機種が最大15,000円引き</p>
        </div>
        <span className="text-3xl" role="img" aria-label="キャンペーン">
          🎉
        </span>
      </div>
    </div>
  )
}
