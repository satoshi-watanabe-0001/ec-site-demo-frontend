/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * 利用可能なオプション一覧を表示し、登録/解除機能を提供。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { OptionCard } from '@/components/mypage'
import { getAvailableOptions, enrollOption, cancelOption } from '@/services/accountService'
import type { AvailableOption } from '@/types/account'

/**
 * オプション管理ページコンポーネント
 */
export default function OptionsPage() {
  const [options, setOptions] = useState<AvailableOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOptions() {
      try {
        const data = await getAvailableOptions()
        setOptions(data.options)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOptions()
  }, [])

  const handleEnroll = async (optionId: string): Promise<void> => {
    setActionLoading(optionId)
    setSuccessMessage(null)
    setError(null)
    try {
      const result = await enrollOption(optionId)
      setSuccessMessage(result.message)
      // オプション一覧を再取得
      const updatedOptions = await getAvailableOptions()
      setOptions(updatedOptions.options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプション登録に失敗しました')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (optionId: string): Promise<void> => {
    if (!window.confirm('本当にこのオプションを解除しますか？')) {
      return
    }
    setActionLoading(optionId)
    setSuccessMessage(null)
    setError(null)
    try {
      const result = await cancelOption(optionId)
      setSuccessMessage(result.message)
      // オプション一覧を再取得
      const updatedOptions = await getAvailableOptions()
      setOptions(updatedOptions.options)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプション解除に失敗しました')
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error && options.length === 0) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  const enrolledOptions = options.filter(o => o.isEnrolled)
  const availableOptions = options.filter(o => !o.isEnrolled)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">オプション管理</h2>

      {successMessage && (
        <div className="rounded-md bg-green-500/10 border border-green-500 p-4 text-sm text-green-400" role="alert">
          {successMessage}
        </div>
      )}

      {error && options.length > 0 && (
        <div className="rounded-md bg-red-500/10 border border-red-500 p-4 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {/* 登録中のオプション */}
      {enrolledOptions.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-semibold text-white">登録中のオプション</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolledOptions.map(option => (
              <OptionCard
                key={option.optionId}
                option={option}
                onEnroll={handleEnroll}
                onCancel={handleCancel}
                isLoading={actionLoading === option.optionId}
              />
            ))}
          </div>
        </section>
      )}

      {/* 未登録のオプション */}
      {availableOptions.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-semibold text-white">利用可能なオプション</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {availableOptions.map(option => (
              <OptionCard
                key={option.optionId}
                option={option}
                onEnroll={handleEnroll}
                onCancel={handleCancel}
                isLoading={actionLoading === option.optionId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
