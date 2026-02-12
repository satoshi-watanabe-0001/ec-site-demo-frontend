/**
 * @fileoverview 請求情報API用MSWハンドラー
 * @module mocks/handlers/billingHandlers
 *
 * 請求情報APIのモックハンドラー。
 * 請求情報取得、支払い方法管理をモック化。
 */

import { http, HttpResponse } from 'msw'
import type { BillingResponse } from '@/services/billingService'

const mockBillingResponse: BillingResponse = {
  current: {
    currentMonthTotal: 6050,
    basicFee: 2970,
    callCharge: 0,
    optionFee: 3080,
    otherCharges: 0,
    discount: 0,
    previousMonthTotal: 6050,
    monthOverMonthDiff: 0,
    details: [
      { label: '基本料金（ahamo）', amount: 2970 },
      { label: 'ahamo大盛り', amount: 1980 },
      { label: 'かけ放題オプション', amount: 1100 },
    ],
    billingPeriodStart: '2026-02-01',
    billingPeriodEnd: '2026-02-28',
  },
  history: [
    {
      id: 'bill-001',
      billingMonth: '2026-01',
      amount: 6050,
      paymentStatus: 'paid',
      paidAt: '2026-01-25T00:00:00Z',
      invoiceUrl: '/invoices/2026-01.pdf',
    },
    {
      id: 'bill-002',
      billingMonth: '2025-12',
      amount: 6050,
      paymentStatus: 'paid',
      paidAt: '2025-12-25T00:00:00Z',
      invoiceUrl: '/invoices/2025-12.pdf',
    },
    {
      id: 'bill-003',
      billingMonth: '2025-11',
      amount: 6050,
      paymentStatus: 'paid',
      paidAt: '2025-11-25T00:00:00Z',
      invoiceUrl: '/invoices/2025-11.pdf',
    },
    {
      id: 'bill-004',
      billingMonth: '2025-10',
      amount: 4950,
      paymentStatus: 'paid',
      paidAt: '2025-10-25T00:00:00Z',
      invoiceUrl: '/invoices/2025-10.pdf',
    },
    {
      id: 'bill-005',
      billingMonth: '2025-09',
      amount: 4950,
      paymentStatus: 'paid',
      paidAt: '2025-09-25T00:00:00Z',
      invoiceUrl: '/invoices/2025-09.pdf',
    },
    {
      id: 'bill-006',
      billingMonth: '2025-08',
      amount: 2970,
      paymentStatus: 'paid',
      paidAt: '2025-08-25T00:00:00Z',
      invoiceUrl: '/invoices/2025-08.pdf',
    },
  ],
  paymentMethod: {
    id: 'pm-001',
    type: 'credit_card',
    lastFourDigits: '4242',
    cardBrand: 'VISA',
    expiryDate: '12/28',
    bankName: null,
    accountType: null,
    accountLastFourDigits: null,
    isDefault: true,
  },
}

export const billingHandlers = [
  http.get('*/api/v1/account/billing', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockBillingResponse)
  }),
]
