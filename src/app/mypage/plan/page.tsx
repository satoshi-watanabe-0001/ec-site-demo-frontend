/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan/page
 *
 * 現在のプラン表示、変更可能プラン一覧、適用時期の選択、注意事項表示を行うページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getContractInfo, changePlan } from '@/services/accountService'
import type { ContractInfo } from '@/types'
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

/**
 * 利用可能プラン一覧
 */
const availablePlans = [
  {
    id: 'ahamo',
    name: 'ahamo',
    monthlyFee: 2970,
    dataCapacity: 20,
    description: '月額2,970円（税込）で20GBのデータ通信と5分以内の国内通話無料',
    features: ['20GBのデータ通信', '5分以内の国内通話無料', '海外82の国・地域でデータ通信可能'],
  },
  {
    id: 'ahamo-large',
    name: 'ahamo大盛り',
    monthlyFee: 4950,
    dataCapacity: 100,
    description: '月額4,950円（税込）で100GBの大容量データ通信',
    features: [
      '100GBのデータ通信（20GB + 大盛りオプション80GB）',
      '5分以内の国内通話無料',
      '海外82の国・地域でデータ通信可能',
      'テザリング無制限',
    ],
  },
]

/**
 * プラン変更ページコンポーネント
 *
 * @returns プラン変更ページ要素
 */
export default function PlanChangePage(): React.ReactElement {
  const [contract, setContract] = useState<ContractInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [applyTiming, setApplyTiming] = useState<'next_month' | 'immediate'>('next_month')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchContract = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getContractInfo()
        setContract(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '契約情報の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchContract()
  }, [])

  /**
   * プラン変更確認を表示
   */
  const handlePlanSelect = (planId: string): void => {
    setSelectedPlan(planId)
    setShowConfirm(true)
    setSuccess(null)
    setError(null)
  }

  /**
   * プラン変更を実行
   */
  const handlePlanChange = async (): Promise<void> => {
    if (!selectedPlan) return
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await changePlan({
        newPlanId: selectedPlan,
        applyTiming,
      })
      setSuccess(result.message)
      setShowConfirm(false)
      setSelectedPlan(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プラン変更に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-32 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error && !contract) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  /**
   * 現在のプランIDを判定
   */
  const currentPlanId = contract?.currentPlanName?.includes('大盛り') ? 'ahamo-large' : 'ahamo'

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">プラン変更</h2>

      {/* 成功メッセージ */}
      {success && (
        <div
          className="bg-green-500/10 border border-green-500 rounded-lg p-4 flex items-center gap-3"
          role="status"
        >
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {/* エラーメッセージ */}
      {error && contract && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4" role="alert">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* 現在のプラン */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="current-plan-title"
      >
        <h3 id="current-plan-title" className="text-lg font-bold text-white mb-4">
          現在のプラン
        </h3>
        <div className="bg-slate-700/50 rounded-lg p-4 border border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xl font-bold">{contract?.currentPlanName}</p>
              <p className="text-slate-400 text-sm mt-1">ご利用中のプラン</p>
            </div>
            <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
              契約中
            </span>
          </div>
        </div>
      </section>

      {/* 変更可能プラン一覧 */}
      <section
        className="bg-slate-800 rounded-lg p-6"
        aria-labelledby="available-plans-title"
      >
        <h3 id="available-plans-title" className="text-lg font-bold text-white mb-4">
          変更可能プラン
        </h3>
        <div className="space-y-4">
          {availablePlans.map(plan => {
            const isCurrent = plan.id === currentPlanId
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-lg p-6 border transition-colors',
                  isCurrent
                    ? 'bg-slate-700/30 border-slate-600'
                    : 'bg-slate-700/50 border-slate-600 hover:border-primary/50'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white text-lg font-bold">{plan.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      ¥{plan.monthlyFee.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-xs">/月（税込）</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.features.map(feature => (
                    <span
                      key={feature}
                      className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                {isCurrent ? (
                  <span className="text-slate-500 text-sm">現在ご利用中のプランです</span>
                ) : (
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    このプランに変更する
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 確認ダイアログ */}
      {showConfirm && selectedPlan && (
        <section
          className="bg-slate-800 rounded-lg p-6 border border-primary"
          aria-labelledby="confirm-plan-title"
        >
          <h3 id="confirm-plan-title" className="text-lg font-bold text-white mb-4">
            プラン変更の確認
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white">
              <span className="bg-slate-700 rounded-lg px-4 py-2">
                {contract?.currentPlanName}
              </span>
              <ArrowRight className="h-5 w-5 text-primary" />
              <span className="bg-primary/20 border border-primary rounded-lg px-4 py-2">
                {availablePlans.find(p => p.id === selectedPlan)?.name}
              </span>
            </div>

            {/* 適用時期 */}
            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-medium">適用時期</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="applyTiming"
                    value="next_month"
                    checked={applyTiming === 'next_month'}
                    onChange={() => setApplyTiming('next_month')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white text-sm">翌月から適用</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="applyTiming"
                    value="immediate"
                    checked={applyTiming === 'immediate'}
                    onChange={() => setApplyTiming('immediate')}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-white text-sm">即時適用</span>
                </label>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-yellow-300">
                  <p className="font-medium">注意事項</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-300/80">
                    <li>プラン変更は月1回まで可能です。</li>
                    <li>
                      即時適用の場合、日割り計算が適用されます。
                    </li>
                    <li>
                      大盛りオプションからahamoへの変更時、当月のデータ容量は変更後の容量が適用されます。
                    </li>
                    <li>プラン変更後のキャンセルはできません。</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handlePlanChange}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isSubmitting ? '変更中...' : 'プランを変更する'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirm(false)
                  setSelectedPlan(null)
                }}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
