/**
 * @fileoverview アカウント管理API用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページ関連APIのモックハンドラー。
 * アカウント管理バックエンドが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  OptionService,
  AvailablePlan,
  AccountApiResponse,
  AccountApiErrorResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  PlanChangeRequest,
} from '@/types'

/**
 * 認証ヘッダーを検証するヘルパー関数
 * @param request - リクエストオブジェクト
 * @returns 認証済みかどうか
 */
function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return !!authHeader && authHeader.startsWith('Bearer ')
}

/**
 * 未認証エラーレスポンスを生成
 */
function unauthorizedResponse() {
  const error: AccountApiErrorResponse = {
    status: 'error',
    message: '認証が必要です。ログインしてください。',
    timestamp: new Date().toISOString(),
  }
  return HttpResponse.json(error, { status: 401 })
}

/**
 * ダッシュボード用モックデータ
 */
const mockDashboardData: DashboardData = {
  currentPlan: {
    id: 'ahamo-basic',
    name: 'ahamo',
    price: 2970,
    dataCapacity: 20,
  },
  dataUsageSummary: {
    usedGb: 12.5,
    totalGb: 20,
    remainingGb: 7.5,
  },
  billingSummary: {
    currentMonthTotal: 4950,
    lastMonthTotal: 4400,
    difference: 550,
  },
  deviceInfo: {
    name: 'iPhone 15 Pro',
    imageUrl: '/images/devices/iphone15pro.png',
    purchaseDate: '2025-06-15',
    remainingPayments: 18,
    monthlyPayment: 3280,
  },
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量が80%を超えました',
      body: '今月のデータ使用量が16GBを超えました。残り4GBです。',
      isRead: false,
      timestamp: '2026-03-04T10:30:00Z',
      type: 'warning',
    },
    {
      id: 'notif-002',
      title: '3月のご請求金額が確定しました',
      body: '2026年3月分のご請求金額は4,950円です。',
      isRead: false,
      timestamp: '2026-03-01T09:00:00Z',
      type: 'billing',
    },
    {
      id: 'notif-003',
      title: 'ahamo大盛りキャンペーン実施中',
      body: '今なら大盛りオプションが初月無料！詳しくはキャンペーンページをご覧ください。',
      isRead: true,
      timestamp: '2026-02-25T12:00:00Z',
      type: 'campaign',
    },
    {
      id: 'notif-004',
      title: 'システムメンテナンスのお知らせ',
      body: '3月10日 2:00〜5:00の間、一部サービスがご利用いただけません。',
      isRead: true,
      timestamp: '2026-02-20T15:00:00Z',
      type: 'info',
    },
  ],
}

/**
 * 契約情報モックデータ
 */
const mockContractInfo: ContractInfo = {
  name: '山田 太郎',
  nameKana: 'ヤマダ タロウ',
  birthday: '1990-05-15',
  postalCode: '100-0001',
  address: '東京都千代田区千代田1-1-1 千代田マンション301',
  phoneNumber: '090-1234-5678',
  email: 'test@docomo.ne.jp',
  contractPhoneNumber: '090-1234-5678',
  contractDate: '2024-04-01',
  currentPlanId: 'ahamo-basic',
  currentPlanName: 'ahamo',
  subscribedOptionIds: ['kakehodai'],
  subscribedOptionNames: ['かけ放題オプション'],
}

/**
 * データ使用量モックデータ
 */
