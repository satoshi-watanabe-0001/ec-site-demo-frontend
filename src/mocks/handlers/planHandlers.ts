/**
 * @fileoverview プラン管理用MSWハンドラー
 * @module mocks/handlers/planHandlers
 *
 * プラン情報、プラン変更のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type {
  Plan,
  AvailablePlansResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  PlanChangeSimulation,
  PlanErrorResponse,
} from '@/types'

/**
 * モック用ahamoプラン
 */
const ahamoPlan: Plan = {
  planId: 'plan-ahamo',
  planName: 'ahamo',
  planType: 'ahamo',
  monthlyFee: 2970,
  dataCapacity: 20,
  freeCallMinutes: 5,
  is5GSupported: true,
  isInternationalRoamingSupported: true,
  description: '20GB + 5分以内の国内通話無料',
  features: [
    '月間データ容量20GB',
    '5分以内の国内通話無料',
    '5G対応',
    '海外82の国・地域でそのまま使える',
    'テザリング無料',
  ],
}

/**
 * モック用ahamo大盛りプラン
 */
const ahamoLargePlan: Plan = {
  planId: 'plan-ahamo-large',
  planName: 'ahamo大盛り',
  planType: 'ahamo_large',
  monthlyFee: 4950,
  dataCapacity: 100,
  freeCallMinutes: 5,
  is5GSupported: true,
  isInternationalRoamingSupported: true,
  description: '100GB + 5分以内の国内通話無料',
  features: [
    '月間データ容量100GB',
    '5分以内の国内通話無料',
    '5G対応',
    '海外82の国・地域でそのまま使える',
    'テザリング無料',
    '大容量で動画も安心',
  ],
}

/**
 * プラン管理用MSWハンドラー
 */
export const planHandlers = [
  // 利用可能プラン一覧取得
  http.get('*/api/v1/plans', () => {
    const response: AvailablePlansResponse = {
      currentPlan: ahamoPlan,
      availablePlans: [ahamoPlan, ahamoLargePlan],
    }
    return HttpResponse.json(response)
  }),

  // プラン変更シミュレーション
  http.post('*/api/v1/plans/simulate', async ({ request }) => {
    const body = (await request.json()) as ChangePlanRequest
    const newPlan = body.newPlanId === 'plan-ahamo-large' ? ahamoLargePlan : ahamoPlan

    const simulation: PlanChangeSimulation = {
      currentPlan: ahamoPlan,
      newPlan,
      currentMonthlyFee: ahamoPlan.monthlyFee,
      newMonthlyFee: newPlan.monthlyFee,
      priceDifference: newPlan.monthlyFee - ahamoPlan.monthlyFee,
      monthlyFeeDifference: newPlan.monthlyFee - ahamoPlan.monthlyFee,
      firstMonthBilling: newPlan.monthlyFee,
      effectiveDate: body.effectiveDate || new Date().toISOString().split('T')[0],
      notes: [
        'プラン変更は即時適用されます',
        '日割り計算は行われません',
        '変更後のデータ容量は翌月1日にリセットされます',
      ],
    }

    return HttpResponse.json(simulation)
  }),

  // プラン変更実行
  http.post('*/api/v1/plans/change', async ({ request }) => {
    const body = (await request.json()) as ChangePlanRequest

    if (body.newPlanId === ahamoPlan.planId) {
      const errorResponse: PlanErrorResponse = {
        status: 'error',
        message: '現在と同じプランには変更できません',
        timestamp: new Date().toISOString(),
      }
      return HttpResponse.json(errorResponse, { status: 400 })
    }

    const newPlan = body.newPlanId === 'plan-ahamo-large' ? ahamoLargePlan : ahamoPlan

    const response: ChangePlanResponse = {
      success: true,
      message: 'プランを変更しました',
      effectiveDate: body.effectiveDate || new Date().toISOString().split('T')[0],
      newPlan,
      priceDifference: newPlan.monthlyFee - ahamoPlan.monthlyFee,
    }

    return HttpResponse.json(response)
  }),
]
