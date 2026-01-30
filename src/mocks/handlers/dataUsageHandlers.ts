/**
 * @fileoverview データ使用量用MSWハンドラー
 * @module mocks/handlers/dataUsageHandlers
 *
 * データ使用量、使用履歴のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  CurrentDataUsage,
  DataUsageHistoryResponse,
  DataAddOnOption,
  PurchaseDataAddOnRequest,
  PurchaseDataAddOnResponse,
} from '@/types'

/**
 * モック用現在のデータ使用量
 */
const mockCurrentDataUsage: CurrentDataUsage = {
  dataCapacity: 20,
  usedData: 12.5,
  remainingData: 7.5,
  usagePercentage: 62.5,
  periodStartDate: '2025-01-01',
  periodEndDate: '2025-01-31',
  resetDate: '2025-02-01',
  additionalData: 0,
  carryOverData: 0,
}

/**
 * 日別使用量データを生成
 */
const generateDailyUsage = () => {
  const dailyUsage = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dailyUsage.push({
      date: date.toISOString().split('T')[0],
      usedData: Math.round((Math.random() * 0.8 + 0.2) * 100) / 100,
    })
  }

  return dailyUsage
}

/**
 * 月別使用量データを生成
 */
const generateMonthlyUsage = () => {
  const monthlyUsage = []
  const today = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyUsage.push({
      month,
      usedData: Math.round((Math.random() * 10 + 10) * 100) / 100,
      dataCapacity: 20,
      additionalData: 0,
    })
  }

  return monthlyUsage
}

/**
 * モック用データ使用量履歴
 */
const mockDataUsageHistory: DataUsageHistoryResponse = {
  dailyUsage: generateDailyUsage(),
  monthlyUsage: generateMonthlyUsage(),
}

/**
 * モック用データ追加購入オプション
 */
const mockDataAddOnOptions: DataAddOnOption[] = [
  {
    optionId: 'addon-1gb',
    dataAmount: 1,
    price: 550,
    validityDays: 31,
    isAvailable: true,
    description: '1GBのデータ容量を追加します',
  },
  {
    optionId: 'addon-3gb',
    dataAmount: 3,
    price: 1320,
    validityDays: 31,
    isAvailable: true,
    description: '3GBのデータ容量を追加します',
  },
  {
    optionId: 'addon-5gb',
    dataAmount: 5,
    price: 1980,
    validityDays: 31,
    isAvailable: true,
    description: '5GBのデータ容量を追加します',
  },
]

/**
 * データ使用量用MSWハンドラー
 */
export const dataUsageHandlers = [
  // 現在のデータ使用量取得
  http.get('*/api/v1/data-usage/current', () => {
    return HttpResponse.json(mockCurrentDataUsage)
  }),

  // データ使用量履歴取得
  http.get('*/api/v1/data-usage/history', () => {
    return HttpResponse.json(mockDataUsageHistory)
  }),

  // データ追加購入オプション取得
  http.get('*/api/v1/data-usage/add-on-options', () => {
    return HttpResponse.json(mockDataAddOnOptions)
  }),

  // データ追加購入
  http.post('*/api/v1/data-usage/purchase', async ({ request }) => {
    const body = (await request.json()) as PurchaseDataAddOnRequest
    const option = mockDataAddOnOptions.find(opt => opt.optionId === body.optionId)

    if (!option) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '指定されたオプションが見つかりません',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    const response: PurchaseDataAddOnResponse = {
      success: true,
      message: `${option.dataAmount}GBのデータを追加しました`,
      newRemainingData: mockCurrentDataUsage.remainingData + option.dataAmount,
    }

    return HttpResponse.json(response)
  }),
]
