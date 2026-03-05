'use client'

/**
 * @fileoverview オプション管理コンポーネント
 * @module components/account/OptionManager
 *
 * 契約中のオプションサービスの確認・解除と、
 * 利用可能なオプションサービスの追加を管理する。
 */

import { useState } from 'react'
import { useAccountOptions } from '@/hooks/useAccountOptions'
import { addOption, removeOption } from '@/services/accountService'
import type { ContractOption, AvailableOption } from '@/types'

/**
 * オプション管理コンポーネント
 *
 * 2つのセクション：
 * 1. 契約中のオプション（解除ボタン付き）
 * 2. 利用可能なオプション（追加ボタン付き）
 */
export function OptionManager() {
  const { data, isLoading, error, refetch } = useAccountOptions()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // オプション追加ハンドラー
  const handleAddOption = async (option: AvailableOption) => {
    try {
      setProcessingId(option.id)
      setMessage(null)
      await addOption({ optionId: option.id })
      setMessage({ type: 'success', text: `「${option.name}」を追加しました。` })
      await refetch()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'オプションの追加に失敗しました。',
      })
    } finally {
      setProcessingId(null)
    }
  }

  // オプション解除ハンドラー
  const handleRemoveOption = async (option: ContractOption) => {
    try {
      setProcessingId(option.id)
      setMessage(null)
      await removeOption(option.id)
      setMessage({ type: 'success', text: `「${option.name}」を解除しました。月末で適用終了となります。` })
      await refetch()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'オプションの解除に失敗しました。',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 h-4 w-1/3 rounded bg-slate-700" />
            <div className="h-4 w-2/3 rounded bg-slate-700" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/20 p-6 text-center" role="alert">
        <p className="text-red-400">{error.message}</p>
      </div>
    )
  }

  if (!data) return null

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

      {/* 契約中のオプション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">契約中のオプション</h2>
        {data.subscribedOptions.length === 0 ? (
          <p className="text-sm text-slate-400">契約中のオプションはありません</p>
        ) : (
          <div className="space-y-3">
            {data.subscribedOptions.map(option => (
              <div key={option.id} className="flex flex-col gap-3 rounded-md bg-slate-700 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-slate-400">{option.description}</p>
                  <p className="text-xs text-slate-500">
                    契約開始: {option.startDate} ・ 月額: ¥{option.monthlyPrice.toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={processingId === option.id}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={() => handleRemoveOption(option)}
                >
                  {processingId === option.id ? '解除中...' : '解除する'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 利用可能なオプション */}
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">利用可能なオプション</h2>
        {data.availableOptions.length === 0 ? (
          <p className="text-sm text-slate-400">追加可能なオプションはありません</p>
        ) : (
          <div className="space-y-4">
            {data.availableOptions.map(option => (
              <div key={option.id} className="rounded-md border border-slate-600 bg-slate-700 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{option.name}</h3>
                      <span className="rounded-full bg-slate-600 px-2 py-0.5 text-xs text-slate-300">
                        {option.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{option.description}</p>
                    <p className="mt-1 text-lg font-bold">
                      ¥{option.monthlyPrice.toLocaleString()}
                      <span className="text-sm font-normal text-slate-400">/月（税込）</span>
                    </p>
                    {option.features.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="text-green-400" aria-hidden="true">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={processingId === option.id}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => handleAddOption(option)}
                  >
                    {processingId === option.id ? '追加中...' : '追加する'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
