'use client'

/**
 * @fileoverview 通知設定コンポーネント
 * @module components/mypage/settings/NotificationSettings
 *
 * 通知の受信設定を管理するコンポーネント。
 */

import { useState, useEffect } from 'react'
import type { NotificationSettings as NotificationSettingsType } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * 通知設定コンポーネントのProps
 */
interface NotificationSettingsProps {
  /** 通知設定 */
  settings: NotificationSettingsType | null
  /** 読み込み中かどうか */
  isLoading?: boolean
  /** 送信中かどうか */
  isSubmitting?: boolean
  /** 送信時のコールバック */
  onSubmit?: (settings: NotificationSettingsType) => Promise<void>
  /** 追加のクラス名 */
  className?: string
}

/**
 * トグルスイッチコンポーネント
 */
function ToggleSwitch({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-white">{label}</p>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900',
          checked ? 'bg-primary' : 'bg-slate-600',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}

/**
 * 通知設定コンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns 通知設定表示
 */
export function NotificationSettings({
  settings,
  isLoading,
  isSubmitting,
  onSubmit,
  className,
}: NotificationSettingsProps) {
  const [formData, setFormData] = useState<NotificationSettingsType | null>(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleToggle = (
    category: 'email' | 'push' | 'sms',
    field: string,
    value: boolean
  ) => {
    if (!formData) return

    setFormData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }
    })
    setHasChanges(true)
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async () => {
    if (!onSubmit || !formData) return

    try {
      await onSubmit(formData)
      setSuccess(true)
      setHasChanges(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '設定の保存に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-32 rounded bg-slate-700" />
          <div className="space-y-4">
            <div className="h-12 w-full rounded bg-slate-700" />
            <div className="h-12 w-full rounded bg-slate-700" />
            <div className="h-12 w-full rounded bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
        <h3 className="mb-4 text-lg font-semibold text-white">通知設定</h3>
        <p className="text-slate-400">通知設定を取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg bg-slate-800 p-6', className)}>
      <h3 className="mb-6 text-lg font-semibold text-white">通知設定</h3>

      {error && (
        <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-500/20 p-3 text-sm text-green-400" role="status">
          設定を保存しました
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium text-slate-300">メール通知</h4>
          <div className="divide-y divide-slate-700 rounded bg-slate-700/30 px-4">
            <ToggleSwitch
              checked={formData.email.billing}
              onChange={value => handleToggle('email', 'billing', value)}
              disabled={isSubmitting}
              label="請求・支払い"
              description="請求確定、支払い完了のお知らせ"
            />
            <ToggleSwitch
              checked={formData.email.campaign}
              onChange={value => handleToggle('email', 'campaign', value)}
              disabled={isSubmitting}
              label="キャンペーン"
              description="お得なキャンペーン情報"
            />
            <ToggleSwitch
              checked={formData.email.service}
              onChange={value => handleToggle('email', 'service', value)}
              disabled={isSubmitting}
              label="サービス"
              description="サービスに関する重要なお知らせ"
            />
            <ToggleSwitch
              checked={formData.email.maintenance}
              onChange={value => handleToggle('email', 'maintenance', value)}
              disabled={isSubmitting}
              label="メンテナンス"
              description="システムメンテナンスのお知らせ"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-slate-300">プッシュ通知</h4>
          <div className="divide-y divide-slate-700 rounded bg-slate-700/30 px-4">
            <ToggleSwitch
              checked={formData.push.billing}
              onChange={value => handleToggle('push', 'billing', value)}
              disabled={isSubmitting}
              label="請求・支払い"
            />
            <ToggleSwitch
              checked={formData.push.campaign}
              onChange={value => handleToggle('push', 'campaign', value)}
              disabled={isSubmitting}
              label="キャンペーン"
            />
            <ToggleSwitch
              checked={formData.push.dataUsage}
              onChange={value => handleToggle('push', 'dataUsage', value)}
              disabled={isSubmitting}
              label="データ使用量"
              description="データ使用量の警告通知"
            />
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-medium text-slate-300">SMS通知</h4>
          <div className="divide-y divide-slate-700 rounded bg-slate-700/30 px-4">
            <ToggleSwitch
              checked={formData.sms.security}
              onChange={value => handleToggle('sms', 'security', value)}
              disabled={isSubmitting}
              label="セキュリティ"
              description="ログイン通知、パスワード変更通知"
            />
            <ToggleSwitch
              checked={formData.sms.billing}
              onChange={value => handleToggle('sms', 'billing', value)}
              disabled={isSubmitting}
              label="請求・支払い"
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '設定を保存'}
          </Button>
        </div>
      )}
    </div>
  )
}
