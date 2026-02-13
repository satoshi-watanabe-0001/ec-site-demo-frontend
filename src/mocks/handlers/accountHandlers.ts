/**
 * @fileoverview アカウント管理用MSWハンドラー
 * @module mocks/handlers/accountHandlers
 *
 * マイページ・契約情報・データ使用量・請求情報のモックハンドラー。
 * アカウント管理APIが完全に実装されるまでの暫定対応。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardData,
  ContractInfo,
  DataUsage,
  BillingInfo,
  DeviceInfo,
  NotificationInfo,
} from '@/types'

const mockContract: ContractInfo = {
  id: 'contract-001',
  planName: 'ahamo',
  monthlyFee: 2970,
  dataCapacity: '30GB',
  contractDate: '2024-04-01',
  phoneNumber: '090-1234-5678',
  options: [
    {
      id: 'opt-001',
      name: 'かけ放題オプション',
      monthlyFee: 1100,
      description: '国内通話かけ放題',
    },
  ],
}

const mockDataUsage: DataUsage = {
  contractId: 'contract-001',
  currentMonth: {
    used: 12800,
    total: 30720,
    lastUpdated: '2026-02-13T08:00:00Z',
  },
  dailyUsage: [
    { date: '2026-02-01', used: 980 },
    { date: '2026-02-02', used: 1200 },
    { date: '2026-02-03', used: 850 },
    { date: '2026-02-04', used: 1500 },
    { date: '2026-02-05', used: 920 },
    { date: '2026-02-06', used: 1100 },
    { date: '2026-02-07', used: 780 },
    { date: '2026-02-08', used: 1350 },
    { date: '2026-02-09', used: 1020 },
    { date: '2026-02-10', used: 890 },
    { date: '2026-02-11', used: 1150 },
    { date: '2026-02-12', used: 760 },
    { date: '2026-02-13', used: 300 },
  ],
}

const mockBilling: BillingInfo = {
  contractId: 'contract-001',
  currentBill: {
    basicFee: 2970,
    optionFee: 1100,
    callFee: 220,
    total: 4290,
    previousMonthTotal: 4070,
  },
  history: [
    { month: '2026-01', basicFee: 2970, optionFee: 1100, callFee: 0, total: 4070 },
    { month: '2025-12', basicFee: 2970, optionFee: 1100, callFee: 440, total: 4510 },
    { month: '2025-11', basicFee: 2970, optionFee: 1100, callFee: 110, total: 4180 },
  ],
}

const mockDevice: DeviceInfo = {
  id: 'device-001',
  name: 'iPhone 16 Pro',
  imageUrl: '/images/devices/iphone-16-pro.png',
  purchaseDate: '2024-09-20',
  remainingBalance: 95880,
}

const mockNotifications: NotificationInfo = {
  unreadCount: 3,
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量のお知らせ',
      message: '今月のデータ使用量が50%を超えました。',
      date: '2026-02-10T10:00:00Z',
      isRead: false,
      type: 'info',
    },
    {
      id: 'notif-002',
      title: '請求確定のお知らせ',
      message: '1月分の請求額が確定しました。合計: ¥4,070',
      date: '2026-02-05T09:00:00Z',
      isRead: false,
      type: 'info',
    },
    {
      id: 'notif-003',
      title: 'ahamo大盛りキャンペーン',
      message: '期間限定！ahamo大盛りオプションが初月無料でお試しいただけます。',
      date: '2026-02-01T12:00:00Z',
      isRead: false,
      type: 'important',
    },
    {
      id: 'notif-004',
      title: 'システムメンテナンスのお知らせ',
      message: '2026年2月15日 2:00〜5:00の間、一部サービスがご利用いただけません。',
      date: '2026-01-28T15:00:00Z',
      isRead: true,
      type: 'warning',
    },
    {
      id: 'notif-005',
      title: '端末保証サービスのご案内',
      message: 'お使いの端末に保証サービスを追加しませんか？月額550円でご加入いただけます。',
      date: '2026-01-20T11:00:00Z',
      isRead: true,
      type: 'info',
    },
  ],
}

/**
 * アカウント管理用MSWハンドラー
 */
export const accountHandlers = [
  http.get('*/api/v1/mypage/dashboard', () => {
    const response: DashboardData = {
      contract: mockContract,
      dataUsage: mockDataUsage,
      billing: mockBilling,
      device: mockDevice,
      notifications: mockNotifications,
    }
    return HttpResponse.json(response)
  }),

  http.get('*/api/v1/contracts/:contractId', () => {
    return HttpResponse.json(mockContract)
  }),

  http.get('*/api/v1/data-usage/:contractId', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  http.get('*/api/v1/billing/:contractId', () => {
    return HttpResponse.json(mockBilling)
  }),

  http.get('*/api/v1/devices/:contractId', () => {
    return HttpResponse.json(mockDevice)
  }),

  http.get('*/api/v1/notifications/:userId', () => {
    return HttpResponse.json(mockNotifications)
  }),
]
