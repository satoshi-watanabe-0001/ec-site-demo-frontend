/**
 * @fileoverview 契約・請求情報用MSWハンドラー
 * @module mocks/handlers/contractHandlers
 */

import { http, HttpResponse } from 'msw'
import type {
  DashboardResponse,
  ContractDetail,
  DataUsageDetail,
  BillingDetail,
  BillingHistoryResponse,
  NotificationsResponse,
} from '@/types'

const mockDashboard: DashboardResponse = {
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacityGB: 20,
    description: '20GB + 5分かけ放題',
  },
  dataUsage: {
    usedGB: 12.5,
    totalGB: 20,
    usagePercentage: 62.5,
    remainingGB: 7.5,
    lastUpdated: '2026-02-19T10:00:00Z',
  },
  billing: {
    baseFee: 2970,
    usageCharges: 0,
    optionCharges: 550,
    totalAmount: 3520,
    previousMonthAmount: 2970,
    billingMonth: '2026年2月',
  },
  device: {
    deviceName: 'iPhone 15 Pro',
    imageUrl: '/images/devices/iphone15pro.png',
    purchaseDate: '2025-09-15',
    paymentStatus: '分割払い中',
    remainingBalance: 72000,
    monthlyPayment: 3000,
    remainingMonths: 24,
  },
  notifications: [
    {
      id: 'notif-001',
      title: 'データ使用量が80%に達しました',
      message: '当月のデータ使用量が16GBに達しました。残り4GBです。',
      type: 'warning',
      isRead: false,
      createdAt: '2026-02-18T09:00:00Z',
    },
    {
      id: 'notif-002',
      title: '2月のご利用料金が確定しました',
      message: '2026年2月分のご利用料金は3,520円です。',
      type: 'info',
      isRead: false,
      createdAt: '2026-02-15T00:00:00Z',
    },
    {
      id: 'notif-003',
      title: 'ahamo大盛りオプション キャンペーン中',
      message: '今なら ahamo大盛り（100GB）が初月無料！',
      type: 'important',
      isRead: true,
      createdAt: '2026-02-01T00:00:00Z',
    },
  ],
  unreadCount: 2,
}

const mockContractDetail: ContractDetail = {
  contractId: 'CT-2025-001234',
  contractDate: '2025-09-15',
  plan: {
    planId: 'ahamo-basic',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacityGB: 20,
    description: '20GB + 5分かけ放題',
  },
  phoneNumber: '090-****-5678',
  simType: 'eSIM',
  contractStatus: '契約中',
  autoRenewal: true,
  nextRenewalDate: '2026-09-15',
  device: {
    deviceName: 'iPhone 15 Pro',
    imageUrl: '/images/devices/iphone15pro.png',
    purchaseDate: '2025-09-15',
    paymentStatus: '分割払い中',
    remainingBalance: 72000,
    monthlyPayment: 3000,
    remainingMonths: 24,
  },
  options: [
    {
      optionId: 'opt-kakehoudai',
      optionName: 'かけ放題オプション',
      monthlyFee: 1100,
      status: 'inactive',
      startDate: '',
    },
    {
      optionId: 'opt-security',
      optionName: 'あんしんセキュリティ',
      monthlyFee: 550,
      status: 'active',
      startDate: '2025-09-15',
    },
  ],
}

const mockDataUsage: DataUsageDetail = {
  currentMonth: {
    usedGB: 12.5,
    totalGB: 20,
    usagePercentage: 62.5,
    remainingGB: 7.5,
    resetDate: '2026-03-01',
    lastUpdated: '2026-02-19T10:00:00Z',
  },
  dailyBreakdown: Array.from({ length: 19 }, (_, i) => ({
    date: `2026-02-${String(i + 1).padStart(2, '0')}`,
    usageGB: Math.round((Math.random() * 1.5 + 0.2) * 100) / 100,
  })),
  previousMonth: {
    usedGB: 15.2,
    totalGB: 20,
  },
  averageDaily: 0.66,
  projectedUsage: 18.5,
}

const mockBillingDetail: BillingDetail = {
  billingMonth: '2026年2月',
  billingDate: '2026-02-15',
  paymentDueDate: '2026-03-25',
  paymentMethod: 'クレジットカード',
  cardLastFour: '4242',
  items: [
    {
      itemName: 'ahamo基本料金',
      category: 'base',
      amount: 2970,
      description: '20GB + 5分かけ放題',
    },
    {
      itemName: 'あんしんセキュリティ',
      category: 'option',
      amount: 550,
      description: 'セキュリティオプション',
    },
    {
      itemName: '端末分割支払金',
      category: 'device',
      amount: 3000,
      description: 'iPhone 15 Pro (24回中12回目)',
    },
  ],
  subtotal: 6520,
  tax: 593,
  totalAmount: 7113,
  isPaid: false,
}

const mockBillingHistory: BillingHistoryResponse = {
  history: [
    { billingMonth: '2026年1月', totalAmount: 5970, isPaid: true, paymentDate: '2026-02-25' },
    { billingMonth: '2025年12月', totalAmount: 5970, isPaid: true, paymentDate: '2026-01-27' },
    { billingMonth: '2025年11月', totalAmount: 5970, isPaid: true, paymentDate: '2025-12-25' },
    { billingMonth: '2025年10月', totalAmount: 5970, isPaid: true, paymentDate: '2025-11-25' },
    { billingMonth: '2025年9月', totalAmount: 2970, isPaid: true, paymentDate: '2025-10-27' },
  ],
  totalCount: 5,
}

const mockNotifications: NotificationsResponse = {
  notifications: mockDashboard.notifications,
  totalCount: 3,
  unreadCount: 2,
}

export const contractHandlers = [
  http.get('*/api/v1/mypage/dashboard', () => {
    return HttpResponse.json(mockDashboard)
  }),

  http.get('*/api/v1/mypage/contract', () => {
    return HttpResponse.json(mockContractDetail)
  }),

  http.get('*/api/v1/mypage/data-usage', () => {
    return HttpResponse.json(mockDataUsage)
  }),

  http.get('*/api/v1/mypage/billing/history', () => {
    return HttpResponse.json(mockBillingHistory)
  }),

  http.get('*/api/v1/mypage/billing', () => {
    return HttpResponse.json(mockBillingDetail)
  }),

  http.get('*/api/v1/mypage/notifications', () => {
    return HttpResponse.json(mockNotifications)
  }),
]
