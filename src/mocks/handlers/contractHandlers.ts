/**
 * @fileoverview 契約・請求関連MSWハンドラー
 * @module mocks/handlers/contractHandlers
 *
 * 契約情報、データ使用量、請求情報、通知のモックAPI。
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardResponse,
  ContractResponse,
  DataUsageResponse,
  BillingResponse,
  BillingHistoryResponse,
  NotificationsResponse,
} from '@/types'

const mockDashboard: DashboardResponse = {
  dashboard: {
    plan: {
      name: 'ahamo',
      type: 'ahamo',
      monthlyFee: 2970,
      dataCapacityGB: 20,
    },
    dataUsage: {
      usedGB: 12.5,
      totalCapacityGB: 20,
      remainingGB: 7.5,
      usagePercent: 62.5,
      lastUpdated: '2026-02-19T09:00:00Z',
    },
    billing: {
      currentMonthEstimate: 3520,
      baseFee: 2970,
      usageAndOptionCharges: 550,
      previousMonthTotal: 2970,
    },
    device: {
      name: 'iPhone 15 Pro',
      imageUrl: '/images/devices/iphone15pro.png',
      purchaseDate: '2025-09-15',
      paymentStatus: 'installment',
      remainingBalance: 48000,
    },
    notifications: {
      unreadCount: 3,
      importantAnnouncements: [
        {
          id: 'notif-001',
          title: 'ahamo大盛りオプション キャンペーン実施中',
          createdAt: '2026-02-15T10:00:00Z',
        },
        {
          id: 'notif-002',
          title: 'システムメンテナンスのお知らせ（2/25）',
          createdAt: '2026-02-14T09:00:00Z',
        },
      ],
    },
  },
}

const mockContract: ContractResponse = {
  contract: {
    contractId: 'CT-2025-001234',
    phoneNumber: '090-1234-5678',
    plan: {
      id: 'plan-ahamo',
      name: 'ahamo',
      type: 'ahamo',
      monthlyFee: 2970,
      dataCapacityGB: 20,
      description: '20GB + 5分以内の国内通話無料',
    },
    device: {
      id: 'device-001',
      name: 'iPhone 15 Pro',
      imageUrl: '/images/devices/iphone15pro.png',
      purchaseDate: '2025-09-15',
      paymentStatus: 'installment',
      remainingBalance: 48000,
      totalInstallments: 36,
      completedInstallments: 5,
    },
    contractStartDate: '2025-09-15',
    status: 'active',
    simType: 'physical',
  },
}

const mockDataUsage: DataUsageResponse = {
  dataUsage: {
    totalCapacityGB: 20,
    usedGB: 12.5,
    remainingGB: 7.5,
    usagePercent: 62.5,
    lastUpdated: '2026-02-19T09:00:00Z',
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
    dailyUsage: [
      { date: '2026-02-01', usageGB: 0.8 },
      { date: '2026-02-02', usageGB: 0.5 },
      { date: '2026-02-03', usageGB: 1.2 },
      { date: '2026-02-04', usageGB: 0.3 },
      { date: '2026-02-05', usageGB: 0.9 },
      { date: '2026-02-06', usageGB: 0.7 },
      { date: '2026-02-07', usageGB: 1.5 },
      { date: '2026-02-08', usageGB: 0.4 },
      { date: '2026-02-09', usageGB: 0.6 },
      { date: '2026-02-10', usageGB: 0.8 },
      { date: '2026-02-11', usageGB: 1.1 },
      { date: '2026-02-12', usageGB: 0.5 },
      { date: '2026-02-13', usageGB: 0.7 },
      { date: '2026-02-14', usageGB: 0.9 },
      { date: '2026-02-15', usageGB: 0.3 },
      { date: '2026-02-16', usageGB: 0.6 },
      { date: '2026-02-17', usageGB: 0.4 },
      { date: '2026-02-18', usageGB: 0.8 },
      { date: '2026-02-19', usageGB: 0.3 },
    ],
  },
}

const mockBilling: BillingResponse = {
  billing: {
    billingMonth: '2026-02',
    breakdown: {
      baseFee: 2970,
      usageCharges: 0,
      optionCharges: 550,
      discount: 0,
      tax: 320,
      total: 3840,
    },
    paymentMethod: 'クレジットカード（**** 1234）',
    paymentStatus: 'pending',
    dueDate: '2026-03-25',
    previousMonthTotal: 2970,
  },
}

const mockBillingHistory: BillingHistoryResponse = {
  history: [
    { billingMonth: '2026-01', total: 2970, paymentStatus: 'paid', paidDate: '2026-02-25' },
    { billingMonth: '2025-12', total: 3200, paymentStatus: 'paid', paidDate: '2026-01-25' },
    { billingMonth: '2025-11', total: 2970, paymentStatus: 'paid', paidDate: '2025-12-25' },
    { billingMonth: '2025-10', total: 4950, paymentStatus: 'paid', paidDate: '2025-11-25' },
    { billingMonth: '2025-09', total: 2970, paymentStatus: 'paid', paidDate: '2025-10-25' },
  ],
  totalCount: 5,
}

const mockNotifications: NotificationsResponse = {
  notifications: [
    {
      id: 'notif-001',
      title: 'ahamo大盛りオプション キャンペーン実施中',
      message:
        '今なら ahamo大盛りオプション（+80GB）が初月無料！期間限定キャンペーンをお見逃しなく。',
      type: 'important',
      isRead: false,
      createdAt: '2026-02-15T10:00:00Z',
    },
    {
      id: 'notif-002',
      title: 'システムメンテナンスのお知らせ（2/25）',
      message:
        '2月25日 2:00-5:00にシステムメンテナンスを実施します。この間、一部サービスがご利用いただけません。',
      type: 'warning',
      isRead: false,
      createdAt: '2026-02-14T09:00:00Z',
    },
    {
      id: 'notif-003',
      title: 'ご利用料金確定のお知らせ',
      message: '1月分のご利用料金が確定しました。マイページからご確認ください。',
      type: 'info',
      isRead: false,
      createdAt: '2026-02-10T08:00:00Z',
    },
    {
      id: 'notif-004',
      title: 'データ使用量が80%を超えました',
      message: '今月のデータ使用量が16GBに達しました。残り4GBです。',
      type: 'warning',
      isRead: true,
      createdAt: '2026-02-08T12:00:00Z',
    },
  ],
  unreadCount: 3,
}

export const contractHandlers = [
  http.get('*/api/v1/mypage/dashboard', () => {
    return HttpResponse.json(mockDashboard)
  }),

  http.get('*/api/v1/mypage/contract', () => {
    return HttpResponse.json(mockContract)
  }),

  http.get('*/api/v1/mypage/data-usage', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  http.get('*/api/v1/mypage/billing', () => {
    return HttpResponse.json(mockBilling)
  }),

  http.get('*/api/v1/mypage/billing/history', () => {
    return HttpResponse.json(mockBillingHistory)
  }),

  http.get('*/api/v1/mypage/notifications', () => {
    return HttpResponse.json(mockNotifications)
  }),
]
