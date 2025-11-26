/**
 * @fileoverview キャンペーン情報セクションコンポーネント
 * @module components/sections/CampaignSection
 *
 * キャンペーンバナーをカルーセル形式で表示するセクション。
 * キーボードアクセシビリティとレスポンシブデザイン対応。
 */

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Campaign } from '@/types'

/**
 * モック用キャンペーンデータ
 */
const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: '5G WELCOME割',
    bannerImageUrl: '/images/campaigns/5g-welcome.png',
    discountSummary: '対象機種が最大22,000円割引',
    discountAmount: 22000,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    category: '新規契約',
    description:
      '他社からの乗り換え（MNP）または新規契約で対象の5G対応スマートフォンをご購入いただくと、機種代金から最大22,000円割引！',
    detailUrl: '/campaigns/5g-welcome',
  },
  {
    id: 'campaign-002',
    name: 'ahamoポイ活',
    bannerImageUrl: '/images/campaigns/point-katsudo.png',
    discountSummary: 'dポイント最大4,000ポイント還元',
    discountAmount: 4000,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    category: 'オプション',
    description:
      'ahamoをご利用中のお客様がd払いをご利用いただくと、dポイントが最大4,000ポイント還元されます。',
    detailUrl: '/campaigns/point-katsudo',
  },
  {
    id: 'campaign-003',
    name: '大盛りオプション実質0円',
    bannerImageUrl: '/images/campaigns/oomori-free.png',
    discountSummary: '大盛りオプション1ヶ月無料',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    category: 'オプション',
    description:
      '初めて大盛りオプションをお申し込みのお客様は、1ヶ月分のオプション料金が無料になります。',
    detailUrl: '/campaigns/oomori-free',
  },
  {
    id: 'campaign-004',
    name: 'Galaxy購入キャンペーン',
    bannerImageUrl: '/images/campaigns/galaxy-campaign.png',
    discountSummary: 'Galaxy購入で5,000ポイント還元',
    discountAmount: 5000,
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    category: '機種変更',
    description:
      'キャンペーン期間中にGalaxyシリーズをご購入いただくと、dポイント5,000ポイントをプレゼント！',
    detailUrl: '/campaigns/galaxy-campaign',
  },
]

/**
 * 日付をフォーマット
 */
function formatCampaignDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * キャンペーンカードのProps
 */
interface CampaignCardProps {
  campaign: Campaign
  isActive: boolean
}

/**
 * キャンペーンカードコンポーネント
 */
function CampaignCard({ campaign, isActive }: CampaignCardProps): React.ReactElement {
  return (
    <article
      className={cn(
        'flex-shrink-0 w-full transition-opacity duration-300',
        isActive ? 'opacity-100' : 'opacity-0 absolute'
      )}
      aria-hidden={!isActive}
      aria-labelledby={`campaign-${campaign.id}-title`}
    >
      <Link href={campaign.detailUrl} className="block group">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 shadow-lg">
          {/* バナー画像エリア */}
          <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 text-center text-white p-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full mb-4">
                {campaign.category}
              </span>
              <h3
                id={`campaign-${campaign.id}-title`}
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
              >
                {campaign.name}
              </h3>
              <p className="text-lg md:text-xl font-semibold">{campaign.discountSummary}</p>
            </div>
          </div>

          {/* キャンペーン情報 */}
          <div className="p-4 md:p-6 bg-white">
            <p className="text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                期間: {formatCampaignDate(campaign.startDate)} 〜{' '}
                {formatCampaignDate(campaign.endDate)}
              </span>
              <span className="text-orange-500 font-medium group-hover:underline">
                詳細を見る →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

/**
 * キャンペーン情報セクションコンポーネント
 *
 * @returns キャンペーン情報セクション要素
 */
export function CampaignSection(): React.ReactElement {
  const campaigns = mockCampaigns
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 次のスライドへ
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % campaigns.length)
  }, [campaigns.length])

  // 前のスライドへ
  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + campaigns.length) % campaigns.length)
  }, [campaigns.length])

  // 特定のスライドへ
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // 自動スライド
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  // キーボードナビゲーション
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrev()
        setIsAutoPlaying(false)
      } else if (event.key === 'ArrowRight') {
        goToNext()
        setIsAutoPlaying(false)
      }
    },
    [goToNext, goToPrev]
  )

  return (
    <section
      className="py-16 md:py-24 bg-gray-50"
      aria-labelledby="campaign-section-title"
      aria-roledescription="カルーセル"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2
            id="campaign-section-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            キャンペーン情報
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お得なキャンペーンを実施中。この機会をお見逃しなく！
          </p>
        </header>

        {/* カルーセル */}
        <div
          className="relative max-w-4xl mx-auto"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="キャンペーンカルーセル"
        >
          {/* スライド */}
          <div className="relative overflow-hidden">
            <div className="relative">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md"
            onClick={() => {
              goToPrev()
              setIsAutoPlaying(false)
            }}
            aria-label="前のキャンペーン"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md"
            onClick={() => {
              goToNext()
              setIsAutoPlaying(false)
            }}
            aria-label="次のキャンペーン"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* インジケーター */}
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="スライド選択">
            {campaigns.map((campaign, index) => (
              <button
                key={campaign.id}
                onClick={() => {
                  goToSlide(index)
                  setIsAutoPlaying(false)
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  index === currentIndex ? 'bg-orange-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                )}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`スライド ${index + 1}: ${campaign.name}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-600 bg-transparent hover:bg-slate-700 hover:text-white h-11 rounded-md px-8"
          >
            すべてのキャンペーンを見る
          </Link>
        </div>
      </div>
    </section>
  )
}
