/**
 * @fileoverview 契約情報API用MSWハンドラー
 * @module mocks/handlers/contractHandlers
 *
 * 契約情報APIのモックハンドラー。
 * 契約情報取得、プラン変更、オプション管理をモック化。
 */

import { http, HttpResponse } from 'msw'
import type { ContractInfo, PlanInfo, AvailableOption, PlanChangeRequest } from '@/types/contract'

const mockContractInfo: ContractInfo = {
  contractId: 'CT-2024-001',
  contractor: {
    lastName: '山田',
    firstName: '太郎',
    lastNameKana: 'ヤマダ',
    firstNameKana: 'タロウ',
    dateOfBirth: '1990-05-15',
    postalCode: '150-0001',
    address: '東京都渋谷区神宮前1-2-3',
    phoneNumber: '090-1234-5678',
    email: 'test@docomo.ne.jp',
  },
  details: {
    phoneNumber: '090-1234-5678',
    contractDate: '2023-04-01',
    planName: 'ahamo',
    dataCapacity: 20,
    monthlyBasicFee: 2970,
    options: [
      {
        id: 'opt-001',
        name: 'ahamo大盛り',
        monthlyFee: 1980,
        description: 'データ容量を+80GB追加（合計100GB）',
        startDate: '2023-06-01',
        status: 'active',
      },
      {
        id: 'opt-002',
        name: 'かけ放題オプション',
        monthlyFee: 1100,
        description: '国内通話かけ放題',
        startDate: '2023-04-01',
        status: 'active',
      },
    ],
  },
}

const mockPlans: PlanInfo[] = [
  {
    id: 'plan-ahamo',
    name: 'ahamo',
    dataCapacity: 20,
    monthlyFee: 2970,
    description: '20GBまで使える基本プラン。5分以内の国内通話無料。',
    fiveMinuteCallFree: true,
    unlimitedCallFee: 1100,
  },
  {
    id: 'plan-ahamo-large',
    name: 'ahamo大盛り',
    dataCapacity: 100,
    monthlyFee: 4950,
    description: '100GBまで使える大容量プラン。5分以内の国内通話無料。',
    fiveMinuteCallFree: true,
    unlimitedCallFee: 1100,
  },
]

const mockAvailableOptions: AvailableOption[] = [
  {
    id: 'opt-003',
    name: 'ケータイ補償サービス',
    monthlyFee: 825,
    description: '端末の故障・紛失時に補償を受けられるサービス',
    category: '補償・保険',
  },
  {
    id: 'opt-004',
    name: 'dアニメストア',
    monthlyFee: 550,
    description: 'アニメ見放題サービス',
    category: 'エンタメ',
  },
  {
    id: 'opt-005',
    name: 'Disney+',
    monthlyFee: 990,
    description: 'ディズニー作品が見放題',
    category: 'エンタメ',
  },
  {
    id: 'opt-006',
    name: 'あんしんセキュリティ',
    monthlyFee: 220,
    description: 'ウイルス対策・危険サイトブロック',
    category: 'セキュリティ',
  },
]

export const contractHandlers = [
  http.get('*/api/v1/account/contract', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockContractInfo)
  }),

  http.get('*/api/v1/account/plans', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockPlans)
  }),

  http.put('*/api/v1/account/plan', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }

    const body = (await request.json()) as PlanChangeRequest
    return HttpResponse.json({
      status: 'accepted',
      message: 'プラン変更を受け付けました',
      effectiveDate:
        body.effectiveDate === 'immediate' ? new Date().toISOString() : '2026-03-01T00:00:00Z',
    })
  }),

  http.get('*/api/v1/account/options/available', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json(mockAvailableOptions)
  }),

  http.post('*/api/v1/account/options', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json({ status: 'success', message: 'オプションを追加しました' })
  }),

  http.delete('*/api/v1/account/options/:optionId', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'error', message: '認証が必要です' }, { status: 401 })
    }
    return HttpResponse.json({ status: 'success', message: 'オプションを解約しました' })
  }),
]