const mockDataUsage: DataUsage = {
  usedGb: 12.5,
  totalGb: 20,
  remainingGb: 7.5,
  dailyUsage: [
    { date: '2026-03-01', usageGb: 0.8 },
    { date: '2026-03-02', usageGb: 1.2 },
    { date: '2026-03-03', usageGb: 0.5 },
    { date: '2026-03-04', usageGb: 2.1 },
    { date: '2026-03-05', usageGb: 1.8 },
    { date: '2026-03-06', usageGb: 0.3 },
    { date: '2026-03-07', usageGb: 0.9 },
    { date: '2026-03-08', usageGb: 1.5 },
    { date: '2026-03-09', usageGb: 0.7 },
    { date: '2026-03-10', usageGb: 1.1 },
    { date: '2026-03-11', usageGb: 0.4 },
    { date: '2026-03-12', usageGb: 1.2 },
  ],
  monthlyUsage: [
    { month: '2025-10', usageGb: 15.2, capacityGb: 20 },
    { month: '2025-11', usageGb: 18.7, capacityGb: 20 },
    { month: '2025-12', usageGb: 12.3, capacityGb: 20 },
    { month: '2026-01', usageGb: 16.8, capacityGb: 20 },
    { month: '2026-02', usageGb: 14.5, capacityGb: 20 },
    { month: '2026-03', usageGb: 12.5, capacityGb: 20 },
  ],
  chargeHistory: [
    {
      date: '2025-11-20',
      amountGb: 1,
      price: 550,
      expiryDate: '2025-11-30',
    },
    {
      date: '2026-01-15',
      amountGb: 1,
      price: 550,
      expiryDate: '2026-01-31',
    },
  ],
}

/**
 * 請求情報モックデータ
 */
const mockBillingInfo: BillingInfo = {
  currentMonth: {
    month: '2026-03',
    items: [
      { name: '基本料金（ahamo）', amount: 2970 },
      { name: 'かけ放題オプション', amount: 1100 },
      { name: 'ユニバーサルサービス料', amount: 2 },
      { name: '電話リレーサービス料', amount: 1 },
    ],
    totalAmount: 4073,
    differenceFromLastMonth: -877,
  },
  paymentMethod: {
    type: 'credit_card',
    provider: 'VISA',
    lastFourDigits: '4242',
    expiryDate: '2028-12',
  },
  paymentHistory: [
    { month: '2026-02', totalAmount: 4950, status: 'paid', paidDate: '2026-02-28' },
    { month: '2026-01', totalAmount: 4400, status: 'paid', paidDate: '2026-01-31' },
    { month: '2025-12', totalAmount: 3520, status: 'paid', paidDate: '2025-12-31' },
    { month: '2025-11', totalAmount: 5500, status: 'paid', paidDate: '2025-11-30' },
    { month: '2025-10', totalAmount: 4180, status: 'paid', paidDate: '2025-10-31' },
    { month: '2025-09', totalAmount: 2973, status: 'paid', paidDate: '2025-09-30' },
  ],
}

/**
 * オプションサービスモックデータ
 */
const mockOptions: OptionService[] = [
  {
    id: 'kakehodai',
    name: 'かけ放題オプション',
    monthlyFee: 1100,
    description: '国内通話が24時間かけ放題になるオプションです。',
    isSubscribed: true,
    category: 'call',
  },
  {
    id: 'oomori',
    name: '大盛りオプション',
    monthlyFee: 1980,
    description: 'データ容量を+80GB追加（合計100GB）できるオプションです。',
    isSubscribed: false,
    category: 'data',
  },
  {
    id: 'data-add-1gb',
    name: 'データ追加 1GB',
    monthlyFee: 550,
    description: 'データ容量を1GB追加できます。月末まで有効です。',
    isSubscribed: false,
    category: 'data',
  },
  {
    id: 'smartphone-insurance',
    name: 'スマートフォン保険',
    monthlyFee: 550,
    description: '画面割れ・水没・盗難など、万が一のトラブルをカバーします。',
    isSubscribed: false,
    category: 'insurance',
  },
  {
    id: 'anshin-security',
    name: 'あんしんセキュリティ',
    monthlyFee: 220,
    description: 'ウイルス対策・迷惑メールフィルタなどのセキュリティ機能を提供します。',
    isSubscribed: false,
    category: 'other',
  },
  {
    id: 'cloud-storage',
    name: 'クラウドストレージ 50GB',
    monthlyFee: 440,
    description: '写真や動画を50GBまでクラウドに保存できます。',
    isSubscribed: false,
    category: 'other',
  },
]

/**
 * 利用可能プランモックデータ
 */
