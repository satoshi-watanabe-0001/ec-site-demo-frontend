/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * 契約中のオプションと利用可能なオプションの管理ページ。
 * オプションの追加・解除ができる。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Package, Plus, Minus, CheckCircle, Phone, Wifi, Shield, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getOptions, subscribeOption, unsubscribeOption } from '@/services/accountService'
import type { OptionService } from '@/types'

/**
 * カテゴリアイコンを取得
 */
function getCategoryIcon(category: OptionService['category']): React.ElementType {
  switch (category) {
    case 'call':
      return Phone
    case 'data':
      return Wifi
    case 'insurance':
      return Shield
    default:
      return Layers
  }
}

/**
 * カテゴリラベルを取得
 */
function getCategoryLabel(category: OptionService['category']): string {
  switch (category) {
    case 'call':
      return '通話'
    case 'data':
      return 'データ'
    case 'insurance':
      return '保険・補償'
    default:
      return 'その他'
  }
}

/**
 * オプション管理ページコンポーネント
 *
 * @returns オプション管理ページ要素
 */
export default function OptionsPage(): React.ReactElement {
  const [options, setOptions] = useState<OptionService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await getOptions()
        setOptions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  /**
   * オプション追加処理
   */
  const handleSubscribe = async (optionId: string): Promise<void> => {
    setProcessingId(optionId)
    setSuccessMessage(null)
    setError(null)

    try {
      const message = await subscribeOption(optionId)
      setSuccessMessage(message)
      // ローカル状態を更新
      setOptions(prev =>
        prev.map(o => (o.id === optionId ? { ...o, isSubscribed: true } : o))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプションの追加に失敗しました')
    } finally {
      setProcessingId(null)
    }
  }

  /**
   * オプション解除処理
   */
  const handleUnsubscribe = async (optionId: string): Promise<void> => {
    setProcessingId(optionId)
    setSuccessMessage(null)
    setError(null)

    try {
      const message = await unsubscribeOption(optionId)
      setSuccessMessage(message)
      // ローカル状態を更新
      setOptions(prev =>
        prev.map(o => (o.id === optionId ? { ...o, isSubscribed: false } : o))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプションの解除に失敗しました')
    } finally {
      setProcessingId(null)
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

  if (error && !options.length) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-6 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  const subscribedOptions = options.filter(o => o.isSubscribed)
  const availableOptions = options.filter(o => !o.isSubscribed)

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-white">オプション管理</h1>
        <p className="text-slate-400 mt-1">オプションサービスの追加・解除ができます</p>
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
        <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-400 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* 契約中のオプション */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-500" />
          契約中のオプション
          <span className="text-sm text-slate-400 font-normal">（{subscribedOptions.length}件）</span>
        </h2>

        {subscribedOptions.length > 0 ? (
          <div className="space-y-3">
            {subscribedOptions.map(option => {
              const Icon = getCategoryIcon(option.category)
              return (
                <div
                  key={option.id}
                  className="bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="bg-orange-500/10 rounded-lg p-3 self-start">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{option.name}</h3>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {getCategoryLabel(option.category)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{option.description}</p>
                    <p className="text-sm text-orange-400 font-medium mt-1">
                      月額 {option.monthlyFee.toLocaleString()}円
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start sm:self-center border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => handleUnsubscribe(option.id)}
                    disabled={processingId === option.id}
                  >
                    {processingId === option.id ? (
                      '処理中...'
                    ) : (
                      <>
                        <Minus className="h-4 w-4 mr-1" />
                        解除
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <p className="text-slate-400">契約中のオプションはありません</p>
          </div>
        )}
      </section>

      {/* 利用可能なオプション */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          利用可能なオプション
          <span className="text-sm text-slate-400 font-normal">（{availableOptions.length}件）</span>
        </h2>

        <div className="space-y-3">
          {availableOptions.map(option => {
            const Icon = getCategoryIcon(option.category)
            return (
              <div
                key={option.id}
                className={cn(
                  'bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center gap-4',
                  'hover:border-slate-600 transition-colors'
                )}
              >
                <div className="bg-blue-500/10 rounded-lg p-3 self-start">
                  <Icon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{option.name}</h3>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {getCategoryLabel(option.category)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{option.description}</p>
                  <p className="text-sm text-blue-400 font-medium mt-1">
                    月額 {option.monthlyFee.toLocaleString()}円
                  </p>
                </div>
                <Button
                  size="sm"
                  className="self-start sm:self-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  onClick={() => handleSubscribe(option.id)}
                  disabled={processingId === option.id}
                >
                  {processingId === option.id ? (
                    '処理中...'
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      追加
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
