'use client'

/**
 * @fileoverview プラン選択コンポーネント
 * @module components/account/PlanSelector
 *
 * 利用可能なプラン一覧を表示し、プラン変更を実行する。
 */

import { useState } from 'react'
import { useContractInfo } from '@/hooks/useContractInfo'
import { changePlan } from '@/services/accountService'

/**
 * 利用可能なプランの定義
 */
const availablePlans = [
  {
    id: 'ahamo-20gb',
    name: 'ahamo（20GB）',
    price: 2970,
    data: 20,
    call: '5分以内の国内通話無料',
    features: ['20GBのデータ容量', '5分以内の国内通話無料', '海外82の国・地域で使える', 'dカードボーナスパケット+1GB'],
  },
  {
    id: 'ahamo-100gb',
    name: 'ahamo大盛り（100GB）',
    price: 4950,
    data: 100,
    call: '5分以内の国内通話無料',
    features: ['100GBの大容量', '5分以内の国内通話無料', '海外82の国・地域で使える', 'テザリング100GBまで', 'dカードボーナスパケット+5GB'],
  },
]

/**
 * プラン選択コンポーネント
 *
 * 現在のプラン情報を表示し、プラン変更の選択・実行を提供する。
 */
export function PlanSelector() {
  const { data: contractData, isLoading } = useContractInfo()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // プラン変更実行ハンドラー
  const handlePlanChange = async () => {
    if (!selectedPlanId) return

    try {
      setIsSubmitting(true)
      setMessage(null)
      const result = await changePlan({ newPlanId: selectedPlanId })
      setMessage({ type: 'success', text: result.message })
      setShowConfirm(false)
      setSelectedPlanId(null)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'プラン変更に失敗しました。',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 h-6 w-1/3 rounded bg-slate-700" />
            <div className="h-4 w-2/3 rounded bg-slate-700" />
          </div>
        ))}
      </div>
    )
  }

  const currentPlanId = contractData?.planId

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-md p-4 text-sm ${
            message.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {/* プラン一覧 */}
      <div className="grid gap-6 md:grid-cols-2">
        {availablePlans.map(plan => {
          const isCurrent = plan.id === currentPlanId
          const isSelected = plan.id === selectedPlanId

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-6 transition-colors ${
                isCurrent
                  ? 'border-blue-500 bg-slate-800'
                  : isSelected
                    ? 'border-green-500 bg-slate-800'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-4 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white">
                  現在のプラン
                </span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold">
                ¥{plan.price.toLocaleString()}
                <span className="text-sm font-normal text-slate-400">/月（税込）</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">
                データ容量: {plan.data}GB ・ {plan.call}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button
                  type="button"
                  className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                  onClick={() => {
                    setSelectedPlanId(plan.id)
                    setShowConfirm(true)
                  }}
                >
                  {isSelected ? '選択中' : 'このプランに変更'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 確認ダイアログ */}
      {showConfirm && selectedPlanId && (
        <div className="rounded-lg border border-yellow-600 bg-yellow-900/20 p-6">
          <h3 className="text-lg font-semibold text-yellow-400">プラン変更の確認</h3>
          <p className="mt-2 text-sm text-slate-300">
            「{availablePlans.find(p => p.id === selectedPlanId)?.name}」に変更します。
            変更は翌月1日より適用されます。
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={handlePlanChange}
            >
              {isSubmitting ? '変更中...' : '変更を確定する'}
            </button>
            <button
              type="button"
              className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
              onClick={() => {
                setShowConfirm(false)
                setSelectedPlanId(null)
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
