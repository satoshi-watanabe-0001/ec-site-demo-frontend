/**
 * @fileoverview アカウント管理用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページのアカウント管理APIモックハンドラー。
 * プロフィール、契約、請求、データ使用量、オプション等のエンドポイントを提供。
 */

import { http, HttpResponse } from 'msw'
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  NotificationSettings,
  NotificationsResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/types/account'
import type {
  ContractDetail,
  ContractPlan,
  AvailableOption,
  AvailablePlansResponse,
  AvailableOptionsResponse,
  DevicesResponse,
  ContractDevice,
} from '@/types/contract'
import type { CurrentBilling, BillingHistoryResponse, PaymentMethod } from '@/types/billing'
import type {
  DataUsage,
  DataUsageHistoryResponse,
  DataChargeHistoryResponse,
} from '@/types/data-usage'

/**
 * モック用ユーザープロフィールデータ
 */
const mockProfile: UserProfile = {
  id: 'user-001',
  name: 'テストユーザー',
  email: 'test@docomo.ne.jp',
  phoneNumber: '090-1234-5678',
  dateOfBirth: '1990-01-15',
  address: {
    postalCode: '100-0001',
    prefecture: '東京都',
    city: '千代田区千代田',
    street: '1-1-1',
    building: 'テストビル 301号室',
  },
  registeredAt: '2024-01-01T00:00:00Z',
  updatedAt: '2025-12-01T10:00:00Z',
}

/**
 * モック用通知設定データ
 */
const mockNotificationSettings: NotificationSettings = {
  emailNotification: true,
  smsNotification: false,
  pushNotification: true,
  campaignInfo: true,
  billingNotification: true,
  dataUsageAlert: true,
  dataUsageAlertThreshold: 80,
}

/**
 * モック用契約プランデータ
 */
const mockCurrentPlan: ContractPlan = {
  id: 'plan-ahamo',
  name: 'ahamo',
  monthlyPrice: 2970,
  dataCapacity: 20,
  freeCallMinutes: 5,
  description: '20GBのデータ通信と5分以内の国内通話無料',
  features: [
    '20GBのデータ通信',
    '5分以内の国内通話無料',
    '海外82カ国でのデータ通信',
    'dカード特典',
  ],
}

/**
 * モック用契約端末データ
 */
const mockDevice: ContractDevice = {
  id: 'device-001',
  name: 'iPhone 16 Pro',
  manufacturer: 'Apple',
  imageUrl: '/images/devices/iphone-16-pro.png',
  imei: '123456789012345',
  purchaseDate: '2025-09-20',
  installmentInfo: {
    totalInstallments: 36,
    remainingInstallments: 24,
    monthlyAmount: 4438,
    totalAmount: 159800,
    remainingAmount: 106512,
  },
  color: 'ナチュラルチタニウム',
  storage: '256GB',
}

/**
 * モック用契約詳細データ
 */
const mockContract: ContractDetail = {
  id: 'contract-001',
  contractNumber: 'AHM-2024-001234',
  status: 'active',
  startDate: '2024-01-01',
  currentPlan: mockCurrentPlan,
  device: mockDevice,
  options: [
    {
      id: 'opt-001',
      name: 'ahamo大盛り',
      monthlyPrice: 1980,
      description: 'データ容量を+80GBで合計100GB',
      subscribedAt: '2024-06-01T00:00:00Z',
      status: 'active',
    },
    {
      id: 'opt-002',
      name: 'かけ放題オプション',
      monthlyPrice: 1100,
      description: '国内通話がかけ放題',
      subscribedAt: '2024-01-01T00:00:00Z',
      status: 'active',
    },
  ],
  simInfo: {
    simType: 'esim',
    phoneNumber: '090-1234-5678',
    iccidLast4: '5678',
  },
  updatedAt: '2025-12-01T10:00:00Z',
}

/**
 * モック用データ使用量データ
 */
const mockDataUsage: DataUsage = {
  month: '2026-03',
  totalCapacity: 100,
  usedData: 45.2,
  remainingData: 54.8,
  usagePercentage: 45.2,
  additionalData: 0,
  isThrottled: false,
  dailyUsage: [
    { date: '2026-03-01', usage: 1.5 },
    { date: '2026-03-02', usage: 2.3 },
    { date: '2026-03-03', usage: 1.8 },
    { date: '2026-03-04', usage: 3.1 },
    { date: '2026-03-05', usage: 2.0 },
    { date: '2026-03-06', usage: 1.2 },
    { date: '2026-03-07', usage: 4.5 },
    { date: '2026-03-08', usage: 2.8 },
    { date: '2026-03-09', usage: 1.9 },
    { date: '2026-03-10', usage: 3.2 },
    { date: '2026-03-11', usage: 2.1 },
    { date: '2026-03-12', usage: 1.7 },
    { date: '2026-03-13', usage: 2.5 },
    { date: '2026-03-14', usage: 3.8 },
    { date: '2026-03-15', usage: 2.0 },
    { date: '2026-03-16', usage: 1.4 },
    { date: '2026-03-17', usage: 2.9 },
    { date: '2026-03-18', usage: 1.6 },
    { date: '2026-03-19', usage: 2.4 },
    { date: '2026-03-20', usage: 0.5 },
  ],
  updatedAt: '2026-03-03T09:00:00Z',
}

