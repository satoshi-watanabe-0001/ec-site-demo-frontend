/**
 * @fileoverview アカウント管理API用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページ・アカウント管理APIのモックハンドラー。
 * アカウントサービスが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardResponse,
  ContractInfo,
  DataUsageDetailResponse,
  BillingDetailResponse,
  NotificationSettings,
  OptionService,
  ApiResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangePlanRequest,
} from '@/types'

/**
 * モック用のユーザーID
 */
const MOCK_USER_ID = 'user-001'

/**
 * ダッシュボードのモックデータ
 */
const mockDashboard: DashboardResponse = {
  contract: {
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
  },
  dataUsage: {
    usedAmount: 12.5,
    remainingAmount: 7.5,
    totalCapacity: 20,
    lastUpdated: new Date().toISOString(),
    usagePercentage: 62.5,
  },
  billing: {
    billingMonth: '2026-03',
    basicFee: 2970,
    callCharges: 220,
    optionCharges: 0,
    totalAmount: 3190,
    previousMonthDiff: -180,
    paymentStatus: 'pending',
  },
  device: {
    deviceName: 'iPhone 16 Pro Max',
    imageUrl: '/images/devices/iphone-16-pro-max.webp',
    purchaseDate: '2025-10-15',
    paymentStatus: '分割払い中（残り18回）',
    remainingPayment: 108000,
  },
  notifications: {
    unreadCount: 3,
    items: [
      {
        notificationId: 'notif-001',
        title: 'データ使用量のお知らせ',
        content: '今月のデータ使用量が50%を超えました。',
        date: '2026-03-03',
        isRead: false,
        importance: 'normal',
      },
      {
        notificationId: 'notif-002',
        title: '請求金額確定のお知らせ',
        content: '2026年2月分の請求金額が確定しました。',
        date: '2026-03-01',
        isRead: false,
        importance: 'important',
      },
      {
        notificationId: 'notif-003',
        title: 'メンテナンスのお知らせ',
        content: '3月10日 2:00〜5:00にシステムメンテナンスを実施します。',
        date: '2026-02-28',
        isRead: false,
        importance: 'urgent',
      },
      {
        notificationId: 'notif-004',
        title: '新プランのご案内',
        content: 'ahamo大盛りオプションが新登場！',
        date: '2026-02-15',
        isRead: true,
        importance: 'normal',
      },
    ],
  },
}

/**
 * 契約情報のモックデータ
 */
const mockContract: ContractInfo = {
  userId: MOCK_USER_ID,
  name: 'テスト太郎',
  nameKana: 'テストタロウ',
  dateOfBirth: '1990-05-15',
  postalCode: '100-0001',
  address: '東京都千代田区千代田1-1-1',
  phoneNumber: '090-1234-5678',
  email: 'test@docomo.ne.jp',
  contractPhoneNumber: '090-1234-5678',
  contractDate: '2024-04-01',
  currentPlanId: 'ahamo-basic',
  currentPlanName: 'ahamo',
  activeOptions: [],
}

/**
 * データ使用量詳細のモックデータ
 */
