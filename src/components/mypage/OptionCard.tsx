/**
 * @fileoverview オプション管理カードコンポーネント
 * @module components/mypage/OptionCard
 *
 * オプションの情報表示と登録/解除ボタンを提供するカード。
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import type { AvailableOption } from '@/types/account'
import { cn } from '@/lib/utils'

/**
 * オプションカードのProps
 */
interface OptionCardProps {
  /** オプション情報 */
  option: AvailableOption
  /** 登録ボタンクリック時のコールバック */
  onEnroll: (optionId: string) => void
  /** 解除ボタンクリック時のコールバック */
  onCancel: (optionId: string) => void
  /** 操作中かどうか */
  isLoading?: boolean
  /** 追加のCSSクラス */
  className?: string
}

/**
 * オプション管理カードコンポーネント
 */
export function OptionCard({
  option,
  onEnroll,
  onCancel,
  isLoading = false,
  className,
}: OptionCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-700 bg-slate-800 p-5 transition-all hover:border-slate-600',
        option.isEnrolled && 'border-primary/50 bg-primary/5',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{option.optionName}</h3>
            {option.isEnrolled && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                登録中
              </span>
            )}
          </div>
          <span className="mt-1 inline-block rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
            {option.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-white">
            &yen;{option.monthlyPrice.toLocaleString()}
          </span>
          <span className="block text-xs text-slate-400">/月</span>
        </div>
      </div>
      <p className="mb-4 text-sm text-slate-400">{option.description}</p>
      {option.isEnrolled ? (
        <Button
          variant="outline"
          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={() => onCancel(option.optionId)}
          disabled={isLoading}
        >
          {isLoading ? '処理中...' : '解除する'}
        </Button>
      ) : (
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={() => onEnroll(option.optionId)}
          disabled={isLoading}
        >
          {isLoading ? '処理中...' : '登録する'}
        </Button>
      )}
    </div>
  )
}
