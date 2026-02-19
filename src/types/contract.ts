/**
 * @fileoverview 契約情報関連の型定義
 * @module types/contract
 */

export type PlanType = 'ahamo' | 'ahamo_large'

export interface ContractPlan {
  id: string
  name: string
  type: PlanType
  monthlyFee: number
  dataCapacityGB: number
  description: string
}

export interface DeviceInfo {
  id: string
  name: string
  imageUrl: string
  purchaseDate: string
  paymentStatus: 'paid' | 'installment'
  remainingBalance?: number
  totalInstallments?: number
  completedInstallments?: number
}

export interface ContractInfo {
  contractId: string
  phoneNumber: string
  plan: ContractPlan
  device: DeviceInfo
  contractStartDate: string
  status: 'active' | 'suspended' | 'cancelled'
  simType: 'physical' | 'esim'
}

export interface ContractResponse {
  contract: ContractInfo
}
