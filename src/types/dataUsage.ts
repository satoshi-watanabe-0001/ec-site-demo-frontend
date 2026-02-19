/**
 * @fileoverview データ使用量関連の型定義
 * @module types/dataUsage
 */

export interface DailyUsage {
  date: string
  usageGB: number
}

export interface DataUsageInfo {
  totalCapacityGB: number
  usedGB: number
  remainingGB: number
  usagePercent: number
  lastUpdated: string
  billingPeriodStart: string
  billingPeriodEnd: string
  dailyUsage: DailyUsage[]
}

export interface DataUsageResponse {
  dataUsage: DataUsageInfo
}
