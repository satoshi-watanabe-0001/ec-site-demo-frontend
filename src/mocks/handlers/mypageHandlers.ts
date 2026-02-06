/**
 * @fileoverview マイページ用MSWハンドラー
 * @module mocks/handlers/mypageHandlers
 *
 * ahamoアカウント管理APIのモックハンドラー。
 * ダッシュボード、契約、データ使用量、請求、設定等のAPIをモック。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  PlanChangeResponse,
  OptionChangeResponse,
  SettingsUpdateResponse,
  NotificationPreferences,
  AvailableOption,
  PlanChangeRequest,
  OptionChangeRequest,
} from '@/types'

/**
 * モック用契約情報
 */
const mockContractInfo: ContractInfo = {
  userId: 'user-001',
  phoneNumber: '090-1234-5678',
  contractDate: '2024-04-01',
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    freeCallIncluded: true,
  },
  options: [
    {
      optionId: 'opt-kakehoudai',
      optionName: 'かけ放題オプション',
      monthlyFee: 1100,
      startDate: '2024-04-01',
      description: '国内通話が24時間かけ放題',
      category: 'call',
    },
  ],
  contractorName: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  simType: 'eSIM',
}

/**
 * モック用データ使用量
 */
const mockDataUsage: DataUsage = {
  currentUsage: 12.5,
  remaining: 7.5,
  totalCapacity: 20,
  lastUpdated: '2026-02-06T09:00:00+09:00',
  dailyUsage: [
    { date: '2026-02-01', usage: 1.2 },
    { date: '2026-02-02', usage: 2.1 },
    { date: '2026-02-03', usage: 1.8 },
    { date: '2026-02-04', usage: 3.5 },
    { date: '2026-02-05', usage: 2.4 },
    { date: '2026-02-06', usage: 1.5 },
  ],
  monthlyHistory: [
    { month: '2025-09', usage: 15.2, capacity: 20 },
    { month: '2025-10', usage: 18.7, capacity: 20 },
    { month: '2025-11', usage: 14.3, capacity: 20 },
    { month: '2025-12', usage: 19.1, capacity: 20 },
    { month: '2026-01', usage: 16.8, capacity: 20 },
    { month: '2026-02', usage: 12.5, capacity: 20 },
  ],
}

/**
 * モック用請求情報
 */