/**
 * モック用現在の請求情報データ
 */
const mockCurrentBilling: CurrentBilling = {
  billingMonth: '2026-03',
  basicCharge: 2970,
  optionCharges: 3080,
  callCharges: 220,
  dataAdditionalCharges: 0,
  discountAmount: 187,
  tax: 604,
  totalAmount: 6687,
  isConfirmed: false,
  details: [
    { name: 'ahamo基本料金', amount: 2970, category: 'basic' },
    { name: 'ahamo大盛り', amount: 1980, category: 'option' },
    { name: 'かけ放題オプション', amount: 1100, category: 'option' },
    { name: '通話料金（5分超過分）', amount: 220, category: 'call' },
    { name: 'dカード割引', amount: -187, category: 'discount' },
    { name: '消費税', amount: 604, category: 'tax' },
  ],
  confirmedAt: undefined,
}

/**
 * モック用支払い方法データ
 */
const mockPaymentMethod: PaymentMethod = {
  id: 'payment-001',
  type: 'credit_card',
  cardInfo: {
    brand: 'dカード',
    last4: '1234',
    expiryDate: '12/28',
    holderName: 'テスト ユーザー',
  },
  isDefault: true,
  registeredAt: '2024-01-01T00:00:00Z',
}

/**
 * モック用利用可能プランデータ
 */
const mockAvailablePlans: ContractPlan[] = [
  {
    id: 'plan-ahamo',
    name: 'ahamo',
    monthlyPrice: 2970,
    dataCapacity: 20,
    freeCallMinutes: 5,
    description: '20GBのデータ通信と5分以内の国内通話無料',
    features: ['20GBのデータ通信', '5分以内の国内通話無料', '海外82カ国でのデータ通信'],
  },
  {
    id: 'plan-ahamo-large',
    name: 'ahamo大盛り',
    monthlyPrice: 4950,
    dataCapacity: 100,
    freeCallMinutes: 5,
    description: '100GBのデータ通信と5分以内の国内通話無料',
    features: [
      '100GBのデータ通信',
      '5分以内の国内通話無料',
      '海外82カ国でのデータ通信',
      'テザリング無制限',
    ],
  },
]

/**
 * モック用利用可能オプションデータ
 */
const mockAvailableOptions: AvailableOption[] = [
  {
    id: 'opt-001',
    name: 'ahamo大盛り',
    monthlyPrice: 1980,
    description: 'データ容量を+80GBで合計100GB',
    features: ['+80GBデータ追加', 'テザリング無制限', '速度制限なし'],
    isSubscribed: true,
    category: 'data',
  },
  {
    id: 'opt-002',
    name: 'かけ放題オプション',
    monthlyPrice: 1100,
    description: '国内通話がかけ放題',
    features: ['国内通話かけ放題', '24時間対応'],
    isSubscribed: true,
    category: 'call',
  },
  {
    id: 'opt-003',
    name: 'ケータイ補償サービス',
    monthlyPrice: 825,
    description: '端末の故障・紛失時の補償',
    features: ['故障時の交換', '紛失時の補償', '画面割れ修理'],
    isSubscribed: false,
    category: 'insurance',
  },
  {
    id: 'opt-004',
    name: 'Disney+',
    monthlyPrice: 990,
    description: 'Disney+の月額プラン',
    features: ['映画・ドラマ見放題', '4K対応', '同時視聴4台'],
    isSubscribed: false,
    category: 'entertainment',
  },
  {
    id: 'opt-005',
    name: 'あんしんセキュリティ',
    monthlyPrice: 220,
    description: 'ウイルス対策・迷惑電話ブロック',
    features: ['ウイルス対策', '迷惑電話ブロック', 'Wi-Fiセキュリティ'],
    isSubscribed: false,
    category: 'security',
  },
]

/**
 * 共通のタイムスタンプ生成
 */
const timestamp = (): string => new Date().toISOString()

