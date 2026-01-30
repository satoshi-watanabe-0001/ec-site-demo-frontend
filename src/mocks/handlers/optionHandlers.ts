/**
 * @fileoverview オプションサービス管理用MSWハンドラー
 * @module mocks/handlers/optionHandlers
 *
 * オプションサービス情報、契約・解約のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  OptionService,
  OptionsResponse,
  SubscribeOptionRequest,
  SubscribeOptionResponse,
  UnsubscribeOptionRequest,
  UnsubscribeOptionResponse,
  OptionErrorResponse,
} from '@/types'

/**
 * モック用契約中オプション
 */
const mockSubscribedOptions: OptionService[] = [
  {
    optionId: 'opt-call-unlimited',
    optionName: 'かけ放題オプション',
    category: 'call',
    monthlyFee: 1100,
    description: '国内通話が24時間かけ放題',
    features: ['国内通話24時間かけ放題', '5分超過分も無料'],
    status: 'subscribed',
    subscribedDate: '2023-04-01',
    isCancellable: true,
  },
]

/**
 * モック用利用可能オプション
 */
const mockAvailableOptions: OptionService[] = [
  {
    optionId: 'opt-security',
    optionName: 'あんしんセキュリティ',
    category: 'security',
    monthlyFee: 220,
    description: 'ウイルス対策、危険サイトブロック',
    features: ['ウイルス対策', '危険サイトブロック', '迷惑電話対策'],
    status: 'available',
    isCancellable: true,
  },
  {
    optionId: 'opt-cloud',
    optionName: 'クラウド容量オプション',
    category: 'data',
    monthlyFee: 440,
    description: 'クラウドストレージ50GB追加',
    features: ['クラウドストレージ50GB', '自動バックアップ', 'どこからでもアクセス'],
    status: 'available',
    isCancellable: true,
  },
  {
    optionId: 'opt-support',
    optionName: 'あんしん遠隔サポート',
    category: 'support',
    monthlyFee: 440,
    description: 'スマホの操作をオペレーターが遠隔サポート',
    features: ['遠隔操作サポート', '電話サポート', '初期設定サポート'],
    status: 'available',
    isCancellable: true,
  },
  {
    optionId: 'opt-disney',
    optionName: 'Disney+',
    category: 'entertainment',
    monthlyFee: 990,
    description: 'Disney+が楽しめる',
    features: ['Disney+見放題', '4K対応', '同時視聴4台まで'],
    status: 'available',
    isCancellable: true,
    notes: '別途Disney+アカウントの作成が必要です',
  },
]

/**
 * オプションサービス管理用MSWハンドラー
 */
export const optionHandlers = [
  // オプション一覧取得
  http.get('*/api/v1/options', () => {
    const response: OptionsResponse = {
      subscribedOptions: mockSubscribedOptions,
      availableOptions: mockAvailableOptions,
    }
    return HttpResponse.json(response)
  }),

  // オプション契約
  http.post('*/api/v1/options/:optionId/subscribe', async ({ params, request }) => {
    const { optionId } = params
    const body = (await request.json()) as SubscribeOptionRequest

    const option = mockAvailableOptions.find(opt => opt.optionId === optionId)

    if (!option) {
      const errorResponse: OptionErrorResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 404 })
    }

    if (option.status === 'subscribed') {
      const errorResponse: OptionErrorResponse = {
        status: 'error',
        message: 'このオプションは既に契約済みです',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const subscribedOption: OptionService = {
      ...option,
      status: 'subscribed',
      subscribedDate: body.startDate || new Date().toISOString().split('T')[0],
    }

    const response: SubscribeOptionResponse = {
      success: true,
      message: `${option.optionName}を契約しました`,
      startDate: subscribedOption.subscribedDate || new Date().toISOString().split('T')[0],
      option: subscribedOption,
    }

    return HttpResponse.json(response)
  }),

  // オプション解約
  http.delete('*/api/v1/options/:optionId/subscribe', async ({ params, request }) => {
    const { optionId } = params
    const body = (await request.json()) as UnsubscribeOptionRequest

    const option = mockSubscribedOptions.find(opt => opt.optionId === optionId)

    if (!option) {
      const errorResponse: OptionErrorResponse = {
        status: 'error',
        message: '指定されたオプションが見つかりません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 404 })
    }

    if (!option.isCancellable) {
      const errorResponse: OptionErrorResponse = {
        status: 'error',
        message: 'このオプションは解約できません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const today = new Date()
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const endDate = body.endDate || lastDayOfMonth.toISOString().split('T')[0]

    const response: UnsubscribeOptionResponse = {
      success: true,
      message: `${option.optionName}を${endDate}付けで解約します`,
      endDate,
    }

    return HttpResponse.json(response)
  }),
]
