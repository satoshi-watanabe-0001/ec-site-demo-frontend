/**
 * @fileoverview Account Service用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * アカウント・契約・データ通信量・請求・端末・通知・オプションAPIのモックハンドラー。
 * Account Serviceが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type {
  AccountInfoResponse,
  DataUsageResponse,
  BillingResponse,
  DeviceInfoResponse,
  NotificationsResponse,
  OptionsResponse,
  SuccessResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePlanRequest,
  OptionService,
} from '@/types'

/**
 * モック用アカウント情報
 */
const mockAccountInfo: AccountInfoResponse = {
  customer: {
    customerId: 'CUST-2024-001',
    name: 'テストユーザー',
    email: 'test@docomo.ne.jp',
    phoneNumber: '090-1234-5678',
    contractDate: '2024-03-15',
    contractStatus: 'active',
  },
  plan: {
    planCode: 'ahamo-20',
    planName: 'ahamo（20GB）',
    monthlyPrice: 2970,
    dataCapacityGB: 20,
    description: '20GBのデータ通信と5分以内の国内通話無料',
  },
  activeOptionsCount: 2,
}

/**
 * モック用データ通信量
 */
const mockDataUsage: DataUsageResponse = {
  currentUsageGB: 12.5,
  currentCapacityGB: 20,
  remainingGB: 7.5,
  dailyUsage: [
    { date: '2026-03-01', usageGB: 0.8 },
    { date: '2026-03-02', usageGB: 1.2 },
    { date: '2026-03-03', usageGB: 0.5 },
    { date: '2026-03-04', usageGB: 2.1 },
    { date: '2026-03-05', usageGB: 1.8 },
    { date: '2026-03-06', usageGB: 0.9 },
    { date: '2026-03-07', usageGB: 1.5 },
    { date: '2026-03-08', usageGB: 0.7 },
    { date: '2026-03-09', usageGB: 1.1 },
    { date: '2026-03-10', usageGB: 1.9 },
  ],
  monthlyHistory: [
    { month: '2025-10', usageGB: 15.2, capacityGB: 20 },
    { month: '2025-11', usageGB: 18.7, capacityGB: 20 },
    { month: '2025-12', usageGB: 12.3, capacityGB: 20 },
    { month: '2026-01', usageGB: 16.8, capacityGB: 20 },
    { month: '2026-02', usageGB: 14.1, capacityGB: 20 },
    { month: '2026-03', usageGB: 12.5, capacityGB: 20 },
  ],
  chargeHistory: [
    {
      chargeId: 'CHG-001',
      chargedAt: '2025-12-20T14:30:00Z',
      amountGB: 1,
      price: 550,
    },
    {
      chargeId: 'CHG-002',
      chargedAt: '2026-01-15T09:15:00Z',
      amountGB: 1,
      price: 550,
    },
  ],
}

/**
 * モック用請求情報
 */
const mockBilling: BillingResponse = {
  currentBilling: {
    month: '2026-03',
    items: [
      { label: '基本料金（ahamo 20GB）', amount: 2970 },
      { label: 'かけ放題オプション', amount: 1100 },
      { label: '端末分割支払い金（iPhone 16 Pro）', amount: 6658 },
      { label: 'ユニバーサルサービス料', amount: 2 },
      { label: '電話リレーサービス料', amount: 1 },
    ],
    totalAmount: 10731,
    billingDate: '2026-03-01',
    paymentDueDate: '2026-03-31',
  },
  billingHistory: [
    { month: '2025-10', totalAmount: 10731, paymentStatus: 'paid', paidAt: '2025-10-28' },
    { month: '2025-11', totalAmount: 10731, paymentStatus: 'paid', paidAt: '2025-11-28' },
    { month: '2025-12', totalAmount: 11281, paymentStatus: 'paid', paidAt: '2025-12-28' },
    { month: '2026-01', totalAmount: 11281, paymentStatus: 'paid', paidAt: '2026-01-28' },
    { month: '2026-02', totalAmount: 10731, paymentStatus: 'paid', paidAt: '2026-02-28' },
    { month: '2026-03', totalAmount: 10731, paymentStatus: 'pending' },
  ],
  paymentMethod: {
    type: 'credit_card',
    displayName: 'VISA **** 1234',
    expiryDate: '2028-12',
  },
}

/**
 * モック用端末情報
 */
const mockDevice: DeviceInfoResponse = {
  deviceId: 'DEV-001',
  deviceName: 'iPhone 16 Pro',
  manufacturer: 'Apple',
  imageUrl: '/images/devices/iphone-16-pro.png',
  purchaseDate: '2024-10-01',
  imei: '353456789012345',
  storage: '256GB',
  color: 'ナチュラルチタニウム',
  payment: {
    method: 'installment',
    monthlyAmount: 6658,
    remainingInstallments: 18,
    totalInstallments: 24,
    paidAmount: 39948,
    totalPrice: 159800,
  },
}

/**
 * モック用オプションサービス
 */
const mockOptions: OptionService[] = [
  {
    optionId: 'OPT-001',
    optionName: 'かけ放題オプション',
    monthlyPrice: 1100,
    description: '国内通話が24時間かけ放題になるオプションです。',
    isSubscribed: true,
    category: 'call',
  },
  {
    optionId: 'OPT-002',
    optionName: 'ahamo大盛り',
    monthlyPrice: 1980,
    description: '月間データ容量を+80GBの合計100GBに増量できるオプションです。',
    isSubscribed: false,
    category: 'data',
  },
  {
    optionId: 'OPT-003',
    optionName: 'ケータイ補償サービス',
    monthlyPrice: 825,
    description: '故障・水濡れ・盗難・紛失時のトラブルをサポートします。',
    isSubscribed: true,
    category: 'insurance',
  },
  {
    optionId: 'OPT-004',
    optionName: 'Disney+',
    monthlyPrice: 990,
    description: 'ディズニー、ピクサー、マーベル、スター・ウォーズなどの作品が見放題。',
    isSubscribed: false,
    category: 'entertainment',
  },
  {
    optionId: 'OPT-005',
    optionName: 'DAZN for docomo',
    monthlyPrice: 3150,
    description: 'スポーツのライブ中継やハイライトが楽しめるストリーミングサービス。',
    isSubscribed: false,
    category: 'entertainment',
  },
]

