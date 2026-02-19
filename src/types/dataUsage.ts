/**
 * @fileoverview データ使用量関連の型定義
 * @module types/dataUsage
 */

export interface DailyUsage {
  date: string
  usageGB: number
}

export interface DataUsageDetail {
  currentMonth: {
    usedGB: number
    totalGB: number
    usagePercentage: number
    remainingGB: number
    resetDate: string
    lastUpdated: string
  }
  dailyBreakdown: DailyUsage[]
  previousMonth: {
    usedGB: number
    totalGB: number
  }
  averageDaily: number
  projectedUsage: number
}
