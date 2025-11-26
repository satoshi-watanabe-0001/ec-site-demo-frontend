/**
 * @fileoverview Marketing Service用MSWハンドラー
 * @module mocks/handlers/marketingHandlers
 *
 * キャンペーンとニュースデータのモックハンドラー。
 * Marketing Serviceが実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type { Campaign, CampaignsResponse, NewsItem, NewsResponse } from '@/types'

/**
 * モック用キャンペーンデータ
 * 実際のahamoキャンペーンを反映
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
    conditions: ['他社からの乗り換え（MNP）または新規契約', '対象機種のご購入'],
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
    conditions: ['ahamoご契約中のお客様', 'd払いのご利用'],
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
    conditions: ['初めて大盛りオプションをお申し込みの方'],
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
    conditions: ['Galaxyシリーズのご購入', 'dポイントクラブ会員'],
  },
]

/**
 * モック用ニュースデータ
 */
const mockNews: NewsItem[] = [
  {
    id: 'news-001',
    title: 'ahamo大盛りオプション、データ容量を100GBに増量',
    publishedAt: '2025-11-25',
    category: '新機能',
    summary: '大盛りオプションのデータ容量が80GBから100GBに増量されました。',
    detailUrl: '/news/oomori-100gb',
    isImportant: true,
  },
  {
    id: 'news-002',
    title: '年末年始の営業について',
    publishedAt: '2025-11-20',
    category: 'お知らせ',
    summary: '年末年始期間中のサポート対応についてご案内いたします。',
    detailUrl: '/news/year-end-info',
  },
  {
    id: 'news-003',
    title: '5G WELCOME割 対象機種追加のお知らせ',
    publishedAt: '2025-11-18',
    category: 'キャンペーン',
    summary: '5G WELCOME割の対象機種にiPhone 16シリーズが追加されました。',
    detailUrl: '/news/5g-welcome-new-devices',
  },
  {
    id: 'news-004',
    title: 'システムメンテナンスのお知らせ',
    publishedAt: '2025-11-15',
    category: 'メンテナンス',
    summary: '12月1日深夜にシステムメンテナンスを実施いたします。',
    detailUrl: '/news/maintenance-dec',
  },
  {
    id: 'news-005',
    title: 'dカード GOLD特典がさらにお得に',
    publishedAt: '2025-11-10',
    category: 'お知らせ',
    summary: 'dカード GOLDご利用でahamo料金の10%ポイント還元。',
    detailUrl: '/news/dcard-gold-benefit',
  },
]

/**
 * Marketing Service用MSWハンドラー
 */
export const marketingHandlers = [
  // キャンペーン一覧取得
  http.get('*/api/v1/campaigns', ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '4')
    const category = url.searchParams.get('category')

    let filteredCampaigns = mockCampaigns
    if (category) {
      filteredCampaigns = mockCampaigns.filter(c => c.category === category)
    }

    const response: CampaignsResponse = {
      campaigns: filteredCampaigns.slice(0, limit),
      totalCount: filteredCampaigns.length,
    }
    return HttpResponse.json(response)
  }),

  // ニュース一覧取得
  http.get('*/api/v1/news', ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '5')
    const category = url.searchParams.get('category')

    let filteredNews = mockNews
    if (category) {
      filteredNews = mockNews.filter(n => n.category === category)
    }

    const response: NewsResponse = {
      news: filteredNews.slice(0, limit),
      totalCount: filteredNews.length,
    }
    return HttpResponse.json(response)
  }),
]
