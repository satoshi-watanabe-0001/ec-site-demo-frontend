/**
 * @fileoverview お知らせ・ニュースセクションコンポーネント
 * @module components/sections/NewsSection
 *
 * 最新のお知らせやニュースを表示するセクション。
 * 日付、カテゴリラベル、タイトルを含む。
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { NewsItem, NewsCategory } from '@/types'

/**
 * モック用ニュースデータ
 */
const mockNews: NewsItem[] = [
  {
    id: 'news-001',
    title: 'ahamo大盛りオプション 1ヶ月無料キャンペーン開始のお知らせ',
    publishedAt: '2025-02-01',
    category: 'キャンペーン',
    summary: '2025年2月1日より、大盛りオプションを初めてお申し込みのお客様を対象に、1ヶ月分のオプション料金が無料になるキャンペーンを開始いたします。',
    detailUrl: '/news/oomori-campaign',
  },
  {
    id: 'news-002',
    title: 'iPhone 16シリーズ 取り扱い開始のお知らせ',
    publishedAt: '2025-01-20',
    category: '端末',
    summary: 'ahamoにてiPhone 16、iPhone 16 Pro、iPhone 16 Pro Maxの取り扱いを開始いたしました。',
    detailUrl: '/news/iphone-16-launch',
  },
  {
    id: 'news-003',
    title: 'システムメンテナンスのお知らせ（2025年2月15日）',
    publishedAt: '2025-01-15',
    category: 'メンテナンス',
    summary: '2025年2月15日（土）午前2時〜午前6時の間、システムメンテナンスを実施いたします。',
    detailUrl: '/news/maintenance-202502',
  },
  {
    id: 'news-004',
    title: '海外ローミング対象エリア追加のお知らせ',
    publishedAt: '2025-01-10',
    category: 'サービス',
    summary: '2025年1月より、海外ローミング対象エリアに新たに5カ国が追加されました。',
    detailUrl: '/news/roaming-expansion',
  },
  {
    id: 'news-005',
    title: 'dポイント還元率アップキャンペーン実施中',
    publishedAt: '2025-01-05',
    category: 'キャンペーン',
    summary: 'dカード GOLDでahamo料金をお支払いいただくと、通常10%のところ15%還元になるキャンペーンを実施中です。',
    detailUrl: '/news/dpoint-campaign',
  },
]

/**
 * カテゴリの色を取得
 */
function getCategoryColor(category: NewsCategory): string {
  const colors: Record<NewsCategory, string> = {
    お知らせ: 'bg-gray-100 text-gray-700',
    キャンペーン: 'bg-orange-100 text-orange-700',
    メンテナンス: 'bg-yellow-100 text-yellow-700',
    新機能: 'bg-purple-100 text-purple-700',
    重要: 'bg-red-100 text-red-700',
    端末: 'bg-blue-100 text-blue-700',
    サービス: 'bg-green-100 text-green-700',
  }
  return colors[category]
}

/**
 * 日付をフォーマット
 */
function formatNewsDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * ニュースアイテムのProps
 */
interface NewsItemCardProps {
  news: NewsItem
}

/**
 * ニュースアイテムコンポーネント
 */
function NewsItemCard({ news }: NewsItemCardProps): React.ReactElement {
  return (
    <article
      className="group border-b border-gray-200 last:border-b-0 py-4 first:pt-0 last:pb-0"
      aria-labelledby={`news-${news.id}-title`}
    >
      <Link href={news.detailUrl} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
          <time
            dateTime={news.publishedAt}
            className="text-sm text-gray-500 flex-shrink-0"
          >
            {formatNewsDate(news.publishedAt)}
          </time>
          <span
            className={cn(
              'inline-block text-xs font-medium px-2 py-1 rounded w-fit',
              getCategoryColor(news.category)
            )}
          >
            {news.category}
          </span>
        </div>

        <h3
          id={`news-${news.id}-title`}
          className="text-base md:text-lg font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2"
        >
          {news.title}
        </h3>

        {news.summary && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 hidden md:block">
            {news.summary}
          </p>
        )}
      </Link>
    </article>
  )
}

/**
 * お知らせ・ニュースセクションコンポーネント
 *
 * @returns お知らせ・ニュースセクション要素
 */
export function NewsSection(): React.ReactElement {
  const news = mockNews

  return (
    <section className="py-16 md:py-24 bg-gray-50" aria-labelledby="news-section-title">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="news-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            お知らせ・ニュース
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ahamoからの最新情報をお届けします。
          </p>
        </header>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="divide-y divide-gray-200">
            {news.map((item) => (
              <NewsItemCard key={item.id} news={item} />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/news"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-600 bg-transparent hover:bg-slate-700 hover:text-white h-11 rounded-md px-8"
          >
            すべてのお知らせを見る
          </Link>
        </div>
      </div>
    </section>
  )
}
