/**
 * @fileoverview グラデーションボタンコンポーネント
 * @module components/ui/gradient-button
 *
 * ahamoブランドカラーを使用したグラデーションボタン。
 * CTAボタンとして使用される主要なアクションボタン。
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * グラデーションボタンのProps型定義
 */
interface GradientButtonProps {
  /** ボタンの子要素 */
  children: React.ReactNode
  /** 追加のCSSクラス */
  className?: string
  /** ボタンのサイズ */
  size?: 'sm' | 'md' | 'lg'
  /** クリックハンドラー */
  onClick?: () => void
  /** ボタンのタイプ */
  type?: 'button' | 'submit' | 'reset'
  /** 無効状態 */
  disabled?: boolean
}

/**
 * グラデーションボタンコンポーネント
 *
 * ahamoブランドのオレンジから赤へのグラデーションを使用した
 * 目立つCTAボタン。
 *
 * @param props - ボタンのプロパティ
 * @returns グラデーションボタン要素
 */
export function GradientButton({
  children,
  className,
  size = 'md',
  ...props
}: GradientButtonProps): React.ReactElement {
  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  }

  return (
    <Button
      className={cn(
        'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