const mockPlans: AvailablePlan[] = [
  {
    id: 'ahamo-basic',
    name: 'ahamo',
    price: 2970,
    dataCapacity: 20,
    freeCallMinutes: 5,
    description: 'シンプルでおトクな料金プラン',
    features: [
      '月額2,970円（税込）',
      'データ容量20GB',
      '5分以内の国内通話無料',
      '5G対応',
      '海外82の国・地域でそのまま使える',
    ],
    isCurrent: true,
  },
  {
    id: 'ahamo-oomori',
    name: 'ahamo大盛り',
    price: 4950,
    dataCapacity: 100,
    freeCallMinutes: 5,
    description: 'データをたっぷり使いたい方に',
    features: [
      '月額4,950円（税込）',
      'データ容量100GB',
      '5分以内の国内通話無料',
      '5G対応',
      '海外82の国・地域でそのまま使える',
      'テザリングも100GBまで',
    ],
    isCurrent: false,
  },
]

/**
 * アカウント管理API用MSWハンドラー
 */
export const accountHandlers = [
  // ダッシュボードAPI
  http.get('*/api/v1/account/dashboard', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<DashboardData> = {
      status: 'success',
      data: mockDashboardData,
    }
    return HttpResponse.json(response)
  }),

  // 契約情報API
  http.get('*/api/v1/account/contract', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<ContractInfo> = {
      status: 'success',
      data: mockContractInfo,
    }
    return HttpResponse.json(response)
  }),

  // データ使用量API
  http.get('*/api/v1/account/data-usage', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<DataUsage> = {
      status: 'success',
      data: mockDataUsage,
    }
    return HttpResponse.json(response)
  }),

  // 請求情報API
  http.get('*/api/v1/account/billing', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<BillingInfo> = {
      status: 'success',
      data: mockBillingInfo,
    }
    return HttpResponse.json(response)
  }),

  // プロフィール更新API
  http.patch('*/api/v1/account/profile', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const body = (await request.json()) as ProfileUpdateRequest

    // バリデーション
    if (body.email && !body.email.includes('@')) {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: '有効なメールアドレスを入力してください。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 400 })
    }

    const response: AccountApiResponse = {
      status: 'success',
      message: 'プロフィールを更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // パスワード変更API
  http.patch('*/api/v1/account/password', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const body = (await request.json()) as PasswordChangeRequest

    // 現在のパスワードの検証
    if (body.currentPassword !== 'password123') {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: '現在のパスワードが正しくありません。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 400 })
    }

    // 新しいパスワードのバリデーション
    if (body.newPassword.length < 8) {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: 'パスワードは8文字以上で入力してください。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 400 })
    }

    const response: AccountApiResponse = {
      status: 'success',
      message: 'パスワードを変更しました。',
    }
    return HttpResponse.json(response)
  }),

  // 利用可能プラン一覧API
  http.get('*/api/v1/account/plans', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<AvailablePlan[]> = {
      status: 'success',
      data: mockPlans,
    }
    return HttpResponse.json(response)
  }),

  // プラン変更API
  http.post('*/api/v1/account/plan', async ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const body = (await request.json()) as PlanChangeRequest

    // プランIDの検証
    const validPlanIds = mockPlans.map(p => p.id)
    if (!validPlanIds.includes(body.newPlanId)) {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: '指定されたプランが見つかりません。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 400 })
    }

    const timingText = body.applyTiming === 'next_month' ? '来月から' : '即時'

    const response: AccountApiResponse = {
      status: 'success',
      message: `プラン変更を受け付けました。${timingText}適用されます。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション一覧API
  http.get('*/api/v1/account/options', ({ request }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const response: AccountApiResponse<OptionService[]> = {
      status: 'success',
      data: mockOptions,
    }
    return HttpResponse.json(response)
  }),

  // オプション追加API
  http.post('*/api/v1/account/options/:optionId/subscribe', ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const optionId = params.optionId as string
    const option = mockOptions.find(o => o.id === optionId)

    if (!option) {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 404 })
    }

    const response: AccountApiResponse = {
      status: 'success',
      message: `${option.name}を追加しました。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション解除API
  http.post('*/api/v1/account/options/:optionId/unsubscribe', ({ request, params }) => {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse()
    }

    const optionId = params.optionId as string
    const option = mockOptions.find(o => o.id === optionId)

    if (!option) {
      const error: AccountApiErrorResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません。',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(error, { status: 404 })
    }

    const response: AccountApiResponse = {
      status: 'success',
      message: `${option.name}を解除しました。`,
    }
    return HttpResponse.json(response)
  }),
]
