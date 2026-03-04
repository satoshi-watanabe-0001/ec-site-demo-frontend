/**
 * @fileoverview アカウント管理API用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページ関連APIのモックハンドラー。
 * リアルな日本のモバイルキャリアデータを使用。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardResponse,
  ContractDetailResponse,
  DataUsageDetailResponse,
  BillingDetailResponse,
  AccountSettingsResponse,
  UpdateSettingsRequest,
  ChangePasswordRequest,
  PlansResponse,
  ChangePlanRequest,
  OptionsResponse,
  ApiSuccessResponse,
  AvailableOption,
} from '@/types/account'

/**
 * 認証チェック
 * Authorizationヘッダーの存在のみ確認（任意のBearerトークンを受け入れ）
 */
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return !!authHeader && authHeader.startsWith('Bearer ')
}

/**
 * 未認証レスポンスを返す
 */
function unauthorizedResponse() {
  return HttpResponse.json(
    {
      status: 'error' as const,
      message: '認証が必要です。再度ログインしてください。',
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  )
}

// ============================================================
// モックデータ
// ============================================================

const mockDashboard: DashboardResponse = {
  plan: {
    planId: 'ahamo-20',
    planName: 'ahamo',
    monthlyPrice: 2970,
    dataCapacity: 20,
    contractStartDate: '2023-04-01',
    status: 'active',
  },
  dataUsage: {
    usedData: 12.5,
    remainingData: 7.5,
    totalData: 20,
    updatedAt: '2024-03-15T10:30:00+09:00',
  },
  billing: {
    currentMonth: 3470,
    billingDate: '2024-03-25',
    paymentMethod: 'クレジットカード（VISA **** 1234）',
    paymentStatus: 'pending',
  },
  device: {
    deviceId: 'device-001',
    deviceName: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    purchaseDate: '2024-03-15',
    imei: '353456789012345',
    installmentRemaining: 22,
    installmentMonthly: 3450,
  },
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量のお知らせ',
      message: '今月のデータ使用量が60%を超えました。',
      type: 'warning',
      createdAt: '2024-03-14T09:00:00+09:00',
      isRead: false,
    },
    {
      id: 'notif-002',
      title: '請求確定のお知らせ',
      message: '3月分の請求が確定しました。請求額: ¥3,470',
      type: 'billing',
      createdAt: '2024-03-10T12:00:00+09:00',
      isRead: true,
    },
    {
      id: 'notif-003',
      title: '春のキャンペーン開催中',
      message: 'ahamo大盛りが初月無料！期間限定キャンペーンを実施中です。',
      type: 'campaign',
      createdAt: '2024-03-01T00:00:00+09:00',
      isRead: true,
    },
  ],
}

const mockContractDetail: ContractDetailResponse = {
  plan: mockDashboard.plan,
  phoneNumber: '090-1234-5678',
  device: mockDashboard.device,
  sim: {
    simType: 'eSIM',
    iccid: '8981100000000000000',
  },
  options: [
    {
      optionId: 'opt-001',
      optionName: 'かけ放題オプション',
      monthlyPrice: 1100,
      enrolledDate: '2023-06-01',
    },
  ],
}

const mockDataUsageDetail: DataUsageDetailResponse = {
  current: mockDashboard.dataUsage,
  dailyHistory: [
    { date: '2024-03-15', usage: 0.8 },
    { date: '2024-03-14', usage: 1.2 },
    { date: '2024-03-13', usage: 0.5 },
    { date: '2024-03-12', usage: 0.9 },
    { date: '2024-03-11', usage: 1.5 },
    { date: '2024-03-10', usage: 0.7 },
    { date: '2024-03-09', usage: 0.3 },
    { date: '2024-03-08', usage: 1.1 },
    { date: '2024-03-07', usage: 0.6 },
    { date: '2024-03-06', usage: 0.4 },
    { date: '2024-03-05', usage: 1.3 },
    { date: '2024-03-04', usage: 0.8 },
    { date: '2024-03-03', usage: 0.2 },
    { date: '2024-03-02', usage: 1.0 },
    { date: '2024-03-01', usage: 1.2 },
  ],
  monthlyHistory: [
    { month: '2024-03', usage: 12.5, capacity: 20 },
    { month: '2024-02', usage: 17.8, capacity: 20 },
    { month: '2024-01', usage: 15.2, capacity: 20 },
    { month: '2023-12', usage: 18.5, capacity: 20 },
    { month: '2023-11', usage: 14.3, capacity: 20 },
    { month: '2023-10', usage: 16.7, capacity: 20 },
  ],
}

