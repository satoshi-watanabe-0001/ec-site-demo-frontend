/**
 * @fileoverview オプション管理コンポーネント
 * @module components/mypage/OptionsManager
 *
 * オプションサービスの追加・解除を管理するインターフェース。
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useOptions } from '@/hooks'
import { subscribeOption, unsubscribeOption } from '@/services/accountService'
import { useQueryClient } from '@tanstack/react-query'
import type { OptionService } from '@/types'

/**
 * カテゴリ表示名マップ
 */
const categoryLabels: Record<OptionService['category'], string> = {
  data: 'データ通信',
  call: '通話',
  insurance: '補償',
  entertainment: 'エンタメ',
}

/**
 * オプション管理コンポーネント
 *
 * @returns オプション管理要素
 */
export function OptionsManager(): React.ReactElement {
  const { data: optionsData, isLoading } = useOptions()
  const queryClient = useQueryClient()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleToggleOption = async (option: OptionService): Promise<void> => {
    setProcessingId(option.optionId)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      if (option.isSubscribed) {
        await unsubscribeOption(option.optionId)
        setSuccessMessage(`${option.optionName}を解除しました。`)
      } else {
        await subscribeOption(option.optionId)
        setSuccessMessage(`${option.optionName}を追加しました。`)
      }
      // データを再取得
      await queryClient.invalidateQueries({ queryKey: ['account', 'options'] })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'オプションの変更に失敗しました')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-label="読み込み中">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-primary" />
        <span className="ml-3 text-slate-400">読み込み中...</span>
      </div>
    )
  }

  const options = optionsData?.options ?? []
  const subscribedOptions = options.filter(o => o.isSubscribed)
  const availableOptions = options.filter(o => !o.isSubscribed)

  return (
    <div className="space-y-6">
      {/* メッセージ */}
      {successMessage && (
        <div
          className="rounded-md bg-emerald-500/10 border border-emerald-500 p-4 text-emerald-400 text-sm"
          role="status"
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="rounded-md bg-red-500/10 border border-red-500 p-4 text-red-500 text-sm"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {/* 契約中のオプション */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">契約中のオプション</h3>
        {subscribedOptions.length === 0 ? (
          <p className="text-sm text-slate-400">契約中のオプションはありません。</p>
        ) : (
          <div className="space-y-3">
            {subscribedOptions.map(option => (
              <div
                key={option.optionId}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{option.optionName}</h4>
                    <span className="rounded-full bg-slate-600 px-2 py-0.5 text-xs text-slate-300">
                      {categoryLabels[option.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{option.description}</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    ¥{option.monthlyPrice.toLocaleString()}/月
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={processingId === option.optionId}
                  onClick={() => handleToggleOption(option)}
                >
                  {processingId === option.optionId ? '処理中...' : '解除'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 追加可能なオプション */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">追加可能なオプション</h3>
        {availableOptions.length === 0 ? (
          <p className="text-sm text-slate-400">追加可能なオプションはありません。</p>
        ) : (
          <div className="space-y-3">
            {availableOptions.map(option => (
              <div
                key={option.optionId}
                className="flex items-center justify-between rounded-lg border border-slate-700 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{option.optionName}</h4>
                    <span className="rounded-full bg-slate-600 px-2 py-0.5 text-xs text-slate-300">
                      {categoryLabels[option.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{option.description}</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    ¥{option.monthlyPrice.toLocaleString()}/月
                  </p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  disabled={processingId === option.optionId}
                  onClick={() => handleToggleOption(option)}
                >
                  {processingId === option.optionId ? '処理中...' : '追加'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
