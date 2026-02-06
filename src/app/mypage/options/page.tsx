/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * EC-278: オプションサービスの管理ページ。
 * 契約中オプション一覧と利用可能オプションの追加/解除。
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useAvailableOptions } from '@/hooks/useAvailableOptions'
import { manageOption } from '@/services/mypageService'
import { cn } from '@/lib/utils'
import type { OptionChangeRequest } from '@/types'

const categoryLabels: Record<string, string> = {
  call: '通話',
  data: 'データ',
  insurance: '補償',
  other: 'その他',
}

export default function OptionsPage(): React.ReactElement {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data: options, isLoading, error, refetch } = useAvailableOptions(isAuthenticated)

  const [processingId, setProcessingId] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleOptionToggle = async (optionId: string, isSubscribed: boolean) => {
    setProcessingId(optionId)
    setMessage(null)
    try {
      const request: OptionChangeRequest = {
        optionId,
        action: isSubscribed ? 'remove' : 'add',
      }
      const result = await manageOption(request)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      await refetch()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'オプション変更に失敗しました。',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインページへリダイレクト中...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !options) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">オプション情報の取得に失敗しました。</p>
          </div>
        </div>
      </div>
    )
  }

  const subscribedOptions = options.filter(opt => opt.isSubscribed)
  const availableOptions = options.filter(opt => !opt.isSubscribed)

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            href="/mypage"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            マイページに戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">オプション管理</h1>
        </div>

        {message && (
          <div
            className={cn(
              'mb-6 p-4 rounded-xl text-sm',
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            )}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              契約中のオプション ({subscribedOptions.length}件)
            </h2>
            {subscribedOptions.length === 0 ? (
              <div className="rounded-2xl bg-white shadow-md p-6">
                <p className="text-sm text-gray-500">契約中のオプションはありません。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subscribedOptions.map(option => (
                  <div key={option.optionId} className="rounded-2xl bg-white shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{option.optionName}</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {categoryLabels[option.category] ?? option.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ¥{option.monthlyFee.toLocaleString()}
                          <span className="text-xs font-normal text-gray-500">/月</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptionToggle(option.optionId, option.isSubscribed)}
                        disabled={processingId === option.optionId}
                        className="ml-4 px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        {processingId === option.optionId ? '処理中...' : '解除する'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              追加可能なオプション ({availableOptions.length}件)
            </h2>
            {availableOptions.length === 0 ? (
              <div className="rounded-2xl bg-white shadow-md p-6">
                <p className="text-sm text-gray-500">追加可能なオプションはありません。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableOptions.map(option => (
                  <div key={option.optionId} className="rounded-2xl bg-white shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{option.optionName}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {categoryLabels[option.category] ?? option.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ¥{option.monthlyFee.toLocaleString()}
                          <span className="text-xs font-normal text-gray-500">/月</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptionToggle(option.optionId, option.isSubscribed)}
                        disabled={processingId === option.optionId}
                        className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        {processingId === option.optionId ? '処理中...' : '追加する'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
