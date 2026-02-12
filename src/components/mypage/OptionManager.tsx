/**
 * @fileoverview オプションサービス管理コンポーネント
 * @module components/mypage/OptionManager
 *
 * 現在契約中のオプションと追加可能なオプションを管理。
 */

'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OptionService, AvailableOption } from '@/types/contract'

/**
 * オプション管理コンポーネントのProps型定義
 */
interface OptionManagerProps {
  /** 契約中のオプション */
  currentOptions: OptionService[]
  /** 追加可能なオプション */
  availableOptions: AvailableOption[]
  /** オプション追加処理 */
  onAddOption: (optionId: string) => void
  /** オプション解約処理 */
  onRemoveOption: (optionId: string) => void
  /** 処理中フラグ */
  isLoading?: boolean
}

/**
 * オプションサービス管理コンポーネント
 *
 * @param props - オプション管理のプロパティ
 * @returns オプション管理要素
 */
export function OptionManager({
  currentOptions,
  availableOptions,
  onAddOption,
  onRemoveOption,
  isLoading = false,
}: OptionManagerProps): React.ReactElement {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">契約中のオプション</h3>
        {currentOptions.length === 0 ? (
          <p className="text-sm text-slate-400">契約中のオプションはありません</p>
        ) : (
          <div className="space-y-3">
            {currentOptions.map(option => (
              <div
                key={option.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-slate-800 p-4 gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">{option.name}</h4>
                    <Badge
                      variant={option.status === 'active' ? 'success' : 'warning'}
                    >
                      {option.status === 'active' ? '利用中' : '申込中'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    契約開始: {new Date(option.startDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-white">
                    ¥{option.monthlyFee.toLocaleString()}/月
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveOption(option.id)}
                    disabled={isLoading}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4 mr-1" />
                    解約
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">追加可能なオプション</h3>
        <div className="space-y-3">
          {availableOptions.map(option => (
            <div
              key={option.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-slate-800 p-4 gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white">{option.name}</h4>
                  <Badge variant="default">{option.category}</Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">{option.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-white">
                  ¥{option.monthlyFee.toLocaleString()}/月
                </span>
                <Button
                  size="sm"
                  onClick={() => onAddOption(option.id)}
                  disabled={isLoading}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  追加
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
