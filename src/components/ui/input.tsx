/**
 * @fileoverview 汎用入力フィールドコンポーネント
 * @module components/ui/input
 *
 * 複数のタイプとエラー状態をサポートする再利用可能な入力コンポーネント。
 * アクセシビリティ対応とキーボードナビゲーションをサポート。
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * 入力コンポーネントのProps型定義
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** エラー状態かどうか */
  error?: boolean
  /** エラーメッセージ */
  errorMessage?: string
}

/**
 * 汎用入力フィールドコンポーネント
 *
 * @param props - 入力フィールドのプロパティ
 * @returns 入力フィールド要素
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-600 focus:ring-primary focus:border-primary',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && errorMessage && (
          <p id={`${props.id}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
