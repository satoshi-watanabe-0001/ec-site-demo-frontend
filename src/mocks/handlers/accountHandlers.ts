/**
 * @fileoverview Account Service用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページ関連のアカウントAPIモックハンドラー。
 * すべてのエンドポイントでAuthorizationヘッダーを検証し、
 * 未認証の場合は401を返却する。
 */

import { http, HttpResponse } from 'msw'
import type {
  AccountDashboardResponse,
  ContractInfoResponse,
  DataUsageResponse,
  BillingInfoResponse,
  AccountOptionsResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  NotificationSettings,
  PlanChangeRequest,
  AddOptionRequest,
} from '@/types'

/**
 * Authorizationヘッダーを検証するヘルパー関数
 * @param request - リクエストオブジェクト
 * @returns 認証済みの場合true
 */
function isAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return !!authHeader && authHeader.startsWith('Bearer ')
}

/**
 * 未認証レスポンスを生成するヘルパー関数
 */
function unauthorizedResponse() {
  return HttpResponse.json(
    {
      status: 'error',
      message: '認証が必要です。ログインしてください。',
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  )
}

/**
 * ダッシュボードのモックデータ
 */
const dashboardData: AccountDashboardResponse = {
  userId: 'user-001',
  userName: 'テストユーザー',
  currentPlan: 'ahamo（20GB）',
  monthlyCharge: 2970,
  dataUsed: 12.5,
  dataLimit: 20,
  billingDate: '2026-03-31',
  currentBillAmount: 4180,
  device: {
    name: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone15pro.png',
    purchaseDate: '2025-09-15',
    installmentRemaining: 18,
    monthlyInstallment: 2440,
  },
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量のお知らせ',
      message: '今月のデータ使用量が60%を超えました。',
      date: '2026-03-04',
      isRead: false,
      type: 'info',
    },
    {
      id: 'notif-002',
      title: '春のキャンペーン',
      message: 'ahamo大盛り初月無料キャンペーン実施中！',
      date: '2026-03-01',
      isRead: true,
      type: 'campaign',
    },
    {
      id: 'notif-003',
      title: '請求確定のお知らせ',
      message: '2月分の請求金額が確定しました。',
      date: '2026-02-28',
      isRead: true,
      type: 'billing',
    },
  ],
}

/**
 * 契約情報のモックデータ
 */
const contractData: ContractInfoResponse = {
  contractId: 'CONTRACT-2025-001',
  contractorName: 'テストユーザー',
  phoneNumber: '090-1234-5678',
  email: 'test@docomo.ne.jp',
  planName: 'ahamo（20GB）',
  planId: 'ahamo-20gb',
  monthlyCharge: 2970,
  dataCapacity: 20,
  freeCallMinutes: 5,
  contractStartDate: '2025-04-01',
  contractRenewalDate: '2026-04-01',
  simType: 'eSIM',
  device: {
    name: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    imageUrl: '/images/devices/iphone15pro.png',
    purchaseDate: '2025-09-15',
    installmentRemaining: 18,
    monthlyInstallment: 2440,
  },
  options: [
    {
      id: 'opt-001',
      name: 'ahamo大盛り',
      monthlyPrice: 1980,
      description: 'データ容量を+80GBで合計100GBに増量',
      startDate: '2025-06-01',
    },
    {
      id: 'opt-002',
      name: 'かけ放題オプション',
      monthlyPrice: 1100,
      description: '国内通話が24時間かけ放題',
      startDate: '2025-04-01',
    },
  ],
}

/**
 * 日別データ使用量を生成するヘルパー
 */
function generateDailyUsage() {
  const dailyUsage = []
  const now = new Date('2026-03-05')
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dailyUsage.push({
      date: date.toISOString().split('T')[0],
      usage: Math.round((Math.random() * 1.5 + 0.1) * 100) / 100,
    })
  }
  return dailyUsage
}

/**
 * データ使用量のモックデータ
 */
const dataUsageData: DataUsageResponse = {
  currentUsage: 12.5,
  dataLimit: 20,
  usagePercentage: 62.5,
  remainingData: 7.5,
  billingPeriodStart: '2026-03-01',
  billingPeriodEnd: '2026-03-31',
  dailyUsage: generateDailyUsage(),
  monthlyUsage: [
    { month: '2025-10', usage: 15.2, limit: 20 },
    { month: '2025-11', usage: 18.7, limit: 20 },
    { month: '2025-12', usage: 14.3, limit: 20 },
    { month: '2026-01', usage: 16.8, limit: 20 },
    { month: '2026-02', usage: 19.1, limit: 20 },
    { month: '2026-03', usage: 12.5, limit: 20 },
  ],
}

/**
 * 請求情報のモックデータ
 */
