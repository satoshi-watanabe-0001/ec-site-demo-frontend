/**
 * @fileoverview iPhoneカテゴリページ
 * @module app/products/iphone/page
 *
 * PBI-DP-002: iPhoneカテゴリページ閲覧機能 (EC-269)
 *
 * iPhone製品をグリッド形式で表示するページ。
 * ストレージオプション、カラーバリエーション、価格情報、
 * キャンペーン情報、ドコモオンラインショップリンクを含む。
 */

import React from 'react'
import type { Metadata } from 'next'
import { IPhoneProductGrid } from '@/components/product/IPhoneProductGrid'
import { IPhoneCampaignBanner } from '@/components/product/IPhoneCampaignBanner'

/**
 * ページメタデータ
 */
export const metadata: Metadata = {
  title: 'iPhone | ahamo',
  description:
    'ahamoで取り扱っているiPhone製品一覧。最新のiPhoneからお得なモデルまで、豊富なラインナップをご覧いただけます。',
}

/**
 * iPhoneカテゴリページコンポーネント
 *
 * iPhone製品をグリッド形式で表示するページ。以下の機能を提供:
 * - キャンペーンバナー表示
 * - iPhone製品のグリッド表示（3カラムレスポンシブ）
 * - ストレージオプション、カラーバリエーション表示
 * - 価格情報（通常価格、キャンペーン価格、月額料金）
 * - ドコモオンラインショップリンク
 *
 * @returns iPhoneカテゴリページ要素
 */
export default function IPhoneCategoryPage(): React.ReactElement {
  return (
    <div className="min-h-screen relative">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">iPhone</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Apple製の高品質なスマートフォン。最新のiOSと優れたカメラ性能。
            ahamoで使える最新iPhoneをご紹介します。
          </p>
        </div>

        {/* キャンペーンバナー */}
        <IPhoneCampaignBanner className="mb-8" />

        {/* iPhone製品グリッド */}
        <IPhoneProductGrid />

        {/* ドコモオンラインショップリンク */}
        <div className="text-center mt-12">
          <a
            href="https://onlineshop.smt.docomo.ne.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-red-600 text-white hover:bg-red-700 h-11 px-8"
          >
            ドコモオンラインショップで購入
          </a>
        </div>
      </div>
    </div>
  )
}
