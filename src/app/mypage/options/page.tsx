/**
 * @fileoverview オプション管理ページ
 * @module app/mypage/options/page
 *
 * EC-278: オプションの確認・追加・解除画面。
 * 利用中のオプションと追加可能なオプションを管理。
 */

'use client'

import React, { useEffect, useState } from 'react'
import {
  Package,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Shield,
  Wifi,
  Phone,
  Tv,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AvailableOption, AvailableOptionsResponse } from '@/types/contract'

/** API Base URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * 金額のフォーマット
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount)
}

/**
 * カテゴリ別アイコンの取得
 */
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'data':
      return Wifi
    case 'call':
      return Phone
    case 'insurance':
      return Shield
    case 'entertainment':
      return Tv
    case 'security':
      return Shield
    default:
      return Package
  }
}

/**
 * カテゴリ名の日本語変換
 */
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'data':
      return 'データ通信'
    case 'call':
      return '通話'
    case 'insurance':
      return '補償'
    case 'entertainment':
      return 'エンターテインメント'
    case 'security':
      return 'セキュリティ'
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
  const [options, setOptions] = useState<AvailableOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/account/options`)
        if (res.ok) {
          const data: AvailableOptionsResponse = await res.json()
          setOptions(data.options)
        }
      } catch (error) {
        console.error('オプション情報の取得に失敗しました:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOptions()
  }, [])

  /**
   * メッセージ表示
   */
  const showMessage = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMessage(message)
      setErrorMessage('')
    } else {
      setErrorMessage(message)
      setSuccessMessage('')
    }
    setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 5000)
  }

  /**
   * オプション追加
   */
  const handleAddOption = async (option: AvailableOption) => {
    setProcessingId(option.id)
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/options/${option.id}`, {
        method: 'POST',
      })
      if (res.ok) {
        setOptions(prev => prev.map(o => (o.id === option.id ? { ...o, isSubscribed: true } : o)))
        showMessage('success', `${option.name}を追加しました`)
      } else {
        showMessage('error', `${option.name}の追加に失敗しました`)
      }
    } catch {
      showMessage('error', 'ネットワークエラーが発生しました')
    } finally {
      setProcessingId(null)
    }
  }

  /**
   * オプション解除
   */
  const handleRemoveOption = async (option: AvailableOption) => {
    setProcessingId(option.id)
    try {
      const res = await fetch(`${BASE_URL}/api/v1/account/options/${option.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setOptions(prev => prev.map(o => (o.id === option.id ? { ...o, isSubscribed: false } : o)))
        showMessage('success', `${option.name}を解除しました`)
      } else {
        showMessage('error', `${option.name}の解除に失敗しました`)
      }
    } catch {
      showMessage('error', 'ネットワークエラーが発生しました')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400" role="status" aria-label="読み込み中">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  const subscribedOptions = options.filter(o => o.isSubscribed)
  const availableOptions = options.filter(o => !o.isSubscribed)
  const totalOptionCost = subscribedOptions.reduce((sum, o) => sum + o.monthlyPrice, 0)

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-white">オプション管理</h1>
        <p className="text-slate-400 mt-1">オプションの確認・追加・解除ができます</p>
      </div>

      {/* メッセージ表示 */}
      {successMessage && (
        <div
          className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-4"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300 text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div
          className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg p-4"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* 利用中オプション概要 */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">利用中のオプション</p>
            <p className="text-white text-lg font-semibold mt-1">{subscribedOptions.length}件</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">オプション合計</p>
            <p className="text-white text-lg font-semibold mt-1">
              ¥{formatCurrency(totalOptionCost)}/月
            </p>
          </div>
        </div>
      </div>

      {/* 利用中オプション */}
      {subscribedOptions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">利用中のオプション</h2>
          <div className="space-y-3">
            {subscribedOptions.map(option => {
              const CategoryIcon = getCategoryIcon(option.category)
              return (
                <div
                  key={option.id}
                  className="bg-slate-800 rounded-lg p-5 border border-blue-700/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{option.name}</h3>
                          <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                            {getCategoryLabel(option.category)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {option.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-shrink-0">
                      <p className="text-white font-medium whitespace-nowrap">
                        ¥{formatCurrency(option.monthlyPrice)}/月
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(option)}
                        disabled={processingId === option.id}
                        className="border-red-700 text-red-400 hover:bg-red-900/30 hover:text-red-300 whitespace-nowrap"
                        aria-label={`${option.name}を解除`}
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        {processingId === option.id ? '処理中...' : '解除する'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 追加可能なオプション */}
      {availableOptions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">追加可能なオプション</h2>
          <div className="space-y-3">
            {availableOptions.map(option => {
              const CategoryIcon = getCategoryIcon(option.category)
              return (
                <div
                  key={option.id}
                  className="bg-slate-800 rounded-lg p-5 border border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{option.name}</h3>
                          <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                            {getCategoryLabel(option.category)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{option.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {option.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-shrink-0">
                      <p className="text-white font-medium whitespace-nowrap">
                        ¥{formatCurrency(option.monthlyPrice)}/月
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddOption(option)}
                        disabled={processingId === option.id}
                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                        aria-label={`${option.name}を追加`}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {processingId === option.id ? '処理中...' : '追加する'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
