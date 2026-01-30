/**
 * @fileoverview 契約情報用MSWハンドラー
 * @module mocks/handlers/contractHandlers
 *
 * 契約情報、契約者情報、デバイス情報のモックハンドラー。
 */

import { http, HttpResponse } from 'msw'
import type { ContractSummary, ContractDetails, DeviceInfo } from '@/types'

/**
 * モック用契約サマリー
 */
const mockContractSummary: ContractSummary = {
  contractId: 'contract-001',
  status: 'active',
  planName: 'ahamo',
  startDate: '2023-04-01',
  phoneNumber: '090-1234-5678',
  monthlyBaseFee: 2970,
}

/**
 * モック用契約詳細
 */
const mockContractDetails: ContractDetails = {
  contractId: 'contract-001',
  contractNumber: 'CNT-2023-001234',
  status: 'active',
  startDate: '2023-04-01',
  phoneNumber: '090-1234-5678',
  plan: {
    planId: 'plan-ahamo',
    planName: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
  },
  simInfo: {
    simType: 'eSIM',
    iccid: '8981100012345678901',
    activationDate: '2023-04-01',
  },
  contractor: {
    name: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    dateOfBirth: '1990-01-15',
    postalCode: '100-0001',
    address: '東京都千代田区千代田1-1-1',
    contactPhone: '090-1234-5678',
    email: 'test@docomo.ne.jp',
  },
  options: [
    {
      optionId: 'opt-001',
      optionName: 'かけ放題オプション',
      monthlyFee: 1100,
      startDate: '2023-04-01',
    },
  ],
}

/**
 * モック用デバイス情報
 */
const mockDeviceInfo: DeviceInfo = {
  deviceId: 'device-001',
  deviceName: 'iPhone 16 Pro',
  manufacturer: 'Apple',
  modelNumber: 'A3293',
  imei: '35912345678901*',
  purchaseDate: '2024-09-20',
  warrantyEndDate: '2025-09-19',
  installmentBalance: 89760,
  installmentRemainingCount: 18,
}

/**
 * 契約情報用MSWハンドラー
 */
export const contractHandlers = [
  // 契約サマリー取得
  http.get('*/api/v1/contract/summary', () => {
    return HttpResponse.json(mockContractSummary)
  }),

  // 契約詳細取得
  http.get('*/api/v1/contract/details', () => {
    return HttpResponse.json(mockContractDetails)
  }),

  // デバイス情報取得
  http.get('*/api/v1/contract/device', () => {
    return HttpResponse.json(mockDeviceInfo)
  }),
]