const mockDataUsageDetail: DataUsageDetailResponse = {
  summary: {
    usedAmount: 12.5,
    remainingAmount: 7.5,
    totalCapacity: 20,
    lastUpdated: new Date().toISOString(),
    usagePercentage: 62.5,
  },
  dailyUsage: [
    { date: '2026-03-01', amount: 0.8 },
    { date: '2026-03-02', amount: 1.2 },
    { date: '2026-03-03', amount: 0.5 },
    { date: '2026-03-04', amount: 1.5 },
    { date: '2026-03-05', amount: 0.9 },
    { date: '2026-03-06', amount: 1.1 },
    { date: '2026-03-07', amount: 0.7 },
    { date: '2026-03-08', amount: 1.3 },
    { date: '2026-03-09', amount: 0.6 },
    { date: '2026-03-10', amount: 0.4 },
    { date: '2026-03-11', amount: 1.0 },
    { date: '2026-03-12', amount: 0.8 },
    { date: '2026-03-13', amount: 0.7 },
  ],
  monthlyUsage: [
    { month: '2025-10', amount: 15.2, capacity: 20 },
    { month: '2025-11', amount: 18.7, capacity: 20 },
    { month: '2025-12', amount: 14.3, capacity: 20 },
    { month: '2026-01', amount: 16.8, capacity: 20 },
    { month: '2026-02', amount: 17.5, capacity: 20 },
    { month: '2026-03', amount: 12.5, capacity: 20 },
  ],
  chargeHistory: [
    {
      chargeId: 'charge-001',
      chargeDate: '2026-01-20T14:30:00',
      amount: 1,
      price: 550,
      expirationDate: '2026-01-31',
    },
    {
      chargeId: 'charge-002',
      chargeDate: '2025-12-25T10:00:00',
      amount: 1,
      price: 550,
      expirationDate: '2025-12-31',
    },
  ],
}

/**
 * 請求詳細のモックデータ
 */
const mockBillingDetail: BillingDetailResponse = {
  currentBilling: {
    billingMonth: '2026-03',
    basicFee: 2970,
    callCharges: 220,
    optionCharges: 0,
    totalAmount: 3190,
    previousMonthDiff: -180,
    paymentStatus: 'pending',
  },
  billingHistory: [
    {
      billingMonth: '2026-02',
      totalAmount: 3370,
      paymentStatus: 'paid',
      detailUrl: '/api/v1/account/billing/2026-02/detail',
    },
    {
      billingMonth: '2026-01',
      totalAmount: 2970,
      paymentStatus: 'paid',
      detailUrl: '/api/v1/account/billing/2026-01/detail',
    },
    {
      billingMonth: '2025-12',
      totalAmount: 3520,
      paymentStatus: 'paid',
      detailUrl: '/api/v1/account/billing/2025-12/detail',
    },
    {
      billingMonth: '2025-11',
      totalAmount: 2970,
      paymentStatus: 'paid',
      detailUrl: '/api/v1/account/billing/2025-11/detail',
    },
    {
      billingMonth: '2025-10',
      totalAmount: 3100,
      paymentStatus: 'paid',
      detailUrl: '/api/v1/account/billing/2025-10/detail',
    },
  ],
  paymentMethods: [
    {
      paymentMethodId: 'pm-001',
      type: 'credit_card',
      lastFourDigits: '4242',
      cardBrand: 'VISA',
      expirationDate: '2028-12',
      isPrimary: true,
    },
  ],
}

/**
 * 通知設定のモックデータ
 */
const mockNotificationSettings: NotificationSettings = {
  emailEnabled: true,
  smsEnabled: false,
  categories: [
    { categoryId: 'billing', name: '請求・支払い', enabled: true },
    { categoryId: 'data-usage', name: 'データ使用量', enabled: true },
    { categoryId: 'campaign', name: 'キャンペーン・おすすめ', enabled: false },
    { categoryId: 'maintenance', name: 'メンテナンス・障害情報', enabled: true },
    { categoryId: 'contract', name: '契約変更', enabled: true },
  ],
}

/**
 * オプションサービスのモックデータ
 */
const mockOptions: OptionService[] = [
  {
    optionId: 'option-kakehoudai',
    name: 'かけ放題オプション',
    monthlyFee: 1100,
    description: '国内通話が24時間かけ放題になります。5分超過分の通話料を気にせず通話できます。',
    status: 'available',
    category: '通話',
  },
  {
    optionId: 'option-oomori',
    name: '大盛りオプション',
    monthlyFee: 1980,
    description: 'データ容量が+80GBで合計100GBまで使えます。動画視聴やテザリングにおすすめ。',
    status: 'available',
    category: 'データ',
  },
  {
    optionId: 'option-insurance',
    name: 'smartあんしん補償',
    monthlyFee: 330,
    description: 'スマートフォンの故障・水濡れ・盗難・紛失をサポート。修理代金を最大全額サポート。',
    status: 'available',
    category: '補償',
  },
  {
    optionId: 'option-security',
    name: 'あんしんセキュリティ',
    monthlyFee: 220,
    description: 'ウイルスや危険サイトから端末を守るセキュリティ対策。迷惑メール対策も含みます。',
    status: 'available',
    category: 'セキュリティ',
  },
]

