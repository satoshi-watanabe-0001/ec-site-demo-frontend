/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan/page
 *
 * EC-278: プラン変更画面。
 * 現在のプランと利用可能なプランを比較・変更できる。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Smartphone, CheckCircle, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContractPlan, AvailablePlansResponse } from '@/types/contract'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 金額のフォーマット
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount)
}

/**
 * プラン変更ページコンポーネント
 *
 * @returns プラン変更ページ要素
 */
export default function PlanPage(): React.ReactElement {
  const [plansData, setPlansData] = useState<AvailablePlansResponse | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChanging, setIsChanging] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/account/plan`)
        if (res.ok) {
          const data: AvailablePlansResponse = await res.json()
          setPlansData(data)
          setSelectedPlanId(data.currentPlanId)
        }
      } catch (error) {
        console.error('プラン情報の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [])

  /**
   * プラン変更の実行
   */
  const handleChangePlan = async (plan: ContractPlan) => {
    if (plan.id === plansData?.currentPlanId) return

    setIsChanging(true)
    setErrorMessage('')
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      })
      if (res.ok) {
        setSuccessMessage(
          `${plan.name}プランへの変更が完了しました。次の請求サイクルから適用されます。`
        )
        setPlansData(prev => (prev ? { ...prev, currentPlanId: plan.id } : prev))
        setSelectedPlanId(plan.id)
      } else {
        setErrorMessage('プランの変更に失敗しました')
      }
    } catch {
      setErrorMessage('ネットワークエラーが発生しました')
    } finally {
      setIsChanging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">プラン変更</h1>
        <p className="text-slate-400 mt-1">ご利用プランの確認・変更ができます</p>
      </div>

      {/* メッセージ表示 */}
      {successMessage && (
        <div
          className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-4"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300 text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div
          className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg p-4"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* プラン一覧 */}
      {plansData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plansData.plans.map(plan => {
            const isCurrent = plan.id === plansData.currentPlanId
            const isSelected = plan.id === selectedPlanId
            return (
              <div
                key={plan.id}
                className={`bg-slate-800 rounded-lg p-6 border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-blue-500 ring-1 ring-blue-500/20'
                    : isSelected
                      ? 'border-blue-400/50'
                      : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${plan.name}プラン`}
              >
                {/* プランヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-blue-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                      {isCurrent && (
                        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">
                          現在のプラン
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 価格 */}
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">
                    ¥{formatCurrency(plan.monthlyPrice)}
                  </span>
                  <span className="text-slate-400 text-sm">/月（税込）</span>
                </div>

                {/* データ容量 */}
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-400">データ容量</p>
                  <p className="text-2xl font-bold text-white">{plan.dataCapacity}GB</p>
                </div>

                {/* 説明 */}
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                {/* 特徴 */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* アクションボタン */}
                {isCurrent ? (
                  <Button
                    disabled
                    className="w-full bg-slate-700 text-slate-400 cursor-not-allowed"
                  >
                    ご利用中のプラン
                  </Button>
                ) : (
                  <Button
                    onClick={e => {
                      e.stopPropagation()
                      handleChangePlan(plan)
                    }}
                    disabled={isChanging}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isChanging ? '変更中...' : 'このプランに変更する'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 注意事項 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-3">プラン変更に関する注意事項</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>・プラン変更は次の請求サイクルから適用されます</li>
          <li>・月途中でのプラン変更の場合、日割り計算は行われません</li>
          <li>・データ容量の引き継ぎはできません</li>
          <li>・プラン変更は月1回まで可能です</li>
        </ul>
      </div>
    </div>
  )
}
