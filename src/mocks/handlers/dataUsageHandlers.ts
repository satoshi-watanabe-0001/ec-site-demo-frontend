/**
 * @fileoverview データ使用量API用MSWハンドラー
 * @module mocks/handlers/dataUsageHandlers
 *
 * データ使用量APIのモックハンドラー。
 * データ使用量取得、使用履歴取得をモック化。
 */

import { http, HttpResponse } from 'msw'
import type { DataUsageResponse } from '@/services/dataUsageService'

function generateDailyUsage(): { date: string; usage: number }[] {
  const daily = []
  const now = new Date('2026-02-12')
  for (let i = 0; i < 12; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - (11 - i))
    daily.push({
      date: date.toISOString().split('T')[0],
      usage: Math.round((Math.random() * 2 + 0.5) * 10) / 10,
    })
  }
  return daily
}

function generateMonthlyUsage(): { month: string; usage: number; totalData: number }[] {
  return [
    { month: '2025-09', usage: 15.2, totalData: 100 },
    { month: '2025-10', usage: 18.7, totalData: 100 },
    { month: '2025-11', usage: 22.1, totalData: 100 },
    { month: '2025-12', usage: 16.8, totalData: 100 },
    { month: '2026-01', usage: 19.5, totalData: 100 },
    { month: '2026-02', usage: 12.5, totalData: 100 },
  ]
}

const mockDataUsageResponse: DataUsageResponse = {
  current: {
    usedData: 12.5,
    totalData: 100,
    remainingData: 87.5,
    usagePercentage: 12.5,
    updatedAt: '2026-02-12T08:00:00Z',
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
  },
  history: {
    daily: generateDailyUsage(),
    monthly: generateMonthlyUsage(),
  },
  charges: [
    {
      id: 'chg-001',
      chargedAt: '2026-01-15T14:30:00Z',
      amount: 1,
      fee: 550,
      expiresAt: '2026-01-31T23:59:59Z',
    },
    {
      id: 'chg-002',
      chargedAt: '2025-12-20T10:00:00Z',
      amount: 1,
      fee: 550,
      expiresAt: '2025-12-31T23:59:59Z',
    },
  ],
}

export const dataUsageHandlers = [
  http.get('*/api/v1/account/data-usage', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockDataUsageResponse)
  }),
]