/**
 * アカウント管理API用MSWハンドラー
 */
export const accountHandlers = [
  // ダッシュボードAPI
  http.get('*/api/v1/account/dashboard', () => {
    return HttpResponse.json(mockDashboard)
  }),

  // 契約情報取得API
  http.get('*/api/v1/account/contract', () => {
    return HttpResponse.json(mockContract)
  }),

  // データ使用量詳細取得API
  http.get('*/api/v1/account/data-usage', () => {
    return HttpResponse.json(mockDataUsageDetail)
  }),

  // 請求情報取得API
  http.get('*/api/v1/account/billing', () => {
    return HttpResponse.json(mockBillingDetail)
  }),

  // プロフィール更新API
  http.put('*/api/v1/account/profile', async ({ request }) => {
    const body = (await request.json()) as UpdateProfileRequest
    const response: ApiResponse = {
      status: 'success',
      message: '連絡先情報を更新しました。',
    }
    // モックデータを更新
    if (body.email) mockContract.email = body.email
    if (body.phoneNumber) mockContract.phoneNumber = body.phoneNumber
    if (body.postalCode) mockContract.postalCode = body.postalCode
    if (body.address) mockContract.address = body.address
    return HttpResponse.json(response)
  }),

  // パスワード変更API
  http.put('*/api/v1/account/password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordRequest

    // 現在のパスワードの検証（モック）
    if (body.currentPassword !== 'password123') {
      const errorResponse: ApiResponse = {
        status: 'error',
        message: '現在のパスワードが正しくありません。',
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const response: ApiResponse = {
      status: 'success',
      message: 'パスワードを変更しました。',
    }
    return HttpResponse.json(response)
  }),

  // 通知設定取得API
  http.get('*/api/v1/account/notifications/settings', () => {
    return HttpResponse.json(mockNotificationSettings)
  }),

  // 通知設定更新API
  http.put('*/api/v1/account/notifications/settings', async ({ request }) => {
    const body = (await request.json()) as NotificationSettings
    // モックデータを更新
    mockNotificationSettings.emailEnabled = body.emailEnabled
    mockNotificationSettings.smsEnabled = body.smsEnabled
    mockNotificationSettings.categories = body.categories

    const response: ApiResponse = {
      status: 'success',
      message: '通知設定を更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // プラン変更API
  http.put('*/api/v1/account/plan', async ({ request }) => {
    const body = (await request.json()) as ChangePlanRequest
    const planName = body.newPlanId === 'ahamo-large' ? 'ahamo大盛り' : 'ahamo'
    const timingText = body.applyTiming === 'next_month' ? '翌月から' : '即日'

    const response: ApiResponse = {
      status: 'success',
      message: `プランを${planName}に変更しました。${timingText}適用されます。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション一覧取得API
  http.get('*/api/v1/account/options', () => {
    return HttpResponse.json(mockOptions)
  }),

  // オプション追加API
  http.post('*/api/v1/account/options/:optionId', ({ params }) => {
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)

    if (!option) {
      const errorResponse: ApiResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません。',
      }
      return HttpResponse.json(errorResponse, { status: 404 })
    }

    option.status = 'active'
    const response: ApiResponse = {
      status: 'success',
      message: `${option.name}を追加しました。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション解約API
  http.delete('*/api/v1/account/options/:optionId', ({ params }) => {
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)

    if (!option) {
      const errorResponse: ApiResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません。',
      }
      return HttpResponse.json(errorResponse, { status: 404 })
    }

    option.status = 'available'
    const response: ApiResponse = {
      status: 'success',
      message: `${option.name}を解約しました。`,
    }
    return HttpResponse.json(response)
  }),
]