/**
 * モック用通知データ
 */
const mockNotifications: NotificationsResponse = {
  notifications: [
    {
      id: 'NOTIF-001',
      title: 'データ通信量のお知らせ',
      body: '今月のデータ使用量が15GBを超えました。残り5GBです。',
      type: 'warning',
      isRead: false,
      createdAt: '2026-03-04T10:00:00Z',
    },
    {
      id: 'NOTIF-002',
      title: '3月のご請求額確定',
      body: '3月分のご請求額が確定しました。合計金額: ¥10,731',
      type: 'info',
      isRead: false,
      createdAt: '2026-03-01T09:00:00Z',
    },
    {
      id: 'NOTIF-003',
      title: '春の機種変更キャンペーン',
      body: '対象機種の購入で最大22,000円割引！期間: 2026年3月1日〜3月31日',
      type: 'campaign',
      isRead: true,
      createdAt: '2026-02-28T12:00:00Z',
    },
    {
      id: 'NOTIF-004',
      title: 'システムメンテナンスのお知らせ',
      body: '2026年3月10日(火) 2:00〜5:00にシステムメンテナンスを実施します。',
      type: 'system',
      isRead: true,
      createdAt: '2026-02-25T15:00:00Z',
    },
  ],
  unreadCount: 2,
}

/**
 * Account Service用MSWハンドラー
 */
export const accountHandlers = [
  // アカウント・契約情報取得
  http.get('*/api/v1/account/me', () => {
    return HttpResponse.json(mockAccountInfo)
  }),

  // データ通信量取得
  http.get('*/api/v1/account/data-usage', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  // 請求情報取得
  http.get('*/api/v1/account/billing', () => {
    return HttpResponse.json(mockBilling)
  }),

  // 端末情報取得
  http.get('*/api/v1/account/device', () => {
    return HttpResponse.json(mockDevice)
  }),

  // オプションサービス一覧取得
  http.get('*/api/v1/account/options', () => {
    const response: OptionsResponse = {
      options: mockOptions,
    }
    return HttpResponse.json(response)
  }),

  // 通知一覧取得
  http.get('*/api/v1/account/notifications', () => {
    return HttpResponse.json(mockNotifications)
  }),

  // プロフィール更新
  http.put('*/api/v1/account/profile', async ({ request }) => {
    const body = (await request.json()) as UpdateProfileRequest
    mockAccountInfo.customer.name = body.name
    mockAccountInfo.customer.email = body.email
    mockAccountInfo.customer.phoneNumber = body.phoneNumber

    const response: SuccessResponse = {
      status: 'success',
      message: 'プロフィールを更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // パスワード変更
  http.put('*/api/v1/account/password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordRequest

    if (body.currentPassword !== 'password123') {
      return HttpResponse.json(
        { status: 'error', message: '現在のパスワードが正しくありません。' },
        { status: 400 }
      )
    }

    const response: SuccessResponse = {
      status: 'success',
      message: 'パスワードを変更しました。',
    }
    return HttpResponse.json(response)
  }),

  // 通知設定更新
  http.put('*/api/v1/account/notification-settings', async () => {
    const response: SuccessResponse = {
      status: 'success',
      message: '通知設定を更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // プラン変更
  http.put('*/api/v1/account/plan', async ({ request }) => {
    const body = (await request.json()) as ChangePlanRequest

    if (body.planCode === 'ahamo-100') {
      mockAccountInfo.plan = {
        planCode: 'ahamo-100',
        planName: 'ahamo大盛り（100GB）',
        monthlyPrice: 4950,
        dataCapacityGB: 100,
        description: '100GBのデータ通信と5分以内の国内通話無料',
      }
    } else {
      mockAccountInfo.plan = {
        planCode: 'ahamo-20',
        planName: 'ahamo（20GB）',
        monthlyPrice: 2970,
        dataCapacityGB: 20,
        description: '20GBのデータ通信と5分以内の国内通話無料',
      }
    }

    const response: SuccessResponse = {
      status: 'success',
      message: 'プランを変更しました。翌月から適用されます。',
    }
    return HttpResponse.json(response)
  }),

  // オプション追加
  http.post('*/api/v1/account/options/:optionId/subscribe', async ({ params }) => {
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)
    if (option) {
      option.isSubscribed = true
    }

    const response: SuccessResponse = {
      status: 'success',
      message: 'オプションを追加しました。',
    }
    return HttpResponse.json(response)
  }),

  // オプション解除
  http.delete('*/api/v1/account/options/:optionId', async ({ params }) => {
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)
    if (option) {
      option.isSubscribed = false
    }

    const response: SuccessResponse = {
      status: 'success',
      message: 'オプションを解除しました。',
    }
    return HttpResponse.json(response)
  }),

  // 支払い方法更新
  http.put('*/api/v1/account/payment', async () => {
    const response: SuccessResponse = {
      status: 'success',
      message: '支払い方法を更新しました。',
    }
    return HttpResponse.json(response)
  }),
]
