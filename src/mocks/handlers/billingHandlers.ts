/**
 * @fileoverview 請求情報用MSWハンドラー
 * @module mocks/handlers/billingHandlers
 *
 * 請求情報、支払い方法、請求履歴のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  CurrentBilling,
  BillingHistoryResponse,
  PaymentMethod,
  UpdatePaymentMethodRequest,
  BillingErrorResponse,
} from '@/types'

/**
 * モック用現在月の請求情報
 */
const mockCurrentBilling: CurrentBilling = {
  billingId: 'billing-202501',
  billingMonth: '2025-01',
  status: 'pending',
  baseFee: 2970,
  callFee: 0,
  dataAdditionalFee: 0,
  optionFee: 1100,
  deviceInstallment: 4987,
  discount: 0,
  subtotal: 9057,
  tax: 906,
  total: 9963,
  dueDate: '2025-02-28',
  paymentMethod: 'credit_card',
}

/**
 * モック用請求履歴
 */
const mockBillingHistory: BillingHistoryResponse = {
  items: [
    {
      billingId: 'billing-202412',
      billingMonth: '2024-12',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 4987,
      total: 9963,
      paidDate: '2024-12-27',
      paymentMethod: 'credit_card',
    },
    {
      billingId: 'billing-202411',
      billingMonth: '2024-11',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 4987,
      total: 9963,
      paidDate: '2024-11-27',
      paymentMethod: 'credit_card',
    },
    {
      billingId: 'billing-202410',
      billingMonth: '2024-10',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 4987,
      total: 9963,
      paidDate: '2024-10-28',
      paymentMethod: 'credit_card',
    },
    {
      billingId: 'billing-202409',
      billingMonth: '2024-09',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 0,
      total: 4976,
      paidDate: '2024-09-27',
      paymentMethod: 'credit_card',
    },
    {
      billingId: 'billing-202408',
      billingMonth: '2024-08',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 0,
      total: 4070,
      paidDate: '2024-08-27',
      paymentMethod: 'credit_card',
    },
    {
      billingId: 'billing-202407',
      billingMonth: '2024-07',
      status: 'paid',
      baseFee: 2970,
      optionFee: 1100,
      callCharges: 0,
      dataOverageCharges: 0,
      deviceInstallment: 0,
      total: 4070,
      paidDate: '2024-07-29',
      paymentMethod: 'credit_card',
    },
  ],
  totalCount: 6,
  page: 1,
  pageSize: 10,
}

/**
 * モック用支払い方法
 */
const mockPaymentMethod: PaymentMethod = {
  type: 'credit_card',
  cardInfo: {
    cardId: 'card-001',
    brand: 'visa',
    lastFourDigits: '4242',
    expiryDate: '12/26',
    holderName: 'TARO YAMADA',
  },
  isDefault: true,
}

/**
 * 請求情報用MSWハンドラー
 */
export const billingHandlers = [
  // 現在月の請求情報取得
  http.get('*/api/v1/billing/current', () => {
    return HttpResponse.json(mockCurrentBilling)
  }),

  // 請求履歴取得
  http.get('*/api/v1/billing/history', () => {
    return HttpResponse.json(mockBillingHistory)
  }),

  // 支払い方法取得
  http.get('*/api/v1/billing/payment-method', () => {
    return HttpResponse.json(mockPaymentMethod)
  }),

  // 支払い方法更新
  http.put('*/api/v1/billing/payment-method', async ({ request }) => {
    const body = (await request.json()) as UpdatePaymentMethodRequest

    if (body.type === 'credit_card' && !body.cardToken && !body.cardId) {
      const errorResponse: BillingErrorResponse = {
        status: 'error',
        message: 'カード情報が不正です',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const updatedPaymentMethod: PaymentMethod = {
      type: body.type,
      cardInfo:
        body.type === 'credit_card'
          ? {
              cardId: body.cardId || 'card-new',
              brand: 'visa',
              lastFourDigits: '1234',
              expiryDate: '12/28',
              holderName: 'TARO YAMADA',
            }
          : undefined,
      isDefault: true,
    }

    return HttpResponse.json(updatedPaymentMethod)
  }),
]