/**
 * アカウント管理用MSWハンドラー
 */
export const accountHandlers = [
  // ========================================
  // プロフィール関連
  // ========================================

  /** プロフィール取得 */
  http.get('*/api/v1/account/profile', () => {
    return HttpResponse.json(mockProfile)
  }),

  /** プロフィール更新 */
  http.put('*/api/v1/account/profile', async ({ request }) => {
    const body = (await request.json()) as UpdateProfileRequest
    const updatedProfile: UserProfile = {
      ...mockProfile,
      ...body,
      address: { ...mockProfile.address, ...(body.address || {}) },
      updatedAt: timestamp(),
    }
    return HttpResponse.json(updatedProfile)
  }),

  /** パスワード変更 */
  http.put('*/api/v1/account/password', async ({ request }) => {
    const body = (await request.json()) as ChangePasswordRequest
    if (body.currentPassword !== 'password123') {
      const error: ApiErrorResponse = {
        status: 'error',
        message: '現在のパスワードが正しくありません',
        errorCode: 'INVALID_PASSWORD',
        timestamp: timestamp(),
      }
      return HttpResponse.json(error, { status: 400 })
    }
    const success: ApiSuccessResponse = {
      status: 'success',
      message: 'パスワードを変更しました',
    }
    return HttpResponse.json(success)
  }),

  // ========================================
  // 契約関連
  // ========================================

  /** 契約詳細取得 */
  http.get('*/api/v1/account/contract', () => {
    return HttpResponse.json(mockContract)
  }),

  // ========================================
  // データ使用量関連
  // ========================================

  /** 当月データ使用量取得 */
  http.get('*/api/v1/account/data-usage', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  /** データ使用量履歴取得 */
  http.get('*/api/v1/account/data-usage/history', () => {
    const response: DataUsageHistoryResponse = {
      history: [
        {
          month: '2026-03',
          totalCapacity: 100,
          usedData: 45.2,
          usagePercentage: 45.2,
          additionalData: 0,
        },
        {
          month: '2026-02',
          totalCapacity: 100,
          usedData: 78.5,
          usagePercentage: 78.5,
          additionalData: 0,
        },
        {
          month: '2026-01',
          totalCapacity: 100,
          usedData: 62.3,
          usagePercentage: 62.3,
          additionalData: 0,
        },
        {
          month: '2025-12',
          totalCapacity: 20,
          usedData: 18.7,
          usagePercentage: 93.5,
          additionalData: 0,
        },
        {
          month: '2025-11',
          totalCapacity: 20,
          usedData: 15.2,
          usagePercentage: 76.0,
          additionalData: 0,
        },
        {
          month: '2025-10',
          totalCapacity: 20,
          usedData: 19.8,
          usagePercentage: 99.0,
          additionalData: 1.0,
        },
      ],
      totalCount: 6,
    }
    return HttpResponse.json(response)
  }),

  /** データチャージ履歴取得 */
  http.get('*/api/v1/account/data-charge/history', () => {
    const response: DataChargeHistoryResponse = {
      history: [
        {
          id: 'charge-001',
          chargedAt: '2025-10-25T14:30:00Z',
          amount: 1.0,
          price: 550,
          type: 'manual',
        },
        {
          id: 'charge-002',
          chargedAt: '2025-08-15T09:00:00Z',
          amount: 1.0,
          price: 550,
          type: 'auto',
        },
        {
          id: 'charge-003',
          chargedAt: '2025-06-01T00:00:00Z',
          amount: 3.0,
          price: 0,
          type: 'campaign',
        },
      ],
      totalCount: 3,
    }
    return HttpResponse.json(response)
  }),

  // ========================================
  // 請求関連
  // ========================================

  /** 現在の請求情報取得 */
  http.get('*/api/v1/account/billing/current', () => {
    return HttpResponse.json(mockCurrentBilling)
  }),

  /** 請求履歴取得 */
  http.get('*/api/v1/account/billing/history', () => {
    const response: BillingHistoryResponse = {
      history: [
        {
          billingMonth: '2026-02',
          totalAmount: 6687,
          paymentStatus: 'paid',
          paidAt: '2026-02-26',
          isConfirmed: true,
        },
        {
          billingMonth: '2026-01',
          totalAmount: 6687,
          paymentStatus: 'paid',
          paidAt: '2026-01-26',
          isConfirmed: true,
        },
        {
          billingMonth: '2025-12',
          totalAmount: 4290,
          paymentStatus: 'paid',
          paidAt: '2025-12-26',
          isConfirmed: true,
        },
        {
          billingMonth: '2025-11',
          totalAmount: 4290,
          paymentStatus: 'paid',
          paidAt: '2025-11-26',
          isConfirmed: true,
        },
        {
          billingMonth: '2025-10',
          totalAmount: 4840,
          paymentStatus: 'paid',
          paidAt: '2025-10-26',
          isConfirmed: true,
        },
        {
          billingMonth: '2025-09',
          totalAmount: 4290,
          paymentStatus: 'paid',
          paidAt: '2025-09-26',
          isConfirmed: true,
        },
      ],
      totalCount: 6,
    }
    return HttpResponse.json(response)
  }),

  // ========================================
  // 支払い方法関連
  // ========================================

  /** 支払い方法取得 */
  http.get('*/api/v1/account/payment-method', () => {
    return HttpResponse.json(mockPaymentMethod)
  }),

  /** 支払い方法更新 */
  http.put('*/api/v1/account/payment-method', () => {
    const success: ApiSuccessResponse = {
      status: 'success',
      message: '支払い方法を更新しました',
    }
    return HttpResponse.json(success)
  }),

  // ========================================
  // プラン関連
  // ========================================

  /** 現在のプラン取得 */
  http.get('*/api/v1/account/plan', () => {
    const response: AvailablePlansResponse = {
      plans: mockAvailablePlans,
      currentPlanId: 'plan-ahamo',
    }
    return HttpResponse.json(response)
  }),

  /** プラン変更 */
  http.put('*/api/v1/account/plan', () => {
    const success: ApiSuccessResponse = {
      status: 'success',
      message: 'プランを変更しました。次の請求サイクルから適用されます',
    }
    return HttpResponse.json(success)
  }),

  // ========================================
  // オプション関連
  // ========================================

  /** 利用可能オプション一覧取得 */
  http.get('*/api/v1/account/options', () => {
    const response: AvailableOptionsResponse = {
      options: mockAvailableOptions,
      totalCount: mockAvailableOptions.length,
    }
    return HttpResponse.json(response)
  }),

  /** オプション追加 */
  http.post('*/api/v1/account/options/:optionId', () => {
    const success: ApiSuccessResponse = {
      status: 'success',
      message: 'オプションを追加しました',
    }
    return HttpResponse.json(success)
  }),

  /** オプション解除 */
  http.delete('*/api/v1/account/options/:optionId', () => {
    const success: ApiSuccessResponse = {
      status: 'success',
      message: 'オプションを解除しました',
    }
    return HttpResponse.json(success)
  }),

  // ========================================
  // 通知関連
  // ========================================

  /** 通知一覧取得 */
  http.get('*/api/v1/account/notifications', () => {
    const response: NotificationsResponse = {
      notifications: [
        {
          id: 'notif-001',
          title: '請求金額確定のお知らせ',
          message: '2026年2月分の請求金額が確定しました。合計: 6,687円',
          type: 'billing',
          isRead: false,
          createdAt: '2026-02-20T09:00:00Z',
          linkUrl: '/mypage/billing',
        },
        {
          id: 'notif-002',
          title: 'データ使用量アラート',
          message: '当月のデータ使用量が80%を超えました',
          type: 'warning',
          isRead: false,
          createdAt: '2026-02-15T14:30:00Z',
          linkUrl: '/mypage/data-usage',
        },
        {
          id: 'notif-003',
          title: '春のキャンペーン開始',
          message: '新しいキャンペーンが始まりました。詳しくはこちら',
          type: 'campaign',
          isRead: true,
          createdAt: '2026-03-01T00:00:00Z',
        },
        {
          id: 'notif-004',
          title: 'システムメンテナンスのお知らせ',
          message: '3月10日 2:00-5:00にシステムメンテナンスを実施します',
          type: 'system',
          isRead: true,
          createdAt: '2026-02-28T10:00:00Z',
        },
      ],
      unreadCount: 2,
      totalCount: 4,
    }
    return HttpResponse.json(response)
  }),

  /** 通知設定更新 */
  http.put('*/api/v1/account/notification-settings', async ({ request }) => {
    const body = (await request.json()) as NotificationSettings
    // モックではリクエストボディを既存設定にマージして返す
    const updated: NotificationSettings = {
      ...mockNotificationSettings,
      ...body,
    }
    return HttpResponse.json({
      status: 'success',
      message: '通知設定を更新しました',
      settings: updated,
    })
  }),

  // ========================================
  // 端末関連
  // ========================================

  /** 端末情報取得 */
  http.get('*/api/v1/account/devices', () => {
    const response: DevicesResponse = {
      devices: [mockDevice],
      totalCount: 1,
    }
    return HttpResponse.json(response)
  }),
]
