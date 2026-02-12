/**
 * @fileoverview アカウント管理API用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * アカウント管理APIのモックハンドラー。
 * ダッシュボード情報取得、アカウント設定更新をモック化。
 */

import { http, HttpResponse } from 'msw'
import type { DashboardResponse, AccountSettings } from '@/services/accountService'

const mockDashboard: DashboardResponse = {
  contract: {
    contractId: 'CT-2024-001',
    contractor: {
      lastName: '山田',
      firstName: '太郎',
      lastNameKana: 'ヤマダ',
      firstNameKana: 'タロウ',
      dateOfBirth: '1990-05-15',
      postalCode: '150-0001',
      address: '東京都渋谷区神宮前1-2-3',
      phoneNumber: '090-1234-5678',
      email: 'test@docomo.ne.jp',
    },
    details: {
      phoneNumber: '090-1234-5678',
      contractDate: '2023-04-01',
      planName: 'ahamo',
      dataCapacity: 20,
      monthlyBasicFee: 2970,
      options: [
        {
          id: 'opt-001',
          name: 'ahamo大盛り',
          monthlyFee: 1980,
          description: 'データ容量を+80GB追加',
          startDate: '2023-06-01',
          status: 'active',
        },
        {
          id: 'opt-002',
          name: 'かけ放題オプション',
          monthlyFee: 1100,
          description: '国内通話かけ放題',
          startDate: '2023-04-01',
          status: 'active',
        },
      ],
    },
  },
  dataUsage: {
    usedData: 12.5,
    totalData: 100,
    remainingData: 87.5,
    usagePercentage: 12.5,
    updatedAt: '2026-02-12T08:00:00Z',
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
  },
  billing: {
    currentMonthTotal: 6050,
    basicFee: 2970,
    callCharge: 0,
    optionFee: 3080,
    otherCharges: 0,
    discount: 0,
    previousMonthTotal: 6050,
    monthOverMonthDiff: 0,
    details: [
      { label: '基本料金（ahamo）', amount: 2970 },
      { label: 'ahamo大盛り', amount: 1980 },
      { label: 'かけ放題オプション', amount: 1100 },
    ],
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
  },
  device: {
    name: 'iPhone 16 Pro Max',
    imageUrl: '/images/devices/iphone16promax.png',
    purchaseDate: '2024-09-20',
    paymentStatus: '分割払い中',
    remainingBalance: 98400,
    remainingInstallments: 24,
  },
  notifications: {
    unreadCount: 3,
    items: [
      {
        id: 'notif-001',
        title: '2月のご利用料金が確定しました',
        body: '2026年2月分のご利用料金は6,050円です。詳細は請求情報からご確認ください。',
        type: 'info',
        isRead: false,
        createdAt: '2026-02-10T09:00:00Z',
        linkUrl: '/mypage/billing',
      },
      {
        id: 'notif-002',
        title: '重要：システムメンテナンスのお知らせ',
        body: '2026年2月15日(日) 2:00〜6:00にシステムメンテナンスを実施します。',
        type: 'important',
        isRead: false,
        createdAt: '2026-02-08T10:00:00Z',
        linkUrl: null,
      },
      {
        id: 'notif-003',
        title: '春の乗り換えキャンペーン開催中',
        body: '期間限定！他社からの乗り換えでdポイント10,000ptプレゼント',
        type: 'campaign',
        isRead: false,
        createdAt: '2026-02-05T12:00:00Z',
        linkUrl: null,
      },
      {
        id: 'notif-004',
        title: 'データ使用量が50%を超えました',
        body: '今月のデータ使用量が50GBを超えました。残り50GBです。',
        type: 'warning',
        isRead: true,
        createdAt: '2026-01-20T15:00:00Z',
        linkUrl: '/mypage/data-usage',
      },
    ],
  },
  paymentMethod: {
    id: 'pm-001',
    type: 'credit_card',
    lastFourDigits: '4242',
    cardBrand: 'VISA',
    expiryDate: '12/28',
    bankName: null,
    accountType: null,
    accountLastFourDigits: null,
    isDefault: true,
  },
}

const mockAccountSettings: AccountSettings = {
  email: 'test@docomo.ne.jp',
  phoneNumber: '090-1234-5678',
  notificationPreferences: {
    email: true,
    sms: true,
    push: false,
  },
}

export const accountHandlers = [
  http.get('*/api/v1/account/dashboard', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockDashboard)
  }),

  http.get('*/api/v1/account/settings', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockAccountSettings)
  }),

  http.patch('*/api/v1/account/settings', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const updated = { ...mockAccountSettings, ...body }
    return HttpResponse.json(updated)
  }),
]
