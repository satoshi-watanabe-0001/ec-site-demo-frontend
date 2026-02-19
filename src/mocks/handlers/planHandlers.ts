/**
 * @fileoverview プラン管理関連MSWハンドラー
 * @module mocks/handlers/planHandlers
 *
 * プラン情報、プラン変更、オプションサービスのモックAPI。
 */

import { http, HttpResponse } from 'msw'
import type { AvailablePlan, PlanChangeRequest, PlanChangeResponse, OptionsResponse } from '@/types'

const mockCurrentPlan = {
  plan: {
    id: 'plan-ahamo',
    name: 'ahamo',
    type: 'ahamo' as const,
    monthlyFee: 2970,
    dataCapacityGB: 20,
    description: '20GB + 5分以内の国内通話無料',
    features: [
      '月間データ容量20GB',
      '5分以内の国内通話無料',
      '海外82の国・地域でそのまま使える',
      'テザリング無料',
    ],
  },
}

const mockAvailablePlans: { plans: AvailablePlan[] } = {
  plans: [
    {
      id: 'plan-ahamo',
      name: 'ahamo',
      type: 'ahamo',
      monthlyFee: 2970,
      dataCapacityGB: 20,
      description: '20GB + 5分以内の国内通話無料',
      features: [
        '月間データ容量20GB',
        '5分以内の国内通話無料',
        '海外82の国・地域でそのまま使える',
        'テザリング無料',
      ],
    },
    {
      id: 'plan-ahamo-large',
      name: 'ahamo大盛り',
      type: 'ahamo_large',
      monthlyFee: 4950,
      dataCapacityGB: 100,
      description: '100GB + 5分以内の国内通話無料',
      features: [
        '月間データ容量100GB（20GB + 大盛りオプション80GB）',
        '5分以内の国内通話無料',
        '海外82の国・地域でそのまま使える',
        'テザリング無料',
        '大容量で動画もSNSも安心',
      ],
    },
  ],
}

const mockOptions: OptionsResponse = {
  options: [
    {
      id: 'opt-kakehoudai',
      name: 'かけ放題オプション',
      monthlyFee: 1100,
      description: '国内通話が24時間無料になります',
      isSubscribed: false,
      category: '通話',
    },
    {
      id: 'opt-oomori',
      name: 'ahamo大盛り',
      monthlyFee: 1980,
      description: '月間データ容量を+80GBで合計100GBに増量',
      isSubscribed: false,
      category: 'データ',
    },
    {
      id: 'opt-anshin',
      name: 'あんしんセキュリティ',
      monthlyFee: 220,
      description: 'ウイルス対策・迷惑メール対策など',
      isSubscribed: true,
      category: 'セキュリティ',
    },
    {
      id: 'opt-cloud',
      name: 'クラウドストレージ（50GB）',
      monthlyFee: 440,
      description: '写真・動画をクラウドに自動バックアップ',
      isSubscribed: false,
      category: 'ストレージ',
    },
  ],
}

export const planHandlers = [
  http.get('*/api/v1/mypage/plans/current', () => {
    return HttpResponse.json(mockCurrentPlan)
  }),

  http.get('*/api/v1/mypage/plans/available', () => {
    return HttpResponse.json(mockAvailablePlans)
  }),

  http.post('*/api/v1/mypage/plans/change', async ({ request }) => {
    const body = (await request.json()) as PlanChangeRequest
    const selectedPlan = mockAvailablePlans.plans.find(p => p.id === body.planId)
    if (!selectedPlan) {
      return HttpResponse.json(
        { success: false, message: '指定されたプランが見つかりません' },
        { status: 400 }
      )
    }
    const response: PlanChangeResponse = {
      success: true,
      message: `${selectedPlan.name}への変更を受け付けました。${body.effectiveDate}から適用されます。`,
      effectiveDate: body.effectiveDate,
    }
    return HttpResponse.json(response)
  }),

  http.get('*/api/v1/mypage/options', () => {
    return HttpResponse.json(mockOptions)
  }),

  http.post('*/api/v1/mypage/options/:optionId/subscribe', async ({ params }) => {
    const { optionId } = params
    const option = mockOptions.options.find(o => o.id === optionId)
    if (!option) {
      return HttpResponse.json(
        { success: false, message: '指定されたオプションが見つかりません' },
        { status: 400 }
      )
    }
    return HttpResponse.json({
      success: true,
      message: `${option.name}への加入を受け付けました`,
    })
  }),
]