const mockBillingDetail: BillingDetailResponse = {
  summary: mockDashboard.billing,
  breakdown: [
    { label: 'ahamo基本料金', amount: 2970 },
    { label: '通話料（5分超過分）', amount: 220 },
    { label: 'SMS送信料', amount: 33 },
    { label: 'ユニバーサルサービス料', amount: 2 },
    { label: '電話リレーサービス料', amount: 1 },
    { label: 'かけ放題オプション', amount: 1100 },
    { label: '割引（dカードお支払割）', amount: -187 },
    { label: '消費税相当額', amount: 331 },
  ],
  history: [
    { month: '2024-03', amount: 3470, status: 'pending', paidAt: null },
    { month: '2024-02', amount: 3280, status: 'paid', paidAt: '2024-02-27' },
    { month: '2024-01', amount: 3150, status: 'paid', paidAt: '2024-01-26' },
    { month: '2023-12', amount: 3520, status: 'paid', paidAt: '2023-12-26' },
    { month: '2023-11', amount: 3080, status: 'paid', paidAt: '2023-11-27' },
    { month: '2023-10', amount: 3350, status: 'paid', paidAt: '2023-10-26' },
  ],
}

const mockAccountSettings: AccountSettingsResponse = {
  name: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  phoneNumber: '090-1234-5678',
  notifications: {
    email: true,
    sms: false,
    dataWarning: true,
    billing: true,
  },
}

const mockPlans: PlansResponse = {
  currentPlanId: 'ahamo-20',
  plans: [
    {
      planId: 'ahamo-20',
      planName: 'ahamo',
      monthlyPrice: 2970,
      dataCapacity: 20,
      description: 'シンプルでおトクなワンプラン。20GBのデータ容量と5分以内の国内通話無料。',
      features: [
        '月間データ容量 20GB',
        '5分以内の国内通話無料',
        '海外82の国・地域でデータ通信可能',
        'テザリング無料',
        'dカードボーナスパケット +1GB',
      ],
      isCurrent: true,
    },
    {
      planId: 'ahamo-100',
      planName: 'ahamo大盛り',
      monthlyPrice: 4950,
      dataCapacity: 100,
      description: '大容量100GBのプラン。動画やSNSをたっぷり楽しめる。',
      features: [
        '月間データ容量 100GB',
        '5分以内の国内通話無料',
        '海外82の国・地域でデータ通信可能',
        'テザリング無料',
        'dカードボーナスパケット +5GB',
        '大容量で安心',
      ],
      isCurrent: false,
    },
  ],
}

/** オプション一覧（登録/解除でプロパティを変更する） */
const mockOptions: AvailableOption[] = [
  {
    optionId: 'opt-001',
    optionName: 'かけ放題オプション',
    monthlyPrice: 1100,
    description: '国内通話が24時間かけ放題になるオプションです。',
    isEnrolled: true,
    category: '通話',
  },
  {
    optionId: 'opt-002',
    optionName: 'データ追加1GB',
    monthlyPrice: 550,
    description: 'データ容量を1GB追加できます。追加分は翌月まで繰り越し可能。',
    isEnrolled: false,
    category: 'データ',
  },
  {
    optionId: 'opt-003',
    optionName: 'あんしんセキュリティ',
    monthlyPrice: 220,
    description: 'ウイルス対策、危険サイト対策などのセキュリティ機能を提供。',
    isEnrolled: false,
    category: 'セキュリティ',
  },
  {
    optionId: 'opt-004',
    optionName: 'ケータイ補償サービス',
    monthlyPrice: 825,
    description: '故障・水濡れ・紛失時にリフレッシュ品と交換できる補償サービス。',
    isEnrolled: false,
    category: '補償',
  },
  {
    optionId: 'opt-005',
    optionName: 'Disney+（ディズニープラス）',
    monthlyPrice: 990,
    description: 'ディズニー、ピクサー、マーベルなどの作品が見放題。',
    isEnrolled: false,
    category: 'エンタメ',
  },
]