const mockBillingInfo: BillingInfo = {
  currentMonthEstimate: {
    month: '2026-02',
    basicFee: 2970,
    callFee: 220,
    optionFee: 1100,
    discount: 0,
    totalAmount: 4290,
    items: [
      { itemName: 'ahamo基本料金', amount: 2970 },
      { itemName: '通話料（5分超過分）', amount: 220 },
      { itemName: 'かけ放題オプション', amount: 1100 },
    ],
    isConfirmed: false,
  },
  history: [
    {
      month: '2026-01',
      basicFee: 2970,
      callFee: 440,
      optionFee: 1100,
      discount: 0,
      totalAmount: 4510,
      items: [
        { itemName: 'ahamo基本料金', amount: 2970 },
        { itemName: '通話料（5分超過分）', amount: 440 },
        { itemName: 'かけ放題オプション', amount: 1100 },
      ],
      isConfirmed: true,
    },
    {
      month: '2025-12',
      basicFee: 2970,
      callFee: 110,
      optionFee: 1100,
      discount: 0,
      totalAmount: 4180,
      items: [
        { itemName: 'ahamo基本料金', amount: 2970 },
        { itemName: '通話料（5分超過分）', amount: 110 },
        { itemName: 'かけ放題オプション', amount: 1100 },
      ],
      isConfirmed: true,
    },
    {
      month: '2025-11',
      basicFee: 2970,
      callFee: 330,
      optionFee: 1100,
      discount: 0,
      totalAmount: 4400,
      items: [
        { itemName: 'ahamo基本料金', amount: 2970 },
        { itemName: '通話料（5分超過分）', amount: 330 },
        { itemName: 'かけ放題オプション', amount: 1100 },
      ],
      isConfirmed: true,
    },
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
const mockDeviceInfo = {
  deviceId: 'device-iphone16pro',
  name: 'iPhone 16 Pro',
  imageUrl: '/images/devices/iphone-16-pro.png',
  purchaseDate: '2025-10-01',
  remainingPayments: 20,
  monthlyPayment: 6658,
  remainingBalance: 133160,
  imei: '356938035643809',
}

/**
 * モック用通知データ
 */
const mockNotifications = [
  {
    id: 'notif-001',
    title: 'データ使用量が80%に達しました',
    message: '今月のデータ使用量が16GBを超えました。残り4GBです。',
    createdAt: '2026-02-05T15:30:00+09:00',
    isRead: false,
    isImportant: true,
    category: 'system' as const,
  },
  {
    id: 'notif-002',
    title: '2月のご利用料金が確定しました',
    message: '1月分のご利用料金は4,510円です。',
    createdAt: '2026-02-03T10:00:00+09:00',
    isRead: true,
    isImportant: false,
    category: 'billing' as const,
  },
  {
    id: 'notif-003',
    title: '大盛りオプション1ヶ月無料キャンペーン',
    message: '初めて大盛りオプションをお申し込みの方は1ヶ月無料！',
    createdAt: '2026-02-01T09:00:00+09:00',
    isRead: false,
    isImportant: false,
    category: 'campaign' as const,
  },
]

/**
 * モック用通知設定
 */
const mockNotificationPreferences: NotificationPreferences = {
  emailNotification: true,
  campaignNotification: true,
  billingNotification: true,
  dataUsageAlert: true,
  dataUsageAlertThreshold: 80,
}

/**
 * モック用利用可能オプション
 */
const mockAvailableOptions: AvailableOption[] = [
  {
    optionId: 'opt-kakehoudai',
    optionName: 'かけ放題オプション',
    monthlyFee: 1100,
    description: '国内通話が24時間かけ放題になります。',
    category: 'call',
    isSubscribed: true,
  },
  {
    optionId: 'opt-oomori',
    optionName: '大盛りオプション',
    monthlyFee: 1980,
    description: 'データ容量が+80GBで合計100GBに。大容量で動画もゲームも楽しめます。',
    category: 'data',
    isSubscribed: false,
  },
  {
    optionId: 'opt-keitai-hoken',
    optionName: 'ケータイ補償サービス',
    monthlyFee: 825,
    description: '故障・水濡れ・盗難・紛失時に端末の交換や修理代金をサポート。',
    category: 'insurance',
    isSubscribed: false,
  },
  {
    optionId: 'opt-security',
    optionName: 'あんしんセキュリティ',
    monthlyFee: 220,
    description: 'ウイルス対策やフィッシング詐欺対策でスマホを守ります。',
    category: 'other',
    isSubscribed: false,
  },
]

/**
 * 現在のプラン状態（モック用可変状態）
 */
let currentPlanId: string = 'ahamo-basic'

/**
 * マイページ用MSWハンドラー
 */
export const mypageHandlers = [
  // ダッシュボードデータ取得
  http.get('*/api/v1/mypage/dashboard', () => {
    const dashboardData: DashboardData = {
      contract: mockContractInfo,
      dataUsage: mockDataUsage,
      billing: mockBillingInfo,
      device: mockDeviceInfo,
      notifications: mockNotifications,
    }
    return HttpResponse.json(dashboardData)
  }),

  // 契約情報取得
  http.get('*/api/v1/mypage/contract', () => {
    return HttpResponse.json(mockContractInfo)
  }),

  // データ使用量取得
  http.get('*/api/v1/mypage/data-usage', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  // 請求情報取得
  http.get('*/api/v1/mypage/billing', () => {
    return HttpResponse.json(mockBillingInfo)
  }),

  // 利用可能オプション一覧取得
  http.get('*/api/v1/mypage/options', () => {
    return HttpResponse.json(mockAvailableOptions)
  }),

  // 通知設定取得
  http.get('*/api/v1/mypage/settings/notifications', () => {
    return HttpResponse.json(mockNotificationPreferences)
  }),

  // プロフィール更新
  http.patch('*/api/v1/mypage/settings/profile', () => {
    const response: SettingsUpdateResponse = {
      success: true,
      message: 'プロフィールを更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // パスワード変更
  http.post('*/api/v1/mypage/settings/password', () => {
    const response: SettingsUpdateResponse = {
      success: true,
      message: 'パスワードを変更しました。',
    }
    return HttpResponse.json(response)
  }),

  // 通知設定更新
  http.patch('*/api/v1/mypage/settings/notifications', () => {
    const response: SettingsUpdateResponse = {
      success: true,
      message: '通知設定を更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // プラン変更
  http.post('*/api/v1/mypage/plan', async ({ request }) => {
    const body = (await request.json()) as PlanChangeRequest

    if (body.newPlanId === currentPlanId) {
      return HttpResponse.json(
        { success: false, message: '現在と同じプランです。' },
        { status: 400 }
      )
    }

    currentPlanId = body.newPlanId

    const response: PlanChangeResponse = {
      success: true,
      message:
        body.newPlanId === 'ahamo-oomori'
          ? 'ahamo大盛りプランへの変更を受け付けました。翌月1日より適用されます。'
          : 'ahamoプランへの変更を受け付けました。翌月1日より適用されます。',
      effectiveDate: '2026-03-01',
    }
    return HttpResponse.json(response)
  }),

  // オプション変更
  http.post('*/api/v1/mypage/options', async ({ request }) => {
    const body = (await request.json()) as OptionChangeRequest
    const response: OptionChangeResponse = {
      success: true,
      message: body.action === 'add' ? 'オプションを追加しました。' : 'オプションを解除しました。',
    }
    return HttpResponse.json(response)
  }),
]
