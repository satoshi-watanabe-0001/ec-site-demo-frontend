/**
 * @fileoverview プラン管理用MSWハンドラー
 * @module mocks/handlers/planHandlers
 */

import { http, HttpResponse } from 'msw'
import type {
  PlanInfo,
  AvailablePlansResponse,
  PlanChangeRequest,
  PlanChangeResponse,
  OptionsResponse,
  OptionSubscribeResponse,
} from '@/types'

const currentPlan: PlanInfo = {
  planId: 'ahamo-basic',
  planName: 'ahamo',
  monthlyFee: 2970,
  dataCapacityGB: 20,
  description: '20GB + 5分かけ放題',
  features: [
    '月間データ容量20GB',
    '5分以内の国内通話無料',
    '海外82の国・地域で利用可能',
    'テザリング無料',
    'dカード支払いでボーナスパケット+1GB',
  ],
  isCurrentPlan: true,
}

const availablePlans: AvailablePlansResponse = {
  plans: [
    currentPlan,
    {
      planId: 'ahamo-large',
      planName: 'ahamo大盛り',
      monthlyFee: 4950,
      dataCapacityGB: 100,
      description: '100GB + 5分かけ放題',
      features: [
        '月間データ容量100GB',
        '5分以内の国内通話無料',
        '海外82の国・地域で利用可能',
        'テザリング無料',
        'dカード支払いでボーナスパケット+5GB',
        '大容量で動画もゲームも快適',
      ],
      isCurrentPlan: false,
    },
  ],
}

const mockOptions: OptionsResponse = {
  options: [
    {
      optionId: 'opt-kakehoudai',
      optionName: 'かけ放題オプション',
      monthlyFee: 1100,
      description: '国内通話が24時間かけ放題',
      features: ['国内通話24時間無料', '5分超過分も無料'],
      isSubscribed: false,
      category: '通話',
    },
    {
      optionId: 'opt-security',
      optionName: 'あんしんセキュリティ',
      monthlyFee: 550,
      description: 'ウイルス対策・危険サイトブロック',
      features: ['ウイルス対策', '危険サイトブロック', '迷惑メール対策', '迷惑電話対策'],
      isSubscribed: true,
      category: 'セキュリティ',
    },
    {
      optionId: 'opt-smartpark',
      optionName: 'スマートパーキング',
      monthlyFee: 330,
      description: 'クラウドストレージ50GB',
      features: ['クラウドストレージ50GB', '自動バックアップ', '写真・動画の保存'],
      isSubscribed: false,
      category: 'ストレージ',
    },
    {
      optionId: 'opt-insurance',
      optionName: 'ケータイ補償サービス',
      monthlyFee: 825,
      description: '故障・紛失時の端末補償',
      features: ['故障時の修理対応', '紛失時の端末交換', '水濡れ・全損補償'],
      isSubscribed: false,
      category: '補償',
    },
  ],
}

export const planHandlers = [
  http.get('*/api/v1/mypage/plans/current', () => {
    return HttpResponse.json(currentPlan)
  }),

  http.get('*/api/v1/mypage/plans/available', () => {
    return HttpResponse.json(availablePlans)
  }),

  http.post('*/api/v1/mypage/plans/change', async ({ request }) => {
    const body = (await request.json()) as PlanChangeRequest
    const targetPlan = availablePlans.plans.find(p => p.planId === body.newPlanId)

    if (!targetPlan) {
      return HttpResponse.json(
        { success: false, message: '指定されたプランが見つかりません' },
        { status: 400 }
      )
    }

    const response: PlanChangeResponse = {
      success: true,
      message: `プランを${targetPlan.planName}に変更しました`,
      effectiveDate: body.effectiveDate === 'immediate' ? new Date().toISOString() : '2026-03-01',
      newPlan: { ...targetPlan, isCurrentPlan: true },
    }
    return HttpResponse.json(response)
  }),

  http.get('*/api/v1/mypage/options', () => {
    return HttpResponse.json(mockOptions)
  }),

  http.post('*/api/v1/mypage/options/:optionId/subscribe', ({ params }) => {
    const { optionId } = params
    const option = mockOptions.options.find(o => o.optionId === optionId)

    if (!option) {
      return HttpResponse.json(
        { success: false, message: '指定されたオプションが見つかりません' },
        { status: 400 }
      )
    }

    const response: OptionSubscribeResponse = {
      success: true,
      message: `${option.optionName}に申し込みました`,
      optionId: option.optionId,
      startDate: new Date().toISOString(),
    }
    return HttpResponse.json(response)
  }),
]