// ============================================================
// ハンドラー
// ============================================================

export const accountHandlers = [
  // ダッシュボード
  http.get('*/api/v1/account/dashboard', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockDashboard)
  }),

  // 契約詳細
  http.get('*/api/v1/account/contract', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockContractDetail)
  }),

  // データ使用量詳細
  http.get('*/api/v1/account/data-usage', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockDataUsageDetail)
  }),

  // 請求詳細
  http.get('*/api/v1/account/billing', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockBillingDetail)
  }),

  // アカウント設定取得
  http.get('*/api/v1/account/settings', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockAccountSettings)
  }),

  // アカウント設定更新
  http.put('*/api/v1/account/settings', async ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const body = (await request.json()) as UpdateSettingsRequest
    // モックデータを更新
    mockAccountSettings.name = body.name
    mockAccountSettings.email = body.email
    mockAccountSettings.notifications = body.notifications
    const response: ApiSuccessResponse = {
      status: 'success',
      message: 'アカウント設定を更新しました。',
    }
    return HttpResponse.json(response)
  }),

  // パスワード変更
  http.put('*/api/v1/account/password', async ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const body = (await request.json()) as ChangePasswordRequest
    // 現在のパスワード検証（モック: password123が正しい）
    if (body.currentPassword !== 'password123') {
      return HttpResponse.json(
        {
          status: 'error',
          message: '現在のパスワードが正しくありません。',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }
    const response: ApiSuccessResponse = {
      status: 'success',
      message: 'パスワードを変更しました。',
    }
    return HttpResponse.json(response)
  }),

  // プラン一覧取得
  http.get('*/api/v1/account/plans', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    return HttpResponse.json(mockPlans)
  }),

  // プラン変更
  http.put('*/api/v1/account/plan', async ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const body = (await request.json()) as ChangePlanRequest
    const plan = mockPlans.plans.find(p => p.planId === body.planId)
    if (!plan) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '指定されたプランが見つかりません。',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }
    // モックデータを更新
    mockPlans.currentPlanId = body.planId
    mockPlans.plans.forEach(p => {
      p.isCurrent = p.planId === body.planId
    })
    const response: ApiSuccessResponse = {
      status: 'success',
      message: `プランを${plan.planName}に変更しました。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション一覧取得
  http.get('*/api/v1/account/options', ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const response: OptionsResponse = { options: mockOptions }
    return HttpResponse.json(response)
  }),

  // オプション登録
  http.post('*/api/v1/account/options/:optionId', ({ request, params }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)
    if (!option) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '指定されたオプションが見つかりません。',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }
    option.isEnrolled = true
    const response: ApiSuccessResponse = {
      status: 'success',
      message: `${option.optionName}に登録しました。`,
    }
    return HttpResponse.json(response)
  }),

  // オプション解除
  http.delete('*/api/v1/account/options/:optionId', ({ request, params }) => {
    if (!checkAuth(request)) return unauthorizedResponse()
    const { optionId } = params
    const option = mockOptions.find(o => o.optionId === optionId)
    if (!option) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '指定されたオプションが見つかりません。',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }
    option.isEnrolled = false
    const response: ApiSuccessResponse = {
      status: 'success',
      message: `${option.optionName}を解除しました。`,
    }
    return HttpResponse.json(response)
  }),
]
