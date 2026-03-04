/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * 契約中オプションの解約と追加可能オプションの申し込みを管理するページ。
 */

'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getOptions, addOption, cancelOption } from '@/services/accountService'
import type { OptionService } from '@/types'
import { CheckCircle, Plus, Trash2, AlertTriangle } from 'lucide-react'

/**
 * オプション管理ページコンポーネント
 *
 * @returns オプション管理ページ要素
 */
export default function OptionsPage(): React.ReactElement {
  const [options, setOptions] = useState<OptionService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)

  /**
   * オプション一覧を取得
   *
   * @param showLoading - ローディングスケルトンを表示するかどうか（初回読み込み時のみtrue）
   */
  const fetchOptions = async (showLoading = true): Promise<void> => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      const data = await getOptions()
      setOptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプション情報の取得に失敗しました。')
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  /**
   * オプション追加処理
   */
  const handleAddOption = async (optionId: string): Promise<void> => {
    setProcessingId(optionId)
    setError(null)
    setSuccess(null)

    try {
      const result = await addOption(optionId)
      setSuccess(result.message)
      // オプション一覧をバックグラウンドで再取得（スケルトン非表示）
      await fetchOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプションの追加に失敗しました。')
    } finally {
      setProcessingId(null)
    }
  }

  /**
   * オプション解約処理
   */
  const handleCancelOption = async (optionId: string): Promise<void> => {
    setProcessingId(optionId)
    setError(null)
    setSuccess(null)
    setConfirmCancelId(null)

    try {
      const result = await cancelOption(optionId)
      setSuccess(result.message)
      // オプション一覧をバックグラウンドで再取得（スケルトン非表示）
      await fetchOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'オプションの解約に失敗しました。')
    } finally {
      setProcessingId(null)
    }
  }

  /** 契約中オプション */
  const activeOptions = options.filter(opt => opt.status === 'active')
  /** 追加可能オプション */
  const availableOptions = options.filter(opt => opt.status === 'available')

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-20 bg-slate-700 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && options.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6" role="alert">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ページタイトル */}
      <h2 className="text-xl font-bold text-white">オプション管理</h2>

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
      {error && options.length > 0 && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4" role="alert">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* 契約中オプション */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="active-options-title">
        <h3 id="active-options-title" className="text-lg font-bold text-white mb-4">
          契約中オプション
        </h3>
        {activeOptions.length > 0 ? (
          <div className="space-y-4">
            {activeOptions.map(option => (
              <div
                key={option.optionId}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold">{option.name}</h4>
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
                        契約中
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                    <p className="text-white font-medium mt-2">
                      月額 ¥{option.monthlyFee.toLocaleString()}（税込）
                    </p>
                  </div>
                  <div className="ml-4">
                    {confirmCancelId === option.optionId ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-red-400 text-xs mb-1">本当に解約しますか？</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOption(option.optionId)}
                          disabled={processingId === option.optionId}
                        >
                          {processingId === option.optionId ? '処理中...' : '解約する'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmCancelId(null)}
                        >
                          キャンセル
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400/50 hover:bg-red-500/10"
                        onClick={() => setConfirmCancelId(option.optionId)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        解約
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">契約中のオプションはありません。</p>
        )}
      </section>

      {/* 追加可能オプション */}
      <section className="bg-slate-800 rounded-lg p-6" aria-labelledby="available-options-title">
        <h3 id="available-options-title" className="text-lg font-bold text-white mb-4">
          追加可能オプション
        </h3>
        {availableOptions.length > 0 ? (
          <div className="space-y-4">
            {availableOptions.map(option => (
              <div
                key={option.optionId}
                className={cn(
                  'rounded-lg p-4 border transition-colors',
                  'bg-slate-700/30 border-slate-600 hover:border-primary/50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{option.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                    <p className="text-white font-medium mt-2">
                      月額 ¥{option.monthlyFee.toLocaleString()}（税込）
                    </p>
                  </div>
                  <div className="ml-4">
                    <Button
                      onClick={() => handleAddOption(option.optionId)}
                      disabled={processingId === option.optionId}
                      className="bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      {processingId === option.optionId ? (
                        '処理中...'
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          追加
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">追加可能なオプションはありません。</p>
        )}
      </section>

      {/* 注意事項 */}
      <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-yellow-300">
            <p className="font-medium">オプションに関する注意事項</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-300/80">
              <li>オプションの追加・解約は即時反映されます。</li>
              <li>月途中での追加・解約は日割り計算が適用されます。</li>
              <li>一部オプションには最低利用期間があります。</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
