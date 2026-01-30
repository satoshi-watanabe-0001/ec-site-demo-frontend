'use client'

/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * EC-278: アカウント管理機能
 * シナリオ8: オプション管理
 *
 * 契約中のオプション、利用可能なオプションの確認・申し込み・解約を行うページ。
 */

import { useEffect, useState } from 'react'
import { useOptionStore } from '@/store/optionStore'
import { getOptions, subscribeOption, unsubscribeOption } from '@/services/optionService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { OptionService } from '@/types'

/**
 * オプション管理ページコンポーネント
 *
 * @returns オプション管理ページ要素
 */
export default function OptionsPage() {
  const {
    subscribedOptions,
    availableOptions,
    setSubscribedOptions,
    setAvailableOptions,
    setLoading,
    isLoading,
  } = useOptionStore()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)

      try {
        const response = await getOptions()
        setSubscribedOptions(response.subscribedOptions)
        setAvailableOptions(response.availableOptions)
      } catch (err) {
        console.error('オプション情報の取得に失敗しました:', err)
        setError('オプション情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [setSubscribedOptions, setAvailableOptions, setLoading])

  const handleSubscribe = async (option: OptionService) => {
    setProcessingId(option.optionId)
    setError(null)
    setSuccess(null)

    try {
      await subscribeOption({ optionId: option.optionId })
      const response = await getOptions()
      setSubscribedOptions(response.subscribedOptions)
      setAvailableOptions(response.availableOptions)
      setSuccess(`${option.optionName}に申し込みました`)
    } catch (err) {
      console.error('オプション申し込みに失敗しました:', err)
      setError('オプション申し込みに失敗しました')
    } finally {
      setProcessingId(null)
    }
  }

  const handleUnsubscribe = async (option: OptionService) => {
    setProcessingId(option.optionId)
    setError(null)
    setSuccess(null)

    try {
      await unsubscribeOption({ optionId: option.optionId })
      const response = await getOptions()
      setSubscribedOptions(response.subscribedOptions)
      setAvailableOptions(response.availableOptions)
      setSuccess(`${option.optionName}を解約しました`)
    } catch (err) {
      console.error('オプション解約に失敗しました:', err)
      setError('オプション解約に失敗しました')
    } finally {
      setProcessingId(null)
    }
  }

  const renderOptionCard = (option: OptionService, isSubscribed: boolean) => (
    <div
      key={option.optionId}
      className={cn(
        'rounded-lg border p-4',
        isSubscribed ? 'border-green-500 bg-green-500/10' : 'border-slate-600 bg-slate-700/30'
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h4 className="font-bold text-white">{option.optionName}</h4>
          <span className="text-xs text-slate-400">{option.category}</span>
        </div>
        {isSubscribed && (
          <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
            契約中
          </span>
        )}
      </div>

      <p className="mb-3 text-sm text-slate-400">{option.description}</p>

      <div className="mb-3 flex items-baseline gap-1">
        <span className="text-xl font-bold text-primary">
          ¥{option.monthlyFee.toLocaleString()}
        </span>
        <span className="text-sm text-slate-400">/月</span>
      </div>

      {option.features && option.features.length > 0 && (
        <ul className="mb-4 space-y-1 text-sm text-slate-300">
          {option.features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      )}

      {isSubscribed ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleUnsubscribe(option)}
          disabled={processingId === option.optionId}
          className="w-full"
        >
          {processingId === option.optionId ? '処理中...' : '解約する'}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={() => handleSubscribe(option)}
          disabled={processingId === option.optionId}
          className="w-full"
        >
          {processingId === option.optionId ? '処理中...' : '申し込む'}
        </Button>
      )}
    </div>
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">オプション管理</h1>

      {error && (
        <div className="mb-6 rounded bg-red-500/20 p-4 text-red-400" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded bg-green-500/20 p-4 text-green-400" role="status">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* 契約中のオプション */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">契約中のオプション</h3>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 w-full rounded bg-slate-700" />
              <div className="h-32 w-full rounded bg-slate-700" />
            </div>
          ) : subscribedOptions.length === 0 ? (
            <p className="text-slate-400">契約中のオプションはありません</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {subscribedOptions.map(option => renderOptionCard(option, true))}
            </div>
          )}
        </div>

        {/* 利用可能なオプション */}
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">利用可能なオプション</h3>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 w-full rounded bg-slate-700" />
              <div className="h-32 w-full rounded bg-slate-700" />
            </div>
          ) : availableOptions.length === 0 ? (
            <p className="text-slate-400">利用可能なオプションはありません</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableOptions.map(option => renderOptionCard(option, false))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