const billingData: BillingInfoResponse = {
  currentMonthAmount: 4180,
  currentMonthItems: [
    { name: 'ahamo基本料金（20GB）', amount: 2970 },
    { name: '端末分割払い（iPhone 15 Pro）', amount: 2440 },
    { name: 'かけ放題オプション', amount: 1100 },
    { name: 'ユニバーサルサービス料', amount: 2 },
    { name: '電話リレーサービス料', amount: 1 },
    { name: '各種割引', amount: -2333 },
  ],
  paymentMethod: {
    type: 'credit_card',
    displayName: 'VISA **** 1234',
    cardBrand: 'VISA',
    lastFourDigits: '1234',
    expiryDate: '2028-12',
  },
  billingDate: '毎月末日',
  paymentDueDate: '翌月15日',
  billingHistory: [
    {
      month: '2026-02',
      totalAmount: 6513,
      items: [
        { name: 'ahamo基本料金（20GB）', amount: 2970 },
        { name: 'ahamo大盛り', amount: 1980 },
        { name: '端末分割払い', amount: 2440 },
        { name: 'かけ放題オプション', amount: 1100 },
        { name: 'ユニバーサルサービス料', amount: 2 },
        { name: '電話リレーサービス料', amount: 1 },
        { name: '各種割引', amount: -1980 },
      ],
      status: 'paid',
      paymentDate: '2026-02-15',
    },
    {
      month: '2026-01',
      totalAmount: 6513,
      items: [
        { name: 'ahamo基本料金（20GB）', amount: 2970 },
        { name: 'ahamo大盛り', amount: 1980 },
        { name: '端末分割払い', amount: 2440 },
        { name: 'かけ放題オプション', amount: 1100 },
        { name: 'ユニバーサルサービス料', amount: 2 },
        { name: '電話リレーサービス料', amount: 1 },
        { name: '各種割引', amount: -1980 },
      ],
      status: 'paid',
      paymentDate: '2026-01-15',
    },
    {
      month: '2025-12',
      totalAmount: 6513,
      items: [
        { name: 'ahamo基本料金（20GB）', amount: 2970 },
        { name: 'ahamo大盛り', amount: 1980 },
        { name: '端末分割払い', amount: 2440 },
        { name: 'かけ放題オプション', amount: 1100 },
        { name: 'ユニバーサルサービス料', amount: 2 },
        { name: '電話リレーサービス料', amount: 1 },
        { name: '各種割引', amount: -1980 },
      ],
      status: 'paid',
      paymentDate: '2025-12-15',
    },
  ],
}

/**
 * オプションサービスのモックデータ
 */
const optionsData: AccountOptionsResponse = {
  subscribedOptions: [
    {
      id: 'opt-001',
      name: 'ahamo大盛り',
      monthlyPrice: 1980,
      description: 'データ容量を+80GBで合計100GBに増量',
      startDate: '2025-06-01',
    },
    {
      id: 'opt-002',
      name: 'かけ放題オプション',
      monthlyPrice: 1100,
      description: '国内通話が24時間かけ放題',
      startDate: '2025-04-01',
    },
  ],
  availableOptions: [
    {
      id: 'opt-003',
      name: 'ケータイ補償サービス',
      monthlyPrice: 825,
      description: '端末の故障・水濡れ・紛失時に交換端末をお届け',
      features: ['交換端末のお届け', '修理代金のサポート', 'データ復旧'],
      category: '端末補償',
    },
    {
      id: 'opt-004',
      name: 'あんしんセキュリティ',
      monthlyPrice: 220,
      description: 'ウイルス対策、危険サイトブロック等',
      features: ['ウイルス対策', '危険Wi-Fi検出', '迷惑メール対策', '危険サイトブロック'],
      category: 'セキュリティ',
    },
    {
      id: 'opt-005',
      name: 'Disney+',
      monthlyPrice: 990,
      description: 'ディズニー、ピクサー、マーベル等の映像コンテンツが見放題',
      features: ['映画見放題', 'オリジナルコンテンツ', '最大4台同時視聴', '4K対応'],
      category: 'エンタメ',
    },
  ],
}

/**
 * Account Service用MSWハンドラー
 */
export const accountHandlers = [
  // ダッシュボードAPI
  http.get('*/api/v1/account/dashboard', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json(dashboardData)
  }),

  // 契約情報API
  http.get('*/api/v1/account/contract', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json(contractData)
  }),

  // データ使用量API
  http.get('*/api/v1/account/data-usage', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json(dataUsageData)
  }),

  // 請求情報API
  http.get('*/api/v1/account/billing', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json(billingData)
  }),

  // オプションサービスAPI
  http.get('*/api/v1/account/options', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json(optionsData)
  }),

  // プロフィール更新API
  http.put('*/api/v1/account/profile', async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    const body = (await request.json()) as UpdateProfileRequest
    return HttpResponse.json({
      success: true,
      message: `プロフィールを更新しました。${body.name ? `氏名: ${body.name}` : ''}`,
    })
  }),

  // パスワード変更API
  http.put('*/api/v1/account/password', async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    const body = (await request.json()) as ChangePasswordRequest
    if (body.currentPassword === 'password123') {
      return HttpResponse.json({
        success: true,
        message: 'パスワードを変更しました。',
      })
    }
    return HttpResponse.json(
      {
        status: 'error',
        message: '現在のパスワードが正しくありません。',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    )
  }),

  // 通知設定更新API
  http.put('*/api/v1/account/notifications', async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    await request.json() as NotificationSettings
    return HttpResponse.json({
      success: true,
      message: '通知設定を更新しました。',
    })
  }),

  // プラン変更API
  http.post('*/api/v1/account/plan-change', async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    const body = (await request.json()) as PlanChangeRequest
    return HttpResponse.json({
      success: true,
      message: 'プラン変更を受け付けました。翌月1日より適用されます。',
      effectiveDate: '2026-04-01',
      newPlanId: body.newPlanId,
    })
  }),

  // オプション追加API
  http.post('*/api/v1/account/options', async ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    const body = (await request.json()) as AddOptionRequest
    return HttpResponse.json({
      success: true,
      message: 'オプションを追加しました。',
      optionId: body.optionId,
    })
  }),

  // オプション解除API
  http.delete('*/api/v1/account/options/:optionId', ({ request }) => {
    if (!isAuthenticated(request)) return unauthorizedResponse()
    return HttpResponse.json({
      success: true,
      message: 'オプションを解除しました。月末で適用終了となります。',
    })
  }),
]
