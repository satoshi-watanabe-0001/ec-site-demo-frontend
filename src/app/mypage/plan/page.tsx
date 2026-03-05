/**
 * @fileoverview プラン変更ページ
 * @module app/mypage/plan/page
 *
 * 現在のプランの表示と、プラン変更の申し込みフローを提供。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRightLeft, CheckCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getPlans, changePlan } from '@/services/accountService'
import type { AvailablePlan } from '@/types'

/**
 * プラン変更ページコンポーネント
 *
 * @returns プラン変更ページ要素
 */
export default function PlanChangePage(): React.ReactElement {
  const [plans, setPlans] = useState<AvailablePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [applyTiming, setApplyTiming] = useState<'next_month' | 'immediate'>('next_month')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await getPlans()
        setPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const currentPlan = plans.find(p => p.isCurrent)
  const selectedPlan = plans.find(p => p.id === selectedPlanId)

  /**
   * プラン変更を実行
   */
  const handleSubmit = async (): Promise<void> => {
    if (!selectedPlanId) return

    setIsSubmitting(true)
    setError(null)

    try {
      const message = await changePlan({
        newPlanId: selectedPlanId,
        applyTiming,
      })
      setSuccessMessage(message)
      setShowConfirm(false)
      setSelectedPlanId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プラン変更に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error && !plans.length) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">プラン変更</h1>
        <p className="text-slate-400 mt-1">ご利用プランの変更ができます</p>
      </div>

      {/* 成功メッセージ */}
      {successMessage && (
        <div className="rounded-md bg-green-500/10 border border-green-500 p-4 text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div
          className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-400 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* プラン一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <article
            key={plan.id}
            className={cn(
              'relative rounded-lg p-6 shadow-lg border-2 transition-all duration-200 cursor-pointer',
              plan.isCurrent
                ? 'bg-slate-800 border-orange-500'
                : selectedPlanId === plan.id
                  ? 'bg-slate-800 border-blue-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            )}
            onClick={() => {
              if (!plan.isCurrent) {
                setSelectedPlanId(plan.id)
                setShowConfirm(false)
                setSuccessMessage(null)
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' && !plan.isCurrent) {
                setSelectedPlanId(plan.id)
                setShowConfirm(false)
                setSuccessMessage(null)
              }
            }}
            aria-pressed={selectedPlanId === plan.id}
          >
            {/* 現在のプランバッジ */}
            {plan.isCurrent && (
              <span className="absolute -top-3 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                現在のプラン
              </span>
            )}

            {/* 選択済みバッジ */}
            {selectedPlanId === plan.id && !plan.isCurrent && (
              <span className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                選択中
              </span>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

            <div className="mb-4">
              <span className="text-3xl font-bold text-white">{plan.price.toLocaleString()}</span>
              <span className="text-slate-400 ml-1">円/月（税込）</span>
            </div>

            <div className="flex gap-4 mb-4">
              <div>
                <span className="text-lg font-bold text-orange-500">{plan.dataCapacity}GB</span>
                <span className="text-xs text-slate-400 ml-1">データ</span>
              </div>
              <div>
                <span className="text-lg font-bold text-orange-500">{plan.freeCallMinutes}分</span>
                <span className="text-xs text-slate-400 ml-1">無料通話</span>
              </div>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* プラン変更フロー */}
      {selectedPlanId && !showConfirm && (
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-orange-500" />
            適用タイミング
          </h2>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <input
                type="radio"
                name="timing"
                value="next_month"
                checked={applyTiming === 'next_month'}
                onChange={() => setApplyTiming('next_month')}
                className="text-orange-500 focus:ring-orange-500"
              />
              <div>
                <p className="text-white font-medium">来月から適用</p>
                <p className="text-sm text-slate-400">翌月1日からプランが変更されます</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <input
                type="radio"
                name="timing"
                value="immediate"
                checked={applyTiming === 'immediate'}
                onChange={() => setApplyTiming('immediate')}
                className="text-orange-500 focus:ring-orange-500"
              />
              <div>
                <p className="text-white font-medium">即時適用</p>
                <p className="text-sm text-slate-400">すぐにプランが変更されます（日割り計算）</p>
              </div>
            </label>
          </div>

          <Button
            onClick={() => setShowConfirm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6"
          >
            確認画面へ
          </Button>
        </div>
      )}

      {/* 確認画面 */}
      {showConfirm && selectedPlan && currentPlan && (
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-orange-500/50">
          <h2 className="text-lg font-semibold text-white mb-4">プラン変更の確認</h2>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">変更前</p>
                <p className="text-white font-bold">{currentPlan.name}</p>
                <p className="text-slate-400">{currentPlan.price.toLocaleString()}円/月</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">変更後</p>
                <p className="text-white font-bold">{selectedPlan.name}</p>
                <p className="text-orange-400">{selectedPlan.price.toLocaleString()}円/月</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">適用タイミング</p>
              <p className="text-white font-medium">
                {applyTiming === 'next_month' ? '来月から適用' : '即時適用'}
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-400">
                ※ プラン変更後、元のプランに戻す場合は再度お手続きが必要です。
                <br />※ 適用タイミングにより料金の日割り計算が行われる場合があります。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6"
            >
              {isSubmitting ? '処理中...' : 'プランを変更する'}
            </Button>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
              戻る
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
