'use client'

import React, { useState } from 'react'
import type { NotificationSettings } from '@/types'

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings
  onSubmit: (settings: NotificationSettings) => Promise<void>
}

export function NotificationSettingsForm({
  initialSettings,
  onSubmit,
}: NotificationSettingsFormProps): React.ReactElement {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      await onSubmit(settings)
      setMessage({ type: 'success', text: '通知設定を更新しました' })
    } catch {
      setMessage({ type: 'error', text: '更新に失敗しました。もう一度お試しください。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleItems: { key: keyof NotificationSettings; label: string; description: string }[] = [
    { key: 'emailNotifications', label: 'メール通知', description: '重要なお知らせをメールで受信' },
    { key: 'smsNotifications', label: 'SMS通知', description: '契約に関する通知をSMSで受信' },
    { key: 'promotionalEmails', label: 'キャンペーン通知', description: 'お得なキャンペーン情報を受信' },
    { key: 'usageAlerts', label: 'データ使用量通知', description: 'データ使用量が閾値に達した際に通知' },
    { key: 'billingAlerts', label: '請求通知', description: '請求確定時に通知を受信' },
  ]

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg" data-testid="notification-settings-form">
      <h2 className="text-lg font-bold text-white mb-4">通知設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {toggleItems.map(item => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
          >
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(item.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings[item.key] ? 'bg-teal-600' : 'bg-slate-600'
              }`}
              role="switch"
              aria-checked={settings[item.key]}
              data-testid={`notification-toggle-${item.key}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings[item.key] ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-teal-500/20 text-teal-400'
                : 'bg-red-500/20 text-red-400'
            }`}
            data-testid="notification-form-message"
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="notification-submit-button"
        >
          {isSubmitting ? '更新中...' : '設定を保存'}
        </button>
      </form>
    </div>
  )
}
